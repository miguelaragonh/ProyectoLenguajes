import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  const authsrv=inject(AuthService);
  const router = inject(Router);
  if (authsrv.isloged()) {
    router.navigate(['/login']);
  }
  return !authsrv.isloged();
};
