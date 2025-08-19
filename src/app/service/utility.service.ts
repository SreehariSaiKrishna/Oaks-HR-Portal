import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor(public snackBar: MatSnackBar) { }

  openSnackBar(msg: string) {
    this.snackBar.open(msg, '', {
      duration: 3000,
    });
  }

  getMonth(fileName: string): string {
    const monthMap: { [key: string]: string } = {
      '01': 'January',
      '02': 'February',
      '03': 'March',
      '04': 'April',
      '05': 'May',
      '06': 'June',
      '07': 'July',
      '08': 'August',
      '09': 'September',
      '10': 'October',
      '11': 'November',
      '12': 'December',
    };

    const monthCode = fileName.split('-')[1]?.replace('.pdf', '') || '';
    return monthMap[monthCode] || 'Unknown';
  }

}
