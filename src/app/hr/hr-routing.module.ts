import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrComponent } from './hr.component';
import { ProfileComponent } from '../shared/profile/profile.component';
import { authGuard } from '../auth.guard';
import { CompanyHolidaysComponent } from '../shared/company-holidays/company-holidays.component';
import { CompanyPolicyComponent } from '../shared/company-policy/company-policy.component';
import { FaqsComponent } from '../shared/faqs/faqs.component';
import { Form16Component } from '../shared/form16/form16.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HrComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [authGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard],
      },
      {
        path: 'holidays',
        component: CompanyHolidaysComponent,
        canActivate: [authGuard],
      },
      {
        path: 'policy',
        component: CompanyPolicyComponent,
        canActivate: [authGuard],
      },
      {
        path: 'faqs',
        component: FaqsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'form16',
        component: Form16Component,
        canActivate: [authGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrRoutingModule {}
