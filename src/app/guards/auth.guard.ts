import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      // Store the attempted URL for redirecting after login
      this.storeAttemptedUrl(state.url);
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    // Check if token needs refresh
    if (this.authService.refreshToken()) {
      console.log('Token refreshed automatically');
    }

    // Additional security checks
    if (!this.performSecurityChecks()) {
      this.authService.clearAllSensitiveData();
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }

  private performSecurityChecks(): boolean {
    try {
      // Check if we're in a secure context (HTTPS)
      if (!this.isSecureContext()) {
        console.warn('Application is not running in a secure context');
        // In production, you might want to block access
        // return false;
      }

      // Check for suspicious activity (basic implementation)
      if (this.detectSuspiciousActivity()) {
        console.warn('Suspicious activity detected');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Security check failed:', error);
      return false;
    }
  }

  private isSecureContext(): boolean {
    return window.isSecureContext || 
           window.location.protocol === 'https:' || 
           window.location.hostname === 'localhost';
  }

  private detectSuspiciousActivity(): boolean {
    // Basic suspicious activity detection
    // In a real application, you would implement more sophisticated detection
    
    // Check for multiple failed login attempts
    const failedAttempts = this.getFailedLoginAttempts();
    if (failedAttempts > 5) {
      return true;
    }

    // Check for rapid navigation (potential automated attacks)
    const navigationHistory = this.getNavigationHistory();
    if (navigationHistory.length > 10) {
      const recentNavigations = navigationHistory.filter(
        nav => Date.now() - nav.timestamp < 60000 // Last minute
      );
      if (recentNavigations.length > 5) {
        return true;
      }
    }

    return false;
  }

  private storeAttemptedUrl(url: string): void {
    try {
      sessionStorage.setItem('attemptedUrl', url);
    } catch (error) {
      console.error('Failed to store attempted URL:', error);
    }
  }

  private getFailedLoginAttempts(): number {
    try {
      const attempts = sessionStorage.getItem('failedLoginAttempts');
      return attempts ? parseInt(attempts, 10) : 0;
    } catch (error) {
      return 0;
    }
  }

  private getNavigationHistory(): Array<{url: string, timestamp: number}> {
    try {
      const history = sessionStorage.getItem('navigationHistory');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      return [];
    }
  }

  private recordNavigation(url: string): void {
    try {
      const history = this.getNavigationHistory();
      history.push({ url, timestamp: Date.now() });
      
      // Keep only last 20 navigations
      if (history.length > 20) {
        history.splice(0, history.length - 20);
      }
      
      sessionStorage.setItem('navigationHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to record navigation:', error);
    }
  }
} 