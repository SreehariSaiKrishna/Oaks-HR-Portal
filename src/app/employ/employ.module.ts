import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployRoutingModule } from './employ-routing.module';
import { EmployComponent } from './employ.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [EmployComponent],
  imports: [
    CommonModule,
    EmployRoutingModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    SharedModule
  ],
})
export class EmployModule {}
