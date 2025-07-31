import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { UtilityService } from '../../service/utility.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authSvc: AuthService,
    public utilityService: UtilityService,
    private dialogRef: MatDialogRef<RegisterComponent>
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      employeeId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      designation: ['', Validators.required],
      team: ['', Validators.required],
      reportingManager: ['', Validators.required],
      managerEmail: ['', [Validators.required, Validators.email]],
      doj: [''],
      password: ['123456'],
    });
  }

  // generatePassword() {
  //   const password = Math.random().toString(36).slice(-10); // simple random password
  //   this.employeeForm.patchValue({ password });
  // }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.authSvc
        .register(
          this.employeeForm.value.email.toLowerCase(),
          this.employeeForm.value.password
        )
        .then(() => {
          this.saveEmployeData();
        })
        .catch((error) => {
          console.error('Error during registration:', error);
          this.utilityService.openSnackBar('Error during registration');
        });
    } else {
      console.warn('Form is invalid');
      this.utilityService.openSnackBar('Employee data is invalid');
    }
  }

  saveEmployeData() {
    const employeeData = {
      ...this.employeeForm.value,
      email: this.employeeForm.value.email.toLowerCase(),
      name:
        this.employeeForm.value.name.charAt(0).toUpperCase() +
        this.employeeForm.value.name.slice(1).toLowerCase(),
    };

    if (employeeData) {
      this.authSvc.saveEmployeeData(employeeData).then(
        () => {
          this.utilityService.openSnackBar('Employee data saved successfully');
          this.dialogRef.close();
        },
        (error: any) => {
          console.error('Error saving employee data:', error);
        }
      );
    }
  }

  onCancel() {
    this.dialogRef.close();
    this.employeeForm.reset();
  }
}
