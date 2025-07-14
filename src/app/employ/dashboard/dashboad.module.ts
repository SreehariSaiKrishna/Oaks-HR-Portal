import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboadRoutingModule } from './dashboad-routing.module';
import { DashboardComponent } from './dashboard.component';
import { RegisterComponent } from '../register/register.component';

@NgModule({
  declarations: [DashboardComponent, RegisterComponent],
  imports: [CommonModule, DashboadRoutingModule],
})
export class DashboadModule {}
