import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firestore: any;
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
        // this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Registration failed:', error);
        // this.router.navigate(['/register']);
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

  // Save the employee data to Firestore under 'employees' collection
  saveEmployeeData(employeeData: any) {
    // Check if an employee with the same email already exists
    return this.firestore
      .collection('employees', (ref: any) => ref.where('email', '==', employeeData.email))
      .get()
      .then((querySnapshot: any) => {
      if (!querySnapshot.empty) {
        console.log('Employee with this email already exists:', employeeData.email);
        return Promise.reject('Employee already exists');
      } else {
        // If not present, add the new employee data
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
      });
  }

  //check if user is logged in
  isLoggedIn() {
    return localStorage.getItem('token') === 'true';
  }
}
