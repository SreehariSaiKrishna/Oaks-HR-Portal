import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor(public snackBar: MatSnackBar) {}

  openSnackBar(msg: string) {
    this.snackBar.open(msg, '', {
      duration: 3000,
    });
  }
}
