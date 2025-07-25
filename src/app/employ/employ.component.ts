import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './employ.component.html',
  styleUrl: './employ.component.scss',
})
export class EmployComponent {
  isSidebarClosed = true;
  user: any;

  sidebarData = [
    {
      name: 'Home',
      icon: 'home',
      link: '/employ/home',
    },
    {
      name: 'Profile',
      icon: 'person',
      link: '/employ/profile',
    },
    {
      name: 'Company Holidays',
      icon: 'calendar_today',
      link: '/employ/holidays',
    },
    // {
    //   name: 'Payslips',
    //   icon: 'folder_open',
    //   link: '/employ/payslips',
    // },
    {
      name: 'Company Policy',
      icon: 'description',
      link: '/employ/policy',
    },
    // {
    //   name: 'Form 16',
    //   icon: 'article',
    //   link: '/employ/form16',
    // },
    // {
    //   name: 'FAQs',
    //   icon: 'question_mark',
    //   link: '/employ/faqs',
    // },
  ];

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.userData();
  }

  ngAfterViewInit() {
    this.checkSidebarOnResize();
    window.addEventListener('resize', this.checkSidebarOnResize.bind(this));
  }

  isActive(route: string): boolean {
    // If the current route includes the page's route
    if (this.router.url.includes(route)) {
      return true;
    }

    // If no pages match, default to first page
    const matched =
      this.sidebarData.some((p) => this.router.url.includes(p.link)) ||
      this.router.url.includes('profile');
    return !matched && route === this.sidebarData[0].link;
  }

  checkSidebarOnResize() {
    if (window.innerWidth < 768) {
      this.isSidebarClosed = false;
    } else {
      this.isSidebarClosed = true;
    }
  }

  // openDialog() {
  //   const dialogRef = this.dialog.open(RegisterComponent, {
  //     width: '600px', // or '80vw'
  //     panelClass: 'register-dialog',
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }

  toggleSidebar(btnclick?: string) {
    if (btnclick === 'sidebar' && window.innerWidth < 768) {
      console.log('Toggling sidebar', btnclick, this.isSidebarClosed);
      this.isSidebarClosed = false;
      return;
    } else if (btnclick === 'menu') {
      console.log('Toggling sidebar', this.isSidebarClosed);
      this.isSidebarClosed = !this.isSidebarClosed;
    }
  }

  userData() {
    const email = this.authService.getUserEmail();
    console.log(email);
    this.authService
      .getEmployeeByEmail(email)
      .then((data: any) => {
        if (data) {
          this.user = data;
        } else {
          console.log('No user data found for this email.');
        }
      })
      .catch((error: any) => {
        console.error('Error fetching user data:', error);
      });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkSidebarOnResize.bind(this));
  }
}
