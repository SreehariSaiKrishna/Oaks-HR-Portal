import { Injectable } from '@angular/core';
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
export class DocService {
  constructor(
    private storage: Storage,
    public utilityService: UtilityService
  ) {}

  async uploadComPolicyPdf(file: File, path: string) {
    try {
      this.checkComPolicyPdfNameExists(file);
      // Check if the file already exists in the storage
      const fileRef = ref(this.storage, path);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (err) {
      this.utilityService.openSnackBar('Upload failed');
      return null;
    }
  }

  async checkComPolicyPdfNameExists(file: File) {
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

  async getPolicyPdfs() {
    const pdfs: any[] = [];
    try {
      const path = 'companyDocuments';
      const pdfsRef = ref(this.storage, path);
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
    } catch (error) {
      console.error('Error fetching PDFs:', error);
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

  async uploadPayslips(file: File, year: number) {
    try {
      if (!file || !file.name) {
        this.utilityService.openSnackBar('Invalid file');
        return;
      }

      // Remove extension
      const nameWithoutExt = file.name.replace(/\.pdf$/i, '');

      // Split by last dash
      const lastDashIndex = nameWithoutExt.lastIndexOf('-');
      if (lastDashIndex === -1) {
        this.utilityService.openSnackBar('Invalid file name format');
        return;
      }

      const empId = nameWithoutExt.substring(0, lastDashIndex);
      const monthStr = nameWithoutExt.substring(lastDashIndex + 1);
      const monthNum = parseInt(monthStr, 10);

      // Validate month
      if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        this.utilityService.openSnackBar(
          `Invalid month in filename: ${file.name}`
        );
        return;
      }

      // ✅ Check if the payslip month already exists
      const duplicateExists = await this.checkPayslipNameExists(file, year);
      if (duplicateExists) {
        return;
      }

      // Upload to Firebase Storage
      const storageRef = ref(
        this.storage,
        `payslips/${empId}/${year}/${file.name}`
      );
      await uploadBytes(storageRef, file);
    } catch (err) {
      this.utilityService.openSnackBar('Upload failed');
      console.error('Error uploading payslip:', err);
      throw err;
    }
  }

  async checkPayslipNameExists(file: File, year: number) {
    try {
      const nameWithoutExt = file.name.replace(/\.pdf$/i, '');
      const lastDashIndex = nameWithoutExt.lastIndexOf('-');

      const empId = nameWithoutExt.substring(0, lastDashIndex);
      const monthStr = nameWithoutExt.substring(lastDashIndex + 1);
      const monthNum = parseInt(monthStr, 10);

      // ✅ Check only in that employee's year folder
      const listResult = await listAll(
        ref(this.storage, `payslips/${empId}/${year}`)
      );

      const duplicate = listResult.items.find((item) => {
        const existingName = item.name.replace(/\.pdf$/i, '');
        const existingMonth = existingName.substring(
          existingName.lastIndexOf('-') + 1
        );
        return parseInt(existingMonth, 10) === monthNum;
      });

      if (duplicate) {
        this.utilityService.openSnackBar(
          `Payslip for month ${monthStr} already exists for ${empId} in ${year}`
        );
        return true;
      }

      return false;
    } catch (err) {
      this.utilityService.openSnackBar(
        `Error checking for duplicates: ${file.name}`
      );
      return false;
    }
  }

  async getPaySlipsPdfs() {
    const pdfs: any[] = [];
    try {
      const path = 'payslips';
      const pdfsRef = ref(this.storage, path);
      const listResult = await listAll(pdfsRef);
      for (const item of listResult.items) {
        const url = await getDownloadURL(item);
        const metadata = await getMetadata(item);
        console.log('PDF Metadata:', metadata);
        pdfs.push({
          name: item.name,
          url: url,
          size: metadata.size,
          createdDate: metadata.timeCreated,
          updatedDate: metadata.updated,
        });
      }
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    }
    return pdfs;
  }

  async getPayslipsByEmployeeIdAndYear(employeeId: string, year: number) {
    try {
      // Reference to the employee's year folder
      const folderRef = ref(this.storage, `payslips/${employeeId}/${year}`);

      // List all files in that folder
      const listResult = await listAll(folderRef);

      // Fetch download URLs for each file
      const payslips = await Promise.all(
        listResult.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          const metadata = await getMetadata(itemRef);
          return {
            year: year,
            employeeId,
            fileName: itemRef.name,
            url,
          };
        })
      );

      return payslips;
    } catch (err) {
      console.error(
        `Error fetching payslips for ${employeeId} in ${year}:`,
        err
      );
      this.utilityService.openSnackBar(`Error fetching payslips`);
      return [];
    }
  }

  async getPayslipsByYearAndMonth(year: number, month: string) {
    try {
      const rootRef = ref(this.storage, 'payslips');

      // Step 1: Get all employee folders
      const employeesList = await listAll(rootRef);
      const allPayslips: {
        year: number;
        employeeId: string;
        fileName: string;
        url: string;
      }[] = [];

      for (const empFolder of employeesList.prefixes) {
        const employeeId = empFolder.name;

        // Step 2: Reference the year folder for that employee
        const yearFolderRef = ref(
          this.storage,
          `payslips/${employeeId}/${year}`
        );

        try {
          const yearList = await listAll(yearFolderRef);

          // Step 3: Find file matching the month (e.g., OAK001-01.pdf)
          for (const item of yearList.items) {
            if (item.name.endsWith(`-${month}.pdf`)) {
              const url = await getDownloadURL(item);
              allPayslips.push({
                year: year,
                employeeId,
                fileName: item.name,
                url,
              });
            }
          }
        } catch {
          // No folder for this year → skip
          continue;
        }
      }

      return allPayslips;
    } catch (err) {
      console.error(`Error fetching payslips for ${year}-${month}:`, err);
      this.utilityService.openSnackBar('Error fetching payslips');
      return [];
    }
  }

  async getPayslipsByEmployeeId(employeeId: string) {
    try {
      const empRootRef = ref(this.storage, `payslips/${employeeId}`);

      // Step 1: Get all year folders for that employee
      const yearsList = await listAll(empRootRef);
      const allPayslips: {
        year: string;
        fileName: string;
        url: string;
        employeeId: string;
      }[] = [];

      for (const yearFolder of yearsList.prefixes) {
        const year = yearFolder.name; // folder name is year
        const yearFolderRef = ref(
          this.storage,
          `payslips/${employeeId}/${year}`
        );

        // Step 2: List all files in that year folder
        const filesList = await listAll(yearFolderRef);

        for (const fileRef of filesList.items) {
          const url = await getDownloadURL(fileRef);
          allPayslips.push({
            year,
            fileName: fileRef.name,
            url,
            employeeId: employeeId,
          });
        }
      }

      return allPayslips;
    } catch (err) {
      console.error(`Error fetching payslips for employee ${employeeId}:`, err);
      this.utilityService.openSnackBar('Error fetching payslips');
      return [];
    }
  }

  async deletePayslip(employeeId: string, year: number, fileName: string) {
    try {
      const fileRef = ref(
        this.storage,
        `payslips/${employeeId}/${year}/${fileName}`
      );
      await deleteObject(fileRef);
      this.utilityService.openSnackBar('Payslip deleted successfully');
    } catch (err) {
      this.utilityService.openSnackBar('Failed to delete payslip');
      console.error('Error deleting payslip:', err);
      throw err;
    }
  }
}
