import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  auth = inject(AuthService);
  router = inject(Router);

  form = { firstname: '', lastname: '', email: '', password: '', phone: '' };
  loading = false;
  error = '';

  submit() {
    this.loading = true;
    this.error = '';
    this.auth.register(this.form).subscribe({
      next: (res) => {
        this.auth.setSession(res.token, res.customer);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = err.error?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่';
        this.loading = false;
      }
    });
  }
}
