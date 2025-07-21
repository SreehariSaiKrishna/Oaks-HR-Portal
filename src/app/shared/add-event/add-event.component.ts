import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { UtilityService } from '../../service/utility.service';

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
    public utility: UtilityService
  ) {
    this.eventForm = this.fb.group({
      date: ['', Validators.required],
      eventName: ['', Validators.required],
      eventType: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.authService
        .saveCompanyHoliday(this.eventForm.value)
        .then(() => {
          console.log('Event saved successfully');
          this.eventForm.reset();
          this.utility.openSnackBar('Event saved successfully');
          // send the close event to the parent component
        })
        .catch((error) => {
          this.utility.openSnackBar('Event saving event');
          console.error('Error saving event:', error);
        });
      // Optionally, you can log the form data or perform additional actions
      console.log('Form Data:', this.eventForm.value);
    }
  }

  onCancel() {
    this.eventForm.reset();
  }
}
