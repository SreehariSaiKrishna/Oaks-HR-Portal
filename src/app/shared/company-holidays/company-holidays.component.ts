import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { AddEventComponent } from '../add-event/add-event.component';
import { AuthService } from '../../service/auth.service';
import { UtilityService } from '../../service/utility.service';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { Console } from 'console';

@Component({
  selector: 'app-company-holidays',
  templateUrl: './company-holidays.component.html',
  styleUrls: ['./company-holidays.component.scss'],
})
export class CompanyHolidaysComponent {
  currentYear: number = new Date().getFullYear();
  holidays: any[] = [];
  holidaysCount: number = 0;

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.getHolidays();
  }

  async getHolidays() {
    try {
      const data = await this.authService.getCompanyHolidays();
      console.log(data);
      this.holidays = data.map((holiday: any) => ({
        ...holiday,
      }));
      this.holidaysCount = 0;
      for (const holiday of this.holidays) {
        if (
          holiday.eventType === 'Festival' ||
          holiday.eventType === 'National'
        ) {
          this.holidaysCount++;
        }
      }
    } catch (error) {
      this.utilityService.openSnackBar('Error fetching company holidays');
      console.error('Error fetching company holidays:', error);
      this.holidays = [];
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddEventComponent, {
      // width: '700px', // or '80vw'
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getHolidays();
    });
  }

  formatMonth(date: Date): string {
    return date.toLocaleString('default', { month: 'short' });
  }

  formatDay(date: Date): string {
    return String(date.getDate());
  }

  formatYear(date: Date): string {
    return String(date.getFullYear());
  }

  formatFullDate(date: Date): string {
    return date.toDateString();
  }

  deleteHoliday(docId: string) {
    this.authService
      .delectCompanyHoliday(docId)
      .then(() => {
        this.getHolidays();
      })
      .catch((error) => {
        this.utilityService.openSnackBar('Failed to delete company holiday');
        console.error('Error deleting company holiday:', error);
        throw error;
      });
  }
}
