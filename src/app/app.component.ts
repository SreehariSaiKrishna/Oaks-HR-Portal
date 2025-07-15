import { Component } from '@angular/core';
import { AuthService } from './service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'oaks-hr';
  constructor(public authSvc: AuthService, public router: Router) {}

  ngOnInit() {
    if (this.authSvc.isLoggedIn()) {
      if (this.authSvc.getUserType() === 'HR') {
        this.router.navigate(['/hr-dashboard']);
      } else if (this.authSvc.getUserType() === 'Employee') {
        this.router.navigate(['/dashboard']);
      }
    }
  }
}
