import { isPlatformBrowser } from '@angular/common';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) {}

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
      },
      (error) => {
        console.error('Registration failed:', error);
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

  saveEmployeeData(employeeData: any) {
    return this.firestore
      .collection(
        'employees',
        (ref: any) => ref.where('email', '==', employeeData.email) // ✅ use '==', not '==='
      )
      .get()
      .toPromise()
      .then((querySnapshot: any) => {
        if (!querySnapshot.empty) {
          console.log(
            'Employee with this email already exists:',
            employeeData.email
          );
          return Promise.reject('Employee already exists');
        } else {
          return this.firestore
            .collection('employees')
            .add(employeeData)
            .then(() => {
              console.log('Employee data saved:', employeeData);
            });
        }
      })
      .catch((error: any) => {
        console.error('Error saving employee data:', error);
        throw error;
      });
  }

  //check if user is logged in
  isLoggedIn() {
    return localStorage.getItem('token') === 'true';
  }

  getUserType() {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.userType;
    }
    return null;
  }
}
