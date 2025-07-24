import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { UtilityService } from '../../service/utility.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss',
})
export class AddEventComponent {
  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public utility: UtilityService,
    private dialogRef: MatDialogRef<AddEventComponent>
  ) {
    this.eventForm = this.fb.group({
      date: ['', Validators.required],
      eventName: ['', Validators.required],
      eventType: ['', Validators.required],
    });
  }

  onSubmit() {
    this.dialogRef.close(this.eventForm.value);
    if (this.eventForm.valid) {
      this.authService
        .saveCompanyHoliday(this.eventForm.value)
        .then(() => {
          this.eventForm.reset();
          this.utility.openSnackBar('Event saved successfully');
        })
        .catch((error) => {
          this.utility.openSnackBar('Event saving event');
          console.error('Error saving event:', error);
        });
    }
  }

  onCancel() {
    this.dialogRef.close();
    this.eventForm.reset();
  }
}
