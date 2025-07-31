import { Component, Inject, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { UtilityService } from '../service/utility.service';

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
    private utilityService: UtilityService,
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

    if (userType === 'HR' && this.loginForm.value.email.toLowerCase() !== 'divya@oaks.guru') {
      this.utilityService.openSnackBar('Role does not match');
      return;
    }

    this.authservice
      .login(this.loginForm.value.email.toLowerCase(), this.loginForm.value.password)
      .then(
        (userCredential: any) => {
          const userData = {
            email: this.loginForm.value.email.toLowerCase(),
            userType: userType,
            uid:
              userCredential && userCredential.user
                ? userCredential.user.uid
                : null,
          };
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('user', JSON.stringify(userData));
          }
          this.utilityService.openSnackBar('Login successful');

          if (userType === 'HR') {
            this.router.navigate(['/hr']);
          } else {
            this.router.navigate(['/employ']);
          }
        },
        (error: any) => {
          this.utilityService.openSnackBar(
            'Login failed. Please check your credentials.'
          );
          this.router.navigate(['/login']);
        }
      );
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
