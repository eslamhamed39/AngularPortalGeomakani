import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface BootstrapToast {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  delay?: number;
  autohide?: boolean;
  removing?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BootstrapToastService {
  private toasts = new BehaviorSubject<BootstrapToast[]>([]);
  public toasts$ = this.toasts.asObservable();

  show(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info', title?: string, delay: number = 5000) {
    const toast: BootstrapToast = {
      id: this.generateId(),
      title,
      message,
      type,
      delay,
      autohide: delay > 0,
      removing: false
    };

    const currentToasts = this.toasts.value;
    this.toasts.next([...currentToasts, toast]);

    // Auto remove after delay
    if (delay > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, delay);
    }
  }

  success(message: string, title?: string, delay?: number) {
    this.show(message, 'success', title, delay);
  }

  error(message: string, title?: string, delay?: number) {
    this.show(message, 'danger', title, delay);
  }

  warning(message: string, title?: string, delay?: number) {
    this.show(message, 'warning', title, delay);
  }

  info(message: string, title?: string, delay?: number) {
    this.show(message, 'info', title, delay);
  }

  remove(id: string) {
    const currentToasts = this.toasts.value;
    this.toasts.next(currentToasts.filter(toast => toast.id !== id));
  }

  clear() {
    this.toasts.next([]);
  }

  private generateId(): string {
    return 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
} 