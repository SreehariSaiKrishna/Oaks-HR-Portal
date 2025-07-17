import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'hr',
    loadChildren: () =>
      import('./hr/hr.module').then(
        (m) => m.HrModule
      ),
    canActivate: [authGuard],
  },
  {
    path: 'employ',
    loadChildren: () =>
      import('./employ/employ.module').then(
        (m) => m.EmployModule
      ),
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
