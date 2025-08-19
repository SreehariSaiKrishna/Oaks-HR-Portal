import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore,
    public utilityService: UtilityService
  ) { }

  //login
  login(email: string, password: string) {
    return this.fireauth.signInWithEmailAndPassword(email, password).then(
      () => {
        localStorage.setItem('token', 'true');
        this.router.navigate(['/employ']);
      },
      (error) => {
        this.utilityService.openSnackBar('Login failed');
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
        this.utilityService.openSnackBar('Registration failed');
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
        this.utilityService.openSnackBar('Logout failed');
      }
    );
  }

  saveEmployeeData(employeeData: any) {
    return this.firestore
      .collection('employees', (ref: any) =>
        ref.where('email', '==', employeeData.email)
      )
      .get()
      .toPromise()
      .then((querySnapshot: any) => {
        if (!querySnapshot.empty) {
          this.utilityService.openSnackBar(
            'Employee with this email already exists'
          );
          return Promise.reject('Employee already exists');
        } else {
          return this.firestore
            .collection('employees')
            .add(employeeData)
            .then(() => {
              // console.log('Employee data saved:', employeeData);
            });
        }
      })
      .catch((error: any) => {
        this.utilityService.openSnackBar('Error saving employee data');
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
          return employeeData;
        } else {
          return null;
        }
      })
      .catch((error) => {
        this.utilityService.openSnackBar('Error fetching employee data');
        console.error('Error fetching employee data:', error);
        throw error;
      });
  }

  getAllHrIds() {
    return this.firestore
      .collection('hrIds')
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
        this.utilityService.openSnackBar('Error fetching HR IDs');
        console.error('Error fetching HR IDs:', error);
        throw error;
      });
  }

  editEmployeDetails(email: string, updatedData: any) {
    return this.firestore
      .collection('employees', (ref) => ref.where('email', '==', email))
      .get()
      .toPromise()
      .then((querySnapshot) => {
        if (querySnapshot && !querySnapshot.empty) {
          const docId = querySnapshot.docs[0].id;
          return this.firestore
            .collection('employees')
            .doc(docId)
            .update(updatedData)
            .then(() => {
              this.utilityService.openSnackBar(
                'Employee details updated successfully'
              );
            });
        } else {
          this.utilityService.openSnackBar(
            'No employee found with the given email'
          );
          return Promise.reject('No employee found');
        }
      })
      .catch((error) => {
        this.utilityService.openSnackBar('Error updating employee details');
        console.error('Error updating employee details:', error);
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
        this.utilityService.openSnackBar('Error fetching employees');
        console.error('Error fetching employees:', error);
        throw error;
      });
  }

  addCompanyHoliday(holidayData: any) {
    return this.firestore
      .collection('companyHolidays')
      .add(holidayData)
      .then(() => {
        console.log('Company holiday saved:', holidayData);
      })
      .catch((error) => {
        this.utilityService.openSnackBar('Error saving company holiday');
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
        this.utilityService.openSnackBar('Error fetching company holidays');
        console.error('Error fetching company holidays:', error);
        throw error;
      });
  }

  delectCompanyHoliday(id: string) {
    //delect company holiday
    return this.firestore
      .collection('companyHolidays')
      .doc(id)
      .delete()
      .then(() => {
        this.utilityService.openSnackBar(
          'Company holiday deleted successfully'
        );
      })
      .catch((error) => {
        this.utilityService.openSnackBar('Failed to delete company holiday');
        console.error('Error deleting company holiday:', error);
        throw error;
      });
  }
}
