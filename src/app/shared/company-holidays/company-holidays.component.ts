import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { AddEventComponent } from '../add-event/add-event.component';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-company-holidays',
  templateUrl: './company-holidays.component.html',
  styleUrls: ['./company-holidays.component.scss'],
})
export class CompanyHolidaysComponent {
  currentYear: number = new Date().getFullYear();
  holidays: any[] = [];

  constructor(public dialog: MatDialog, public authService: AuthService) {}

  ngOnInit() { this.getHolidays();}

  async getHolidays() {
    try {
      const data: any = await this.authService.getCompanyHolidays();
      this.holidays = data.map((holiday: any) => ({
        ...holiday,
      }));
      console.log('Company holidays fetched:', this.holidays);
    } catch (error) {
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
}
