import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BootstrapToastService } from '../../services/bootstrap-toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: BootstrapToastService
  ) {}

  async login() {
    this.isLoading = true;
    
    try {
      const success = await this.authService.login(this.username, this.password);
      if (success) {
        this.toastService.success('Login successful', 'Success', 3000);
        this.router.navigate(['/home']);
      } else {
        this.toastService.error('Invalid username or password', 'Login Error', 5000);
      }
    } catch (error) {
      this.toastService.error('An error occurred during login', 'System Error', 5000);
    } finally {
      this.isLoading = false;
    }
  }
}
