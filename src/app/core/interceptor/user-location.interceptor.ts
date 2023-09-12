// Decorators
import { Injectable } from '@angular/core';

// RXJS
import { Observable, tap } from 'rxjs';

// HTTP
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';

// Services
import { UserService } from '../services/user.service';

@Injectable()
export class UrlLocationInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.userService.hasLocationAccess.value) {
      const locationRequest = request.clone({
        headers: request.headers
          .set('latitude', this.userService.hasLocationAccess.value.coords.latitude.toString())
          .set('longitude', this.userService.hasLocationAccess.value?.coords.longitude.toString())
      });

      return next.handle(locationRequest).pipe(
        tap({
          next: (res) => { },
          error: (err) => {
            if (err.status === 444) this.onAuthLocationChanged(err);
          }
        }
        ));
    }
    else {
      return next.handle(request);
    }
  }

  onAuthLocationChanged(err: any) {
    this.userService.isAuthLocationChanged(true)
  }

}
