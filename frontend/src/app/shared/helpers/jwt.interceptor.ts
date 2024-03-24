import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const srvAuth = inject(AuthService);
    const srvToken = inject(TokenService);
    if (srvAuth.isloged()) {
      request=request.clone({
        setHeaders: {
          Authorization: `Bearer ${srvToken.token}`,
        },
      });
    }
    return next.handle(request);
  }
}
