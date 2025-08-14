import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-hr',
  templateUrl: './hr.component.html',
  styleUrl: './hr.component.scss',
})
export class HrComponent {
  isSidebarClosed = true;
  user: any;

  sidebarData = [
    {
      name: 'Home',
      icon: 'home',
      link: '/hr/home',
    },
    {
      name: 'Profile',
      icon: 'person',
      link: '/hr/profile',
    },
    {
      name: 'Employees Details',
      icon: 'group',
      link: '/hr/employees',
    },
    {
      name: 'payslips',
      icon: 'folder_open',
      link: '/hr/payslips',
    },
    {
      name: 'Company Holidays',
      icon: 'calendar_today',
      link: '/hr/holidays',
    },
    {
      name: 'Company Policy',
      icon: 'description',
      link: '/hr/policy',
    },
    // {
    //   name: 'Form 16',
    //   icon: 'article',
    //   link: '/hr/form16',
    // },
    // {
    //   name: 'FAQs',
    //   icon: 'question_mark',
    //   link: '/hr/faqs',
    // },
  ];

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {}

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
      this.cd.detectChanges();
    } else {
      this.isSidebarClosed = true;
      this.cd.detectChanges();
    }
  }

  toggleSidebar(btnclick?: string) {
    if (btnclick === 'sidebar' && window.innerWidth < 768) {
      console.log('Toggling sidebar', btnclick, this.isSidebarClosed);
      this.isSidebarClosed = false;
      this.cd.detectChanges();
      return;
    } else if (btnclick === 'menu') {
      console.log('Toggling sidebar', this.isSidebarClosed);
      this.isSidebarClosed = !this.isSidebarClosed;
      this.cd.detectChanges();
    }
  }

  userData() {
    const email = this.authService.getUserEmail();
    console.log(email);
    this.authService
      .getEmployeeByEmail(email)
      .then((data: any) => {
        if (data) {
          console.log('User data fetched:', data);
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
