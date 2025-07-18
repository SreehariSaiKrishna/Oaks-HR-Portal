import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../service/auth.service';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-hr',
  templateUrl: './hr.component.html',
  styleUrl: './hr.component.scss',
})
export class HrComponent {
  isSidebarClosed = false;
  user: any;
  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog
  ) {}

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

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
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
