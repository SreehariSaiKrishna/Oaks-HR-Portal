import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
;
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { RegisterComponent } from './register/register.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedModule } from '../shared/shared.module';
import { HrComponent } from './hr.component';
import { HrRoutingModule } from './hr-routing.module';
import { HomeComponent } from './home/home.component';
import { EmployeesComponent } from './employees/employees.component';

@NgModule({
  declarations: [HrComponent, RegisterComponent, HomeComponent, EmployeesComponent],
  imports: [
    CommonModule,
    HrRoutingModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatOption,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SharedModule,
  ],
})
export class HrModule {}
