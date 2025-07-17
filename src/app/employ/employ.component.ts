import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './employ.component.html',
  styleUrl: './employ.component.scss',
})
export class EmployComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
