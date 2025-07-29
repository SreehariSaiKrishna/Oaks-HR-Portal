import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-emp-more-details',
  templateUrl: './emp-more-details.component.html',
  styleUrl: './emp-more-details.component.scss'
})
export class EmpMoreDetailsComponent {
  //i am getting the email from the employees component and passing it to this component
  email!: string;
  user!: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { email: string }, public authService: AuthService) {
    this.email = data.email;
  }
  ngOnInit() {
    console.log('Email received:', this.email);
    this.userData();
  }

  userData() {
    const email = this.authService.getUserEmail();
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
