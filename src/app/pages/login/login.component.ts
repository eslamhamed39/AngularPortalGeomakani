import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    if (this.authService.login(this.username, this.password)) {
      this.errorMessage = '';
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'اسم المستخدم أو كلمة المرور غير صحيحة';
    }
  }
}
