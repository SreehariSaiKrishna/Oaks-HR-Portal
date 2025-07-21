import { Component } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
})
export class EmployeesComponent {
  employees: any[] = [];
  constructor(public dialog: MatDialog, public authservice: AuthService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.authservice.getAllEmployees()
      .then((employees: any[]) => {
        this.employees = employees.map(e => ({
          ...e,       // already has id and fields
          status: true
        }));
        console.log('Employees:', this.employees);
      })
      .catch(err => console.error(err));
    console.log('Employees:', this.employees);
  }

  displayedDesktopColumns: string[] = [
    'employeeId',
    'name',
    'designation',
    'email',
    'team',
    'status',
    'moreDetails',
  ];

  displayedMobColumns: string[] = ['details', 'action'];

  toggleStatus(emp: any) {
    emp.active = !emp.active;
  }

  openDialog() {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '700px', // or '80vw'
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  moreDetails(emp: any) {
    console.log('More details clicked', emp);
    // Implement more details functionality here
  }
}
