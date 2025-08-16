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
  filterYear: number = this.year;
  filterMonth: string = '';
  filterEmpId: string = '';

  constructor(
    public authservice: AuthService,
    public docservice: DocService,
    public utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.getDocs();
  }

  getDocs() {
    this.docservice.getPaySlipsPdfs().then((pdfs) => {
      this.docum = pdfs.map((pdf) => ({
        name: pdf.name,
        description: 'Payslips for ' + this.getpdfName(pdf.name),
        link: pdf.url,
        size: (parseInt(pdf.size, 10) / (1024 * 1024)).toFixed(2) + ' MB',
        createdDate: new Date(pdf.createdDate).toISOString().split('T')[0],
        updaedDate: new Date(pdf.updatedDate).toISOString().split('T')[0],
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
      this.docum = [];
      this.getDocs(); // Refresh list after upload
    } catch (error) {
      this.utilityService.openSnackBar('uploads failed');
    }
  }

  viewDocument(filePath: string) {
    // Open the PDF in a new tab
    const newTab = window.open(filePath, '_blank');
    if (!newTab) {
      this.utilityService.openSnackBar(
        'Please allow pop-ups for this website to view the document.'
      );
    }
  }

  downloadDocument(filePath: string) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = filePath.split('/').pop() || 'document.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // this.utilityService.openSnackBar('Download started... ');
  }

  getpdfName(fileName: string) {
    return fileName.endsWith('.pdf') ? fileName.replace('.pdf', '') : fileName;
  }

  delectDoc(fileName: string) {
    this.docservice
      .delectPolicyDocument(fileName)
      .then(() => {
        this.utilityService.openSnackBar('Document deleted successfully');
        this.docum = []; // Clear the document list
        // this.getDocs(); // Refresh the document list after deletion
      })
      .catch((error) => {
        console.error('Error deleting document:', error);
        this.utilityService.openSnackBar('Failed to delete document');
      });
  }

  async getpayslipYear() {
    const a = await this.docservice.getPayslipsByYearAndMonth(this.filterYear, this.filterMonth);
    console.log('Payslips for year:', a);
  }

  async getpayslipEmpId() {
    const a = await this.docservice.getPayslipsByEmployeeId(this.filterEmpId);
    console.log('Payslips for employee ID:', a);
  }
}
