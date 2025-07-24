import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  date: Date = new Date();
  user: any;
  employeesLength: number = 0;
  holidays = 0;
  birthdays = 0;
  events = 0;
  matrics = [
    {
      title: 'Employees',
      value: this.employeesLength,
      desc: 'Current headcount',
      icon: 'people',
      color: '#22305a',
      background: '#f0f4f8',
    },
    {
      title: 'Holidays',
      value: this.holidays,
      desc: 'Company holidays',
      icon: 'holiday_village',
      color: '#22305a',
      background: '#f0f4f8',
    },
    {
      title: 'Birthdays',
      value: this.birthdays,
      desc: 'Upcoming birthdays',
      icon: 'cake',
      color: '#22305a',
      background: '#f0f4f8',
    },
    {
      title: 'Events',
      value: this.events,
      desc: 'Upcoming events',
      icon: 'event',
      color: '#22305a',
      background: '#f0f4f8',
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
  ) {}

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
            this.birthdays++;
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
