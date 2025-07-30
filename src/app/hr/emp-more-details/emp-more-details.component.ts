import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../service/auth.service';
import { UtilityService } from '../../service/utility.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-emp-more-details',
  templateUrl: './emp-more-details.component.html',
  styleUrl: './emp-more-details.component.scss',
})
export class EmpMoreDetailsComponent {
  email!: string;
  user!: any;
  orginalData!: any;
  isEditMode = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { email: string },
    public authService: AuthService,
    public utilityService: UtilityService
  ) {
    this.email = data.email;
  }
  ngOnInit() {
    console.log('Email received:', this.email);
    this.userData();
  }

  userData() {
    this.authService
      .getEmployeeByEmail(this.email)
      .then((data: any) => {
        this.user = data;
        if (this.user.doj?.seconds) {
          this.user.doj = new Date(this.user.doj.seconds * 1000);
        }
        this.orginalData = { ...data };
      })
      .catch((error: any) => {
        this.utilityService.openSnackBar('Error fetching user data');
        console.error('Error fetching user data:', error);
      });
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  cancelEdit() {
    this.user = this.orginalData;
    this.isEditMode = false;
  }

  saveChanges() {
    this.authService
      .editEmployeDetails(this.email, this.user)
      .then(() => {
        this.utilityService.openSnackBar('Changes saved successfully');
        this.userData(); // Refresh user data after saving changes
      })
      .catch((error: any) => {
        console.error('Error saving changes:', error);
        this.utilityService.openSnackBar('Error saving changes');
      });
    this.isEditMode = false;
  }
}
