import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { UtilityService } from '../../service/utility.service';

@Component({
  selector: 'app-company-policy',
  templateUrl: './company-policy.component.html',
  styleUrl: './company-policy.component.scss',
})
export class CompanyPolicyComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  docum: any[] = [];

  constructor(
    public authservice: AuthService,
    public utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.getDocs();
  }

  getDocs() {
    this.authservice.getStoredPdfs().then((pdfs) => {
      this.docum = pdfs.map((pdf) => ({
        name: pdf.name,
        description: 'Company Policy Document',
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
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const MAX_SIZE_MB = 1;
    const maxSize = MAX_SIZE_MB * 1024 * 1024;

    if (file.type !== 'application/pdf') {
      this.utilityService.openSnackBar('Only PDF files are allowed.');
      return;
    }

    if (file.size > maxSize) {
      this.utilityService.openSnackBar(
        `File size should be less than ${MAX_SIZE_MB}MB`
      );
      return;
    }
    this.uploadPdf(file);
  }

  async uploadPdf(selectedFile: File) {
    if (selectedFile) {
      try {
        await this.authservice.uploadPdf(
          selectedFile,
          `companyDocuments/${selectedFile.name}`
        );
        this.utilityService.openSnackBar('Uploaded PDF URL');
        this.docum = []; // Clear the document list
        this.getDocs(); // Refresh the document list after upload
      } catch (error) {
        this.utilityService.openSnackBar('Upload failed');
      }
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
        this.getDocs(); // Refresh the document list after deletion
      })
      .catch((error) => {
        console.error('Error deleting document:', error);
        this.utilityService.openSnackBar('Failed to delete document');
      });
  }
}
