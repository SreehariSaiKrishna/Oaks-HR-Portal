import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrDashboadRoutingModule } from './hr-dashboad-routing.module';
import { HrDashboardComponent } from './hr-dashboard.component';


@NgModule({
  declarations: [HrDashboardComponent],
  imports: [
    CommonModule,
    HrDashboadRoutingModule
  ]
})
export class HrDashboadModule { }
