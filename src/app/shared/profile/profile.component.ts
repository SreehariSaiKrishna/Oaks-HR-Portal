import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { UtilityService } from '../../service/utility.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  user: any;
  years!: number;
  months!: number;
  days!: number;
  isEditMode: boolean = false;
  userBackup: any;

  constructor(
    public authService: AuthService,
    public utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.userData();
  }

  logout() {
    this.authService.logout();
  }

  userData() {
    const email = this.authService.getUserEmail();
    this.authService
      .getEmployeeByEmail(email)
      .then((data: any) => {
        if (data) {
          this.user = data;
          this.userBackup = { ...this.user }; // Create a backup of the user data
          this.tenure();
        } else {
          this.utilityService.openSnackBar(
            'No user data found for this email.'
          );
        }
      })
      .catch((error: any) => {
        this.utilityService.openSnackBar('Error fetching user data');
        console.error('Error fetching user data:', error);
      });
  }

  toggleEdit() {
    if (this.isEditMode) this.saveChanges();
    this.isEditMode = !this.isEditMode;
  }

  saveChanges() {
    this.authService
      .editEmployeDetails(this.user.email, this.user)
      .then(() => {
        this.utilityService.openSnackBar('Changes saved successfully');
        this.userData(); // Refresh user data after saving changes
        this.isEditMode = false; // Exit edit mode after saving
      })
      .catch((error: any) => {
        console.error('Error saving changes:', error);
        this.utilityService.openSnackBar('Error saving changes');
      });
  }

  tenure() {
    const doj = new Date(this.user.doj);
    const today = new Date();

    this.years = today.getFullYear() - doj.getFullYear();
    this.months = today.getMonth() - doj.getMonth();
    this.days = today.getDate() - doj.getDate();

    // Adjust for negative days
    if (this.days < 0) {
      this.months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      this.days += prevMonth.getDate(); // Days in previous month
    }

    // Adjust for negative months
    if (this.months < 0) {
      this.years--;
      this.months += 12;
    }
  }
  cancelEdit() {
    this.user = { ...this.userBackup }; // restore data
    this.isEditMode = false;
  }
}
