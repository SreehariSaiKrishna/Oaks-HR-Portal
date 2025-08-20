import { Component } from '@angular/core';
import { AuthService } from './service/auth.service';
import { Router } from '@angular/router';
import { LoaderService } from './service/loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  loading: Observable<boolean>;
  constructor(public authSvc: AuthService, public router: Router, public loaderSvc: LoaderService) {
    this.loading = this.loaderSvc.isLoading;
    console.log('AppComponent initialized', this.loading);
  }

  ngOnInit() {
    if (this.authSvc.isLoggedIn()) {
      if (this.authSvc.getUserType() === 'HR') {
        this.router.navigate(['/hr']);
      } else if (this.authSvc.getUserType() === 'Employee') {
        this.router.navigate(['/employ']);
      }
    }
  }
}
