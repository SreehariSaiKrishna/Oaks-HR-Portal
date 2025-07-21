import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedComponent } from './shared.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { CompanyHolidaysComponent } from './company-holidays/company-holidays.component';
import { CompanyPolicyComponent } from './company-policy/company-policy.component';
import { FaqsComponent } from './faqs/faqs.component';
import { Form16Component } from './form16/form16.component';
import { MatIconModule } from '@angular/material/icon';
import { AddEventComponent } from './add-event/add-event.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    SharedComponent,
    ProfileComponent,
    CompanyHolidaysComponent,
    CompanyPolicyComponent,
    FaqsComponent,
    Form16Component,
    AddEventComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  exports: [
    ProfileComponent,
    CompanyHolidaysComponent,
    CompanyPolicyComponent,
    FaqsComponent,
    Form16Component,
    AddEventComponent,
  ],
})
export class SharedModule { }
