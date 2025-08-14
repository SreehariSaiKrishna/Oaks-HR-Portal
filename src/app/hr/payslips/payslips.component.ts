import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { UtilityService } from '../../service/utility.service';

@Component({
  selector: 'app-payslips',
  templateUrl: './payslips.component.html',
  styleUrl: './payslips.component.scss',
})
export class PayslipsComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  docum: any[] = [];
  month: string = 'january';
  year: string = '2025';

  constructor(
    public authservice: AuthService,
    public utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.getDocs();
  }

  getDocs() {
    this.authservice.getPaySlipsPdfs().then((pdfs) => {
      this.docum = pdfs.map((pdf) => ({
        name: pdf.name,
        description: 'Payslips for ' + this.getpdfName(pdf.name),
        link: pdf.url,
        size: (parseInt(pdf.size, 10) / (1024 * 1024)).toFixed(2) + ' MB',
        createdDate: new Date(pdf.createdDate).toISOString().split('T')[0],
        updaedDate: new Date(pdf.updatedDate).toISOString().split('T')[0],
      }));
    });
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
        await this.authservice.uploadPayslips(file, this.year, this.month);
      }
      this.utilityService.openSnackBar('All valid PDFs uploaded successfully');
      this.docum = [];
      this.getDocs(); // Refresh list after upload
    } catch (error) {
      this.utilityService.openSnackBar('Some uploads failed');
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
    this.authservice
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
}
