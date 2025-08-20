import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { UtilityService } from './utility.service';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore,
    public utilityService: UtilityService,
    public loaderSvc: LoaderService
  ) { }

  //login
  login(email: string, password: string) {
    this.loaderSvc.show();
    return this.fireauth.signInWithEmailAndPassword(email, password).then(
      () => {
        localStorage.setItem('token', 'true');
        this.router.navigate(['/employ']);
        this.loaderSvc.hide();
      },
      (error) => {
        this.utilityService.openSnackBar('Login failed');
        console.error('Login failed:', error);
        this.router.navigate(['/login']);
        this.loaderSvc.hide();
      }
    );
  }

  //register
  register(email: string, password: string) {
    this.loaderSvc.show();
    return this.fireauth.createUserWithEmailAndPassword(email, password).then(
      () => {
        localStorage.setItem('token', 'true');
        this.loaderSvc.hide();
      },
      (error) => {
        console.error('Registration failed:', error);
        this.utilityService.openSnackBar('Registration failed');
        this.loaderSvc.hide();
      }
    );
  }

  //logout
  logout() {
    this.loaderSvc.show();
    return this.fireauth.signOut().then(
      () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
        this.loaderSvc.hide();
      },
      (err) => {
        console.error('Logout failed:', err);
        this.utilityService.openSnackBar('Logout failed');
        this.loaderSvc.hide();
      }
    );
  }

  saveEmployeeData(employeeData: any) {
    this.loaderSvc.show();
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
          this.loaderSvc.hide();
          return Promise.reject('Employee already exists');
        } else {
          return this.firestore
            .collection('employees')
            .add(employeeData)
            .then(() => {
              this.loaderSvc.hide();
              // console.log('Employee data saved:', employeeData);
            });
        }
      })
      .catch((error: any) => {
        this.loaderSvc.hide();
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

  getEmployeeByEmail(email: string) {
    this.loaderSvc.show();
    return this.firestore
      .collection('employees', (ref) => ref.where('email', '==', email))
      .get()
      .toPromise()
      .then((querySnapshot) => {
        if (querySnapshot && !querySnapshot.empty) {
          const employeeData = querySnapshot.docs[0].data();
          this.loaderSvc.hide();
          return employeeData;
        } else {
          this.loaderSvc.hide();
          return null;
        }
      })
      .catch((error) => {
        this.loaderSvc.hide();
        this.utilityService.openSnackBar('Error fetching employee data');
        console.error('Error fetching employee data:', error);
        throw error;
      });
  }

  getAllHrIds() {
    this.loaderSvc.show();
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
        this.loaderSvc.hide();
        return employees;
      })
      .catch((error) => {
        this.loaderSvc.hide();
        this.utilityService.openSnackBar('Error fetching HR IDs');
        console.error('Error fetching HR IDs:', error);
        throw error;
      });
  }

  editEmployeDetails(email: string, updatedData: any) {
    this.loaderSvc.show();
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
              this.loaderSvc.hide();
            });
        } else {
          this.utilityService.openSnackBar(
            'No employee found with the given email'
          );
          this.loaderSvc.hide();
          return Promise.reject('No employee found');
        }
      })
      .catch((error) => {
        this.utilityService.openSnackBar('Error updating employee details');
        console.error('Error updating employee details:', error);
        this.loaderSvc.hide();
        throw error;
      });
  }

  getAllEmployees() {
    this.loaderSvc.show();
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
        this.loaderSvc.hide();
        return employees;
      })
      .catch((error) => {
        this.utilityService.openSnackBar('Error fetching employees');
        console.error('Error fetching employees:', error);
        this.loaderSvc.hide();
        throw error;
      });
  }

  addCompanyHoliday(holidayData: any) {
    this.loaderSvc.show();
    return this.firestore
      .collection('companyHolidays')
      .add(holidayData)
      .then(() => {
        console.log('Company holiday saved:', holidayData);
        this.loaderSvc.hide();
      })
      .catch((error) => {
        this.utilityService.openSnackBar('Error saving company holiday');
        console.error('Error saving company holiday:', error);
        this.loaderSvc.hide();
        throw error;
      });
  }

  getCompanyHolidays() {
    this.loaderSvc.show();
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
        this.loaderSvc.hide();
        return holidays;
      })
      .catch((error) => {
        this.utilityService.openSnackBar('Error fetching company holidays');
        console.error('Error fetching company holidays:', error);
        this.loaderSvc.hide();
        throw error;
      });
  }

  deleteCompanyHoliday(id: string) {
    //delete company holiday
    this.loaderSvc.show();
    return this.firestore
      .collection('companyHolidays')
      .doc(id)
      .delete()
      .then(() => {
        this.utilityService.openSnackBar(
          'Company holiday deleted successfully'
        );
        this.loaderSvc.hide();
      })
      .catch((error: any) => {
        this.utilityService.openSnackBar('Failed to delete company holiday');
        console.error('Error deleting company holiday:', error);
        this.loaderSvc.hide();
        throw error;
      });
  }
}
