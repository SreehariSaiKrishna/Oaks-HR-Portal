import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
      () => {
          if (userType === 'HR') {
            this.router.navigate(['/hr-dashboard']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        (error) => {
          console.error('Login failed:', error);
          this.router.navigate(['/login']);
        }
      );
  }
}
