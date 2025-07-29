import { Component } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../service/auth.service';
import { EmpMoreDetailsComponent } from '../emp-more-details/emp-more-details.component';

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
    this.authservice
      .getAllEmployees()
      .then((employees: any[]) => {
        this.employees = employees.map((e) => ({
          ...e,
          status: true,
        }));
      })
      .catch((err) => console.error(err));
  }

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

  openMoreDetailsDialog(email: string) {
    const dialogRef = this.dialog.open(EmpMoreDetailsComponent, {
      width: '480px',
      height: '480px',
      data: { email }
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
