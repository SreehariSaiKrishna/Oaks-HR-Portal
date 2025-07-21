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
        this.router.navigate(['/employ']);
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

  getUserEmail() {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.email;
    }
    return null;
  }

  getEmployeeByEmail(email: string): Promise<any> {
    return this.firestore
      .collection('employees', (ref) => ref.where('email', '==', email))
      .get()
      .toPromise()
      .then((querySnapshot) => {
        if (querySnapshot && !querySnapshot.empty) {
          const employeeData = querySnapshot.docs[0].data();
          console.log('Employee Data:', employeeData);
          return employeeData;
        } else {
          return null;
        }
      })
      .catch((error) => {
        console.error('Error fetching employee data:', error);
        throw error;
      });
  }

  getAllEmployees() {
    return this.firestore
      .collection('employees')
      .get()
      .toPromise()
      .then((querySnapshot) => {
        const employees: any[] = [];
        if (querySnapshot) {
          querySnapshot.forEach((doc) => {
            employees.push({ id: doc.id, ...(doc.data() as object) });
          });
        }
        return employees;
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
        throw error;
      });
  }

  //company holiday
  saveCompanyHoliday(holidayData: any) {
    return this.firestore
      .collection('companyHolidays')
      .add(holidayData)
      .then(() => {
        console.log('Company holiday saved:', holidayData);
      })
      .catch((error) => {
        console.error('Error saving company holiday:', error);
        throw error;
      });
  }

  getCompanyHolidays() {
    return this.firestore
      .collection('companyHolidays')
      .get()
      .toPromise()
      .then((querySnapshot) => {
        const holidays: any[] = [];
        if (querySnapshot) {
          querySnapshot.forEach((doc: any) => {
            const data = doc.data();
            const date = data.date;

            // Convert Firestore timestamp object to JS Date
            const formattedDate =
              date && date.seconds ? new Date(date.seconds * 1000) : null;

            holidays.push({
              id: doc.id,
              ...data,
              date: formattedDate, // replace raw timestamp with actual Date object
            });
          });
        }
        return holidays;
      })
      .catch((error) => {
        console.error('Error fetching company holidays:', error);
        throw error;
      });
  }
}
