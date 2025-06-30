import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router) {}

  login() {
    // مثال توضيحي (غير آمن!) عدّل حسب منطقك لاحقًا
    if (this.username === 'admin' && this.password === 'admin') {
      this.errorMessage = '';
      // هنا سينتقل إلى الصفحة الرئيسية (نضيفها لاحقًا)
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'اسم المستخدم أو كلمة المرور غير صحيحة';
    }
  }
}
