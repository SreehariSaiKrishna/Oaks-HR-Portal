import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  selectedTabIndex = 0;
  constructor(
    private authservice: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  selectedTab = 0;

  async onLogin() {
    if (this.loginForm.invalid) return;
    const userType = this.selectedTabIndex === 0 ? 'HR' : 'Employee';
    console.log(`User Type: ${userType}`, this.loginForm.value);

    if (userType === 'HR' && this.loginForm.value.email !== 'sai@gmail.com') {
      console.error('Role does not match');
      // Optionally, you can set a form error or show a message to the user here
      return;
    }

    this.authservice
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .then(
        (userCredential: any) => {
          // ✅ Save user to localStorage
          const userData = {
            email: this.loginForm.value.email,
            userType: userType,
            uid:
              userCredential && userCredential.user
                ? userCredential.user.uid
                : null, // optional if using Firebase
          };
          localStorage.setItem('user', JSON.stringify(userData));

          // ✅ Navigate based on user type
          if (userType === 'HR') {
            this.router.navigate(['/hr-dashboard']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        (error: any) => {
          console.error('Login failed:', error);
          this.router.navigate(['/login']);
        }
      );
  }
}
