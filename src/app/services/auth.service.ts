import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { SecureConfigService } from './secure-config.service';
import { EnvironmentConfigService } from './environment-config.service';

interface AuthToken {
  token: string;
  expiresAt: number;
  username: string;
  csrfToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  private readonly STORAGE_KEY = 'auth_data';
  private readonly TOKEN_EXPIRY_HOURS: number;
  private readonly ENCRYPTION_KEY: string;

  constructor(
    private secureConfigService: SecureConfigService,
    private envConfig: EnvironmentConfigService
  ) {
    this.TOKEN_EXPIRY_HOURS = this.envConfig.getTokenExpiryHours();
    this.ENCRYPTION_KEY = this.envConfig.getEncryptionKey();
    this.checkAuthStatus();
  }

  login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        // Check if account is locked out
        const securityStatus = this.secureConfigService.getSecurityStatus();
        if (securityStatus.isLockedOut) {
          console.warn(`Account is locked for ${securityStatus.remainingLockoutTime} more minutes`);
          resolve(false);
          return;
        }

        // Get secure credentials
        const credentials = this.secureConfigService.getCredentials();
        
        if (!credentials) {
          console.error('No secure credentials configured');
          this.secureConfigService.recordFailedAttempt();
          resolve(false);
          return;
        }

        // Validate credentials
        if (username === credentials.username && password === credentials.password) {
          const authData: AuthToken = {
            token: this.generateSecureToken(),
            expiresAt: Date.now() + (this.TOKEN_EXPIRY_HOURS * 60 * 60 * 1000),
            username: username,
            csrfToken: this.generateCSRFToken()
          };

          this.saveAuthData(authData);
          this.isAuthenticatedSubject.next(true);
          
          // Reset failed attempts on successful login
          this.secureConfigService.resetLoginAttempts();
          
          resolve(true);
        } else {
          // Record failed attempt
          this.secureConfigService.recordFailedAttempt();
          resolve(false);
        }
      } catch (error) {
        console.error('Login error:', error);
        this.secureConfigService.recordFailedAttempt();
        resolve(false);
      }
    });
  }

  /**
   * Store credentials securely (for development/testing)
   */
  storeCredentials(username: string, password: string): void {
    this.secureConfigService.storeCredentials(username, password);
  }

  /**
   * Get security status for UI feedback
   */
  getSecurityStatus() {
    return this.secureConfigService.getSecurityStatus();
  }

  logout(): void {
    this.clearAuthData();
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    const authData = this.getAuthData();
    if (!authData) {
      return false;
    }

    // Check if token is expired
    if (Date.now() > authData.expiresAt) {
      this.logout();
      return false;
    }

    return this.isAuthenticatedSubject.value;
  }

  getUsername(): string | null {
    const authData = this.getAuthData();
    return authData?.username || null;
  }

  getAuthToken(): string | null {
    const authData = this.getAuthData();
    return authData?.token || null;
  }

  getCSRFToken(): string | null {
    const authData = this.getAuthData();
    return authData?.csrfToken || null;
  }

  refreshToken(): boolean {
    const authData = this.getAuthData();
    if (!authData) {
      return false;
    }

    // Refresh token if it expires within the next hour
    const oneHourFromNow = Date.now() + (60 * 60 * 1000);
    if (authData.expiresAt < oneHourFromNow) {
      const newAuthData: AuthToken = {
        ...authData,
        token: this.generateSecureToken(),
        expiresAt: Date.now() + (this.TOKEN_EXPIRY_HOURS * 60 * 60 * 1000),
        csrfToken: this.generateCSRFToken()
      };
      this.saveAuthData(newAuthData);
      return true;
    }
    return false;
  }

  private checkAuthStatus(): void {
    const authData = this.getAuthData();
    if (authData && !this.isTokenExpired(authData)) {
      this.isAuthenticatedSubject.next(true);
    } else if (authData && this.isTokenExpired(authData)) {
      // Clean up expired token
      this.clearAuthData();
    }
  }

  private generateSecureToken(): string {
    // Generate a cryptographically secure token
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private generateCSRFToken(): string {
    // Generate a CSRF token
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private isTokenExpired(authData: AuthToken): boolean {
    return Date.now() > authData.expiresAt;
  }

  private saveAuthData(authData: AuthToken): void {
    try {
      const encryptedData = this.encryptData(JSON.stringify(authData));
      localStorage.setItem(this.STORAGE_KEY, encryptedData);
    } catch (error) {
      console.error('Failed to save auth data:', error);
      // Fallback to sessionStorage if localStorage fails
      try {
        const encryptedData = this.encryptData(JSON.stringify(authData));
        sessionStorage.setItem(this.STORAGE_KEY, encryptedData);
      } catch (fallbackError) {
        console.error('Failed to save auth data to sessionStorage:', fallbackError);
      }
    }
  }

  private getAuthData(): AuthToken | null {
    try {
      const encryptedData = localStorage.getItem(this.STORAGE_KEY) || sessionStorage.getItem(this.STORAGE_KEY);
      if (!encryptedData) {
        return null;
      }

      const decryptedData = this.decryptData(encryptedData);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Failed to retrieve auth data:', error);
      this.clearAuthData();
      return null;
    }
  }

  private clearAuthData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      sessionStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  }

  private encryptData(data: string): string {
    // Simple XOR encryption (for demonstration - use a proper encryption library in production)
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length);
      encrypted += String.fromCharCode(charCode);
    }
    return btoa(encrypted); // Base64 encode
  }

  private decryptData(encryptedData: string): string {
    try {
      const decoded = atob(encryptedData); // Base64 decode
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

  // Method to validate CSRF token for API calls
  validateCSRFToken(token: string): boolean {
    const authData = this.getAuthData();
    return authData?.csrfToken === token;
  }

  // Method to clear all sensitive data (useful for security events)
  clearAllSensitiveData(): void {
    this.clearAuthData();
    this.isAuthenticatedSubject.next(false);
    
    // Clear any other sensitive data that might be stored
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error('Failed to clear all sensitive data:', error);
    }
  }
} 