export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  encryptionKey: 'your-secure-encryption-key-change-this-in-production',
  tokenExpiryHours: 24,
  enableCSRFProtection: true,
  enableEncryption: true,
  // Secure authentication configuration
  auth: {
    // For development, you can set these directly or use the setup component
    defaultUsername: 'geo',
    defaultPassword: 'Geo123',
    // Additional security settings
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes in milliseconds
    passwordMinLength: 8,
    enableBruteForceProtection: true
  }
}; 