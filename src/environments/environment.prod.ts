export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api',
  encryptionKey: 'change-this-to-a-secure-production-key',
  tokenExpiryHours: 12, // Shorter expiry for production
  enableCSRFProtection: true,
  enableEncryption: true,
  // Secure authentication configuration for production
  auth: {
    // In production, these should be configured via the setup component or secure storage
    // DO NOT hardcode production credentials here
    defaultUsername: '',
    defaultPassword: '',
    // Stricter security settings for production
    maxLoginAttempts: 3,
    lockoutDuration: 30 * 60 * 1000, // 30 minutes in milliseconds
    passwordMinLength: 12,
    enableBruteForceProtection: true
  }
}; 