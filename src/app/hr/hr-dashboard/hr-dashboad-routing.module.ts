import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrDashboardComponent } from './hr-dashboard.component';
import { authGuard } from '../../auth.guard';
import { RegisterComponent } from '../register/register.component';

const routes: Routes = [
  {
    path: '',
    component: HrDashboardComponent,
    children: [{ path: 'register', component: RegisterComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrDashboadRoutingModule {}
