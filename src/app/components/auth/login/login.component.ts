import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);

  email = '';
  password = '';
  loading = false;
  error = '';

  submit() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.auth.setSession(res.token, res.customer);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = err.error?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
        this.loading = false;
      }
    });
  }
}
