import { Component } from '@angular/core';

@Component({
  selector: 'app-company-holidays',
  templateUrl: './company-holidays.component.html',
  styleUrls: ['./company-holidays.component.scss']
})
export class CompanyHolidaysComponent {
  currentYear: number = new Date().getFullYear();

  holidays = [
    {
      name: "New Year's Day",
      date: new Date('2024-01-01'),
      type: 'National'
    },
    {
      name: "Republic Day",
      date: new Date('2024-01-26'),
      type: 'National'
    },
    {
      name: "Holi",
      date: new Date('2024-03-08'),
      type: 'Festival'
    },
    {
      name: "Good Friday",
      date: new Date('2024-03-29'),
      type: 'National'
    },
    {
      name: "Good Friday",
      date: new Date('2024-03-29'),
      type: 'National'
    },
    {
      name: "Good Friday",
      date: new Date('2024-03-29'),
      type: 'National'
    }
  ];

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
