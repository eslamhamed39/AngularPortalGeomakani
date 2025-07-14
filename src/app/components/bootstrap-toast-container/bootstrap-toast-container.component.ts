import { Component, OnInit } from '@angular/core';
import { BootstrapToastService, BootstrapToast } from '../../services/bootstrap-toast.service';

@Component({
  selector: 'app-bootstrap-toast-container',
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1055;">
      <div 
        *ngFor="let toast of toasts; trackBy: trackByToastId; let i = index" 
        class="toast show"
        [class]="'bg-' + toast.type + ' text-white'"
        [class.toast-animation]="!toast.removing"
        [class.toast-removing]="toast.removing"
        [attr.data-toast-id]="toast.id"
        role="alert"
        [attr.aria-live]="'assertive'"
        aria-atomic="true"
        [style.animation-delay]="toast.removing ? '0s' : (i * 0.05) + 's'"
      >
        <div class="toast-header" *ngIf="toast.title">
          <strong class="me-auto">{{ toast.title }}</strong>
          <button 
            type="button" 
            class="btn-close btn-close-white" 
            (click)="removeToast(toast.id)"
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body" [class]="toast.title ? '' : 'd-flex justify-content-between align-items-center'">
          <span>{{ toast.message }}</span>
          <button 
            *ngIf="!toast.title"
            type="button" 
            class="btn-close btn-close-white ms-2" 
            (click)="removeToast(toast.id)"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      max-width: 350px;
    }
    
    .toast {
      margin-bottom: 0.75rem;
      border: none;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
      transform-origin: top right;
      opacity: 0;
      transform: translateX(100%) scale(0.8);
      border-radius :20px ;
    }
    
    .toast-animation {
      animation: toastSlideIn 0.25s ease-out forwards;
    }
    
    .toast-removing {
      animation: toastSlideOut 0.25s ease-in forwards !important;
    }
    
    .bg-success {
      background-color:rgba(25, 135, 84, 0.7) !important;
      border: 1px solid rgb(20, 199, 116);
    }
    
    .bg-danger {
      background-color:rgba(136, 26, 37, 0.7) !important;
      border: 1px solid rgb(245, 37, 58);

    }
    
    .bg-warning {
      background-color:rgba(179, 139, 19, 0.7) !important;
      border: 1px solid rgb(255, 191, 0);
      color: #000 !important;
    }
    
    .bg-info {
      background-color: #0dcaf0 !important;
    }
    
    .toast-header {
      background-color: transparent;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
    }
    
    .bg-warning .toast-header {
      color: #000;
      border-bottom-color: rgba(0, 0, 0, 0.2);
    }
    
    .btn-close-white {
      filter: invert(1) grayscale(100%) brightness(200%);
    }
    
    .bg-warning .btn-close-white {
      filter: none;
    }
    
    /* Enter Animation - Bounce In */
    @keyframes toastSlideIn {
      0% {
        transform: translateX(100%) scale(0.8);
        opacity: 0;
      }
      60% {
        transform: translateX(-10%) scale(1.05);
        opacity: 1;
      }
      80% {
        transform: translateX(3%) scale(0.98);
      }
      100% {
        transform: translateX(0) scale(1);
        opacity: 1;
      }
    }
    
    /* Leave Animation - Fade Out with Scale */
    @keyframes toastSlideOut {
      0% {
        transform: translateX(0) scale(1);
        opacity: 1;
      }
      20% {
        transform: translateX(-3%) scale(1.02);
        opacity: 0.9;
      }
      100% {
        transform: translateX(100%) scale(0.7);
        opacity: 0;
      }
    }
    
    @media (max-width: 576px) {
      .toast-container {
        right: 0.5rem !important;
        left: 0.5rem !important;
        max-width: none;
      }
      
      .toast {
        transform: translateY(-100%) scale(0.8);
      }
      
      @keyframes toastSlideIn {
        0% {
          transform: translateY(-100%) scale(0.8);
          opacity: 0;
        }
        60% {
          transform: translateY(10%) scale(1.05);
          opacity: 1;
        }
        80% {
          transform: translateY(-3%) scale(0.98);
        }
        100% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
      }
      
      @keyframes toastSlideOut {
        0% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        20% {
          transform: translateY(-3%) scale(1.02);
          opacity: 0.9;
        }
        100% {
          transform: translateY(-100%) scale(0.7);
          opacity: 0;
        }
      }
    }
  `]
})
export class BootstrapToastContainerComponent implements OnInit {
  toasts: BootstrapToast[] = [];

  constructor(private toastService: BootstrapToastService) {}

  ngOnInit() {
    this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
    // استمع لطلبات الإزالة مع الأنيميشن
    this.toastService.removeWithAnimation$.subscribe(id => {
      if (id) {
        this.removeToast(id);
      }
    });
  }

  removeToast(id: string) {
    // Mark toast as removing and trigger animation
    const toast = this.toasts.find(t => t.id === id);
    if (toast) {
      toast.removing = true;
      // Force re-render
      this.toasts = [...this.toasts];
      
      // Wait for animation to complete before removing from service
      setTimeout(() => {
        this.toastService.remove(id);
      }, 250);
    } else {
      this.toastService.remove(id);
    }
  }

  trackByToastId(index: number, toast: BootstrapToast): string {
    return toast.id;
  }
} 