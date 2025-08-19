import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { DocService } from '../../../service/doc.service';
import { UtilityService } from '../../../service/utility.service';

@Component({
  selector: 'app-emp-payslips',
  templateUrl: './emp-payslips.component.html',
  styleUrl: './emp-payslips.component.scss',
})
export class EmpPayslipsComponent {
  employeeData: any;
  docum: any[] = [];
  year: number = new Date().getFullYear();
  selectedYear: number = this.year;
  years = [2026, 2025, 2024, 2023, 2022];

  constructor(
    public authservice: AuthService,
    public docservice: DocService,
    public utilityService: UtilityService
  ) { }

  async ngOnInit() {
    const email = this.authservice.getUserEmail();
    this.employeeData = await this.authservice.getEmployeeByEmail(email);
    this.getPayslipsByEmployeeIdAndYear();
  }

  async getPayslipsByEmployeeIdAndYear() {
    this.docum = [];
    this.docum = await this.docservice.getPayslipsByEmployeeIdAndYear(
      this.employeeData.employeeId,
      this.selectedYear
    );
    console.log('Payslips for year:', this.selectedYear, this.docum);
  }

  viewDocument(filePath: string) {
    const newTab = window.open(filePath, '_blank');
    if (!newTab) {
      this.utilityService.openSnackBar(
        'Please allow pop-ups for this website to view the document.'
      );
    }
  }

  delectDoc(employeeId: string, year: number, fileName: string) {
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
}
