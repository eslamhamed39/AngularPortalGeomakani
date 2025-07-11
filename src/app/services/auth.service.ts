import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // التحقق من وجود token محفوظ عند بدء التطبيق
    this.checkAuthStatus();
  }

  login(username: string, password: string): boolean {
    // مثال توضيحي (غير آمن!) عدّل حسب منطقك لاحقًا
    if (username === 'admin' && password === 'admin') {
      // حفظ token في localStorage
      localStorage.setItem('authToken', 'dummy-token');
      localStorage.setItem('username', username);
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    // حذف البيانات المحفوظة
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }
} 