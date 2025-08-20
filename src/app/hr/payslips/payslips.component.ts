import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { UtilityService } from '../../service/utility.service';
import { DocService } from '../../service/doc.service';

@Component({
  selector: 'app-payslips',
  templateUrl: './payslips.component.html',
  styleUrl: './payslips.component.scss',
})
export class PayslipsComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  docum: any[] = [];
  year: number = new Date().getFullYear();
  selectedYear: number = this.year;
  selectedMonth: string = '';
  employeeSearch: string = '';
  years = [2026, 2025, 2024, 2023, 2022];
  months = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ];

  constructor(
    public authservice: AuthService,
    public docservice: DocService,
    public utilityService: UtilityService
  ) { }

  getDocs() {
    this.docservice.getPaySlipsPdfs().then((pdfs) => {
      this.docum = pdfs.map((pdf) => ({
        fileName: pdf.name,
        description: 'Payslips for ' + pdf.name,
        url: pdf.url,
        year: pdf.year,
        size: (parseInt(pdf.size, 10) / (1024 * 1024)).toFixed(2) + ' MB',
        createdDate: new Date(pdf.createdDate).toISOString().split('T')[0],
        updatedDate: new Date(pdf.updatedDate).toISOString().split('T')[0],
      }));
    });
    console.log('Documents:', this.docum);
  }

  triggerFileUpload() {
    this.fileInput.nativeElement.click();
  }

  addDocument(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;

    const MAX_SIZE_MB = 1;
    const maxSize = MAX_SIZE_MB * 1024 * 1024;

    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type !== 'application/pdf') {
        this.utilityService.openSnackBar(`"${file.name}" is not a PDF file.`);
        continue;
      }

      if (file.size > maxSize) {
        this.utilityService.openSnackBar(
          `"${file.name}" size should be less than ${MAX_SIZE_MB}MB`
        );
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      this.uploadPdfs(validFiles);
    }
  }

  async uploadPdfs(files: File[]) {
    try {
      for (const file of files) {
        await this.docservice.uploadPayslips(file, this.year);
      }

      this.utilityService.openSnackBar('All valid PDFs uploaded successfully');
    } catch (error) {
      this.utilityService.openSnackBar('uploads failed');
    }
  }

  viewDocument(filePath: string) {
    const newTab = window.open(filePath, '_blank');
    if (!newTab) {
      this.utilityService.openSnackBar(
        'Please allow pop-ups for this website to view the document.'
      );
    }
  }

  deleteDoc(employeeId: string, year: number, fileName: string) {
    this.docservice
      .deletePayslip(employeeId, year, fileName)
      .then(() => {
        this.utilityService.openSnackBar('Document deleted successfully');
        this.docum = this.docum.filter((doc) => doc.fileName !== fileName);
      })
      .catch((error) => {
        console.error('Error deleting document:', error);
        this.utilityService.openSnackBar('Failed to delete document');
      });
  }

  async getPayslipsByPeriod() {
    this.docum = [];
    this.docum = await this.docservice.getPayslipsByYearAndMonth(
      this.selectedYear,
      this.selectedMonth
    );
    console.log(
      'Payslips for year:',
      this.selectedYear,
      'and month:',
      this.selectedMonth,
      this.docum
    );
  }

  async getEmployeePayslips() {
    this.docum = [];
    this.docum = await this.docservice.getPayslipsByEmployeeId(
      this.employeeSearch
    );
    console.log('Payslips for employee ID:', this.docum);
  }
}
