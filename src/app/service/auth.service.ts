import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  getMetadata,
  deleteObject,
} from '@angular/fire/storage';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore,
    private storage: Storage,
    public utilityService: UtilityService
  ) {}

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

  saveCompanyHoliday(holidayData: any) {
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

  async uploadPdf(file: File, path: string) {
    try {
      this.checkIfPdfNameExists(file);
      // Check if the file already exists in the storage
      const fileRef = ref(this.storage, path);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (err) {
      this.utilityService.openSnackBar('Upload failed');
      this.utilityService.openSnackBar('Upload failed');
      return null;
    }
  }

  async checkIfPdfNameExists(file: File) {
    try {
      const listResult = await listAll(ref(this.storage, 'companyDocuments'));
      const duplicate = listResult.items.find(
        (item) => item.name === file.name
      );
      if (duplicate) {
        this.utilityService.openSnackBar(
          `Duplicate file name found: ${file.name}`
        );
      }
    } catch (err) {
      this.utilityService.openSnackBar(
        `Error checking for duplicates: ${file.name}`
      );
    }
  }

  async getStoredPdfs() {
    const pdfs: any[] = [];
    const pdfsRef = ref(this.storage, 'companyDocuments');
    const listResult = await listAll(pdfsRef);
    for (const item of listResult.items) {
      const url = await getDownloadURL(item);
      const metadata = await getMetadata(item);
      pdfs.push({
        name: item.name,
        url: url,
        size: metadata.size,
        createdDate: metadata.timeCreated,
        updatedDate: metadata.updated,
      });
    }
    return pdfs;
  }

  delectPolicyDocument(fileName: string) {
    const filePath = `companyDocuments/${fileName}`;
    const fileRef = ref(this.storage, filePath);
    return deleteObject(fileRef)
      .then(() => {
        this.utilityService.openSnackBar('Document deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting document:', error);
        this.utilityService.openSnackBar('Failed to delete document');
      });
  }
}
