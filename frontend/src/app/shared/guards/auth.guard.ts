import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const srvAuth = inject(AuthService);
  if (srvAuth.isloged()) {
    if(Object.keys(route.data).length !==0 && route.data['roles'].indexOf(srvAuth.valorUserActual.idRol)===-1){
      router.navigate(['/error403']);
      return false;
    }
    return true;
  }
  srvAuth.logout();
  router.navigate(['/error403']);
  return false;
};
