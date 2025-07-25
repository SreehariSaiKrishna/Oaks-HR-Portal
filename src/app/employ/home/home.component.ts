import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../service/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {date: Date = new Date();
  user: any;
  employeesLength: number = 0;
  holidays = 0;
  birthdays = 0;
  events = 0;
  thisMonth: string = this.date.toLocaleString('default', { month: 'long' });
  matrics = [
    // {
    //   title: 'Employees',
    //   value: this.employeesLength,
    //   desc: 'Current headcount',
    //   icon: 'people',
    //   color: '#64a9ff',
    //   background: '#eaf3ff ',
    // },
    {
      title: 'Holidays',
      value: this.holidays,
      desc: 'Company holidays',
      icon: 'card_travel',
      color: '#74f2c8',
      background: '#edfdf8',
    },
    {
      title: 'Birthdays',
      value: this.birthdays,
      desc: `${this.thisMonth} celebrants`,
      icon: 'cake',
      color: '#f2d782',
      background: '#fcf7e6',
    },
    {
      title: 'Events',
      value: this.events,
      desc: 'Upcoming events',
      icon: 'event',
      color: '#9d6cf1',
      background: '#f1ebfd',
    },
    // {
    //   title: 'Pending Approvals',
    //   value: 0,
    //   desc: 'Awaiting review',
    //   icon: 'add_circle',
    //   color: '#22305a',
    //   background: '#f0f4f8',
    // }
  ];

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.userData();
    this.getEmployeeCount();
    this.getEvents();
  }

  getEmployeeCount() {
    this.authService
      .getAllEmployees()
      .then((data: any) => {
        this.employeesLength = data.length;
      })
      .catch((error: any) => {
        console.error('Error fetching employee data:', error);
      });
  }

  getEvents() {
    this.authService
      .getCompanyHolidays()
      .then((data: any) => {
        for (const event of data) {
          if (event.eventType === 'Other') {
            this.events++;
          } else if (event.eventType === 'Birthday') {
            const eventDate = new Date(event.date);
            if (eventDate.getMonth() === this.date.getMonth()) {
              this.birthdays++;
            }
          } else {
            this.holidays++;
          }
          this.cdr.detectChanges();
        }
      })
      .catch((error: any) => {
        console.error('Error fetching events:', error);
      });
  }

  userData() {
    const email = this.authService.getUserEmail();
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

