import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrDashboadRoutingModule } from './hr-dashboad-routing.module';
import { HrDashboardComponent } from './hr-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { RegisterComponent } from '../register/register.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [HrDashboardComponent, RegisterComponent],
  imports: [
    CommonModule,
    HrDashboadRoutingModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatTabsModule,
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
export class HrDashboadModule {}
