import { Component, Inject, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  selectedTabIndex = 0;
  hide = signal(true);
  constructor(
    private authservice: AuthService,
    private router: Router,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
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
          if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('user', JSON.stringify(userData));
          }

          // ✅ Navigate based on user type
          if (userType === 'HR') {
            this.router.navigate(['/hr']);
          } else {
            this.router.navigate(['/employ']);
          }
        },
        (error: any) => {
          console.error('Login failed:', error);
          this.router.navigate(['/login']);
        }
      );
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
