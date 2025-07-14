import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = !!localStorage.getItem('user');
  if (isLoggedIn) {
    return true;
  } else {
    return router.createUrlTree(['/login']); // redirect to login
  }
  // return true;
};
