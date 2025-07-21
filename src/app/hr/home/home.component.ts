import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  user: any;
  constructor(public dialog: MatDialog, public authService: AuthService) {}

  ngOnInit() {
    this.userData();
  }

  openDialog() {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '700px', // or '80vw'
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  userData() {
    const email = this.authService.getUserEmail();
    console.log(email);
    this.authService
      .getEmployeeByEmail(email)
      .then((data: any) => {
        if (data) {
          this.user = data;
        } else {
          console.log('No user data found for this email.');
        }
      })
      .catch((error: any) => {
        console.error('Error fetching user data:', error);
      });
  }
}
