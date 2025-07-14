import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrDashboardComponent } from './hr-dashboard.component';
import { authGuard } from '../../auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HrDashboardComponent,
    canActivate: [authGuard],
    // children: [
    //   {
    //     path: '',
    //     redirectTo: 'classes',
    //     pathMatch: 'full',
    //   },
    // ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrDashboadRoutingModule {}
