import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentConfigService {
  
  /**
   * Get environment variable safely (browser-compatible)
   * In browser environment, we'll use a different approach
   */
  getEnvironmentVariable(key: string): string | null {
    // In browser environment, we can't access process.env directly
    // Instead, we'll use a different approach for production
    
    if (environment.production) {
      // For production, you can:
      // 1. Use the setup component to configure credentials
      // 2. Use a configuration file that's loaded at runtime
      // 3. Use a secure API endpoint to get configuration
      return this.getProductionConfig(key);
    } else {
      // For development, use the environment file
      return this.getDevelopmentConfig(key);
    }
  }

  /**
   * Get production configuration
   * This can be extended to load from a secure API or configuration file
   */
  private getProductionConfig(key: string): string | null {
    // In production, you might want to:
    // 1. Load from a secure configuration file
    // 2. Get from a secure API endpoint
    // 3. Use a different storage mechanism
    
    // For now, return null to force using the setup component
    return null;
  }

  /**
   * Get development configuration
   */
  private getDevelopmentConfig(key: string): string | null {
    switch (key) {
      case 'AUTH_USERNAME':
        return environment.auth.defaultUsername;
      case 'AUTH_PASSWORD':
        return environment.auth.defaultPassword;
      case 'ENCRYPTION_KEY':
        return environment.encryptionKey;
      default:
        return null;
    }
  }

  /**
   * Check if we're in production mode
   */
  isProduction(): boolean {
    return environment.production;
  }

  /**
   * Get all auth configuration
   */
  getAuthConfig() {
    return environment.auth;
  }

  /**
   * Get encryption key
   */
  getEncryptionKey(): string {
    return environment.encryptionKey;
  }

  /**
   * Get API URL
   */
  getApiUrl(): string {
    return environment.apiUrl;
  }

  /**
   * Get token expiry hours
   */
  getTokenExpiryHours(): number {
    return environment.tokenExpiryHours;
  }

  /**
   * Check if CSRF protection is enabled
   */
  isCSRFProtectionEnabled(): boolean {
    return environment.enableCSRFProtection;
  }

  /**
   * Check if encryption is enabled
   */
  isEncryptionEnabled(): boolean {
    return environment.enableEncryption;
  }
} 