import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  user: any;
  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.userData();
  }

  logout() {
    this.authService.logout();
  }

  userData() {
    const email = this.authService.getUserEmail();
    console.log(email);
    this.authService
      .getEmployeeByEmail(email)
      .then((data: any) => {
        if (data) {
          this.user = data;
          console.log('User data fetched successfully:', this.user);
        } else {
          console.log('No user data found for this email.');
        }
      })
      .catch((error: any) => {
        console.error('Error fetching user data:', error);
      });
  }
}
