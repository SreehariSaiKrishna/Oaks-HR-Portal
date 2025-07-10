import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private fireauth: AngularFireAuth, private router: Router) {}

  //login
  login(email: string, password: string) {
    return this.fireauth.signInWithEmailAndPassword(email, password).then(
      () => {
        localStorage.setItem('token', 'true');
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Login failed:', error);
        this.router.navigate(['/login']);
      }
    );
  }

  //register
  register(email: string, password: string) {
    return this.fireauth.createUserWithEmailAndPassword(email, password).then(
      () => {
        localStorage.setItem('token', 'true');
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Registration failed:', error);
        this.router.navigate(['/register']);
      }
    );
  }

  //logout
  logout() {
    return this.fireauth.signOut().then(
      () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      (err) => {
        console.error('Logout failed:', err);
      }
    );
  }
}
