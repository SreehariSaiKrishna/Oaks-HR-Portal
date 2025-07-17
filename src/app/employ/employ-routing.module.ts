import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployComponent } from './employ.component';
import { ProfileComponent } from '../shared/profile/profile.component';
import { authGuard } from '../auth.guard';
import { Form16Component } from '../shared/form16/form16.component';
import { FaqsComponent } from '../shared/faqs/faqs.component';
import { CompanyPolicyComponent } from '../shared/company-policy/company-policy.component';
import { CompanyHolidaysComponent } from '../shared/company-holidays/company-holidays.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: EmployComponent,
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
export class EmployRoutingModule {}
