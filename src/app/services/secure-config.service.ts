import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EnvironmentConfigService } from './environment-config.service';

interface SecureCredentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class SecureConfigService {
  private readonly CREDENTIALS_KEY = 'secure_credentials';
  private readonly ENCRYPTION_KEY: string;
  private loginAttempts = 0;
  private lockoutUntil = 0;

  constructor(private envConfig: EnvironmentConfigService) {
    this.ENCRYPTION_KEY = this.envConfig.getEncryptionKey();
  }

  /**
   * Get secure credentials from environment or secure storage
   */
  getCredentials(): SecureCredentials | null {
    // Check if we're in lockout period
    if (this.isLockedOut()) {
      throw new Error('Account temporarily locked due to too many failed attempts');
    }

    // First try to get from environment configuration (most secure)
    const envUsername = this.envConfig.getEnvironmentVariable('AUTH_USERNAME');
    const envPassword = this.envConfig.getEnvironmentVariable('AUTH_PASSWORD');

    if (envUsername && envPassword) {
      return { username: envUsername, password: envPassword };
    }

    // Fallback to secure storage
    return this.getStoredCredentials();
  }

  /**
   * Store credentials securely (for development/testing purposes)
   */
  storeCredentials(username: string, password: string): void {
    const authConfig = this.envConfig.getAuthConfig();
    if (!this.validatePassword(password, authConfig.passwordMinLength)) {
      throw new Error(`Password must be at least ${authConfig.passwordMinLength} characters long`);
    }

    const credentials: SecureCredentials = { username, password };
    const encryptedData = this.encryptData(JSON.stringify(credentials));
    
    try {
      // Use sessionStorage for temporary storage (cleared when browser closes)
      sessionStorage.setItem(this.CREDENTIALS_KEY, encryptedData);
    } catch (error) {
      console.error('Failed to store credentials:', error);
      throw new Error('Failed to store credentials securely');
    }
  }

  /**
   * Clear stored credentials
   */
  clearStoredCredentials(): void {
    try {
      sessionStorage.removeItem(this.CREDENTIALS_KEY);
    } catch (error) {
      console.error('Failed to clear stored credentials:', error);
    }
  }

  /**
   * Record a failed login attempt
   */
  recordFailedAttempt(): void {
    this.loginAttempts++;
    
    const authConfig = this.envConfig.getAuthConfig();
    if (authConfig.enableBruteForceProtection && 
        this.loginAttempts >= authConfig.maxLoginAttempts) {
      this.lockoutUntil = Date.now() + authConfig.lockoutDuration;
      console.warn(`Account locked for ${authConfig.lockoutDuration / 60000} minutes due to too many failed attempts`);
    }
  }

  /**
   * Reset login attempts on successful login
   */
  resetLoginAttempts(): void {
    this.loginAttempts = 0;
    this.lockoutUntil = 0;
  }

  /**
   * Check if account is currently locked out
   */
  private isLockedOut(): boolean {
    if (this.lockoutUntil > Date.now()) {
      return true;
    }
    
    // Reset lockout if time has passed
    if (this.lockoutUntil > 0 && this.lockoutUntil <= Date.now()) {
      this.lockoutUntil = 0;
      this.loginAttempts = 0;
    }
    
    return false;
  }

  /**
   * Get remaining lockout time in minutes
   */
  getRemainingLockoutTime(): number {
    if (this.lockoutUntil <= Date.now()) {
      return 0;
    }
    return Math.ceil((this.lockoutUntil - Date.now()) / 60000);
  }

  /**
   * Validate password strength
   */
  private validatePassword(password: string, minLength: number): boolean {
    return password.length >= minLength;
  }

  /**
   * Get stored credentials from secure storage
   */
  private getStoredCredentials(): SecureCredentials | null {
    try {
      const encryptedData = sessionStorage.getItem(this.CREDENTIALS_KEY);
      if (!encryptedData) {
        return null;
      }

      const decryptedData = this.decryptData(encryptedData);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Failed to retrieve stored credentials:', error);
      return null;
    }
  }

  /**
   * Simple encryption for stored credentials
   */
  private encryptData(data: string): string {
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length);
      encrypted += String.fromCharCode(charCode);
    }
    return btoa(encrypted);
  }

  /**
   * Simple decryption for stored credentials
   */
  private decryptData(encryptedData: string): string {
    try {
      const decoded = atob(encryptedData);
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length);
        decrypted += String.fromCharCode(charCode);
      }
      return decrypted;
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      return '';
    }
  }

  /**
   * Get current security status
   */
  getSecurityStatus(): {
    isLockedOut: boolean;
    remainingAttempts: number;
    remainingLockoutTime: number;
  } {
    return {
      isLockedOut: this.isLockedOut(),
      remainingAttempts: Math.max(0, environment.auth.maxLoginAttempts - this.loginAttempts),
      remainingLockoutTime: this.getRemainingLockoutTime()
    };
  }
} 