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
  // employees = [];
  constructor(public dialog: MatDialog, public authservice: AuthService) {}

  ngOnInit(){
    // this.authservice.getAllEmployees().then((data: any) => {
    //   this.employees = data.map((e: any) => {
    //     return {
    //       ...e.payload.doc.data(),
    //       id: e.payload.doc.id,
    //       status: true,
    //     };
    //   });
    // });
    // console.log('Employees:', this.employees);
  }

  displayedDesktopColumns: string[] = [
    'employeeId',
    'employees',
    'designation',
    'email',
    'department',
    // 'dateOfJoining',
    // 'dateOfBirth',
    'status',
    'moreDetails',
  ];

  displayedMobColumns: string[] = ['details', 'action'];

  employees = [
    {
      employeeId: 'EMP001',
      fullName: 'Tucker Bogle',
      designation: 'Aircraft Engineer',
      email: 'tucker.bogle@example.com',
      department: 'Engineering',
      dateOfJoining: new Date('2020-09-22'),
      dateOfBirth: new Date('1990-09-22'),
      active: true,
    },
    {
      employeeId: 'EMP002',
      fullName: 'Ali Brown',
      designation: 'Pilot',
      email: 'ali.brown@example.com',
      department: 'Flight Operations',
      dateOfJoining: new Date('2018-10-10'),
      dateOfBirth: new Date('1988-10-10'),
      active: false,
    },
  ];

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
