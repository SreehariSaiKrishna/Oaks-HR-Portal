import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  employeeForm: FormGroup;

  constructor(private fb: FormBuilder, public authSvc: AuthService) {
    this.employeeForm = this.fb.group({
      fullName: ['', Validators.required],
      employeeId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      designation: ['', Validators.required],
      department: ['', Validators.required],
      dateOfJoining: [''],
      dateOfBirth: [''],
      password: [''],
    });
  }

  generatePassword() {
    const password = Math.random().toString(36).slice(-10); // simple random password
    this.employeeForm.patchValue({ password });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.authSvc
        .register(
          this.employeeForm.value.email,
          this.employeeForm.value.password
        )
        .then(() => {
          this.saveEmployeData();
          console.log('Registration successful');
        })
        .catch((error) => {
          console.error('Error during registration:', error);
          console.log('Form Data:', this.employeeForm.value);
        });
    } else {
      console.warn('Form is invalid');
    }
  }

  saveEmployeData() {
    const employeeData = this.employeeForm.value;
    if (employeeData) {
      this.authSvc.saveEmployeeData(employeeData).then(
        () => {
          console.log('Employee data saved successfully');
        },
        (error: any) => {
          console.error('Error saving employee data:', error);
        }
      );
    }
  }
}
