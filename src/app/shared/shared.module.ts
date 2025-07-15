import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SharedComponent } from './shared.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { CompanyHolidaysComponent } from './company-holidays/company-holidays.component';
import { CompanyPolicyComponent } from './company-policy/company-policy.component';
import { FaqsComponent } from './faqs/faqs.component';
import { Form16Component } from './form16/form16.component';

@NgModule({
  declarations: [
    SharedComponent,
    ProfileComponent,
    CompanyHolidaysComponent,
    CompanyPolicyComponent,
    FaqsComponent,
    Form16Component,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ProfileComponent,
    CompanyHolidaysComponent,
    CompanyPolicyComponent,
    FaqsComponent,
    Form16Component,
  ],
})
export class SharedModule {}
