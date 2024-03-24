import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
srvLoader=inject(LoaderService)
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.srvLoader.show();
    return next.handle(request)
    .pipe(
      finalize(
        ()=> {
          setTimeout(()=>{
          this.srvLoader.hide()
          },1200
          )
        }
      )
    );
  }
}