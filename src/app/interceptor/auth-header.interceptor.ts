import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from '../services/session.service';
import { EnvironmentService } from '../services/environment.service';

/**
 * HTTP Interceptor to add an Authorization header to all outgoing
 * request, if a token is set (i.e. the user is logged in).
 */
@Injectable({
  providedIn: 'root'
})
export class AuthHeaderInterceptor implements HttpInterceptor {
  /**
   * Creates a new instance of the interceptor and provides services.
   *
   * @param sessionService Used to retrive the token from the user's cookies
   */
  constructor(
    private readonly sessionService: SessionService,
    private readonly environmentService: EnvironmentService
  ) { }

  /**
   * Adds the Authorization header if a user token is set in the cookies.
   *
   * @param request The original outgoing request
   * @param next The next HTTP handler to call with the original or modified request
   */
  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const token = this.sessionService.getToken();
    if (this.environmentService.isLocalSystem() || !token) {
      return next.handle(request);
    }

    const newHeader = {
      'Access-Control-Allow-Origin': 'http://localhost:4200/',
    };
    if (token) {
      newHeader['Authorization'] = 'Bearer ' + token;
    }
    const newRequest = request.clone({
      setHeaders: newHeader,
      withCredentials: true
    });

    // Pass the cloned request instead of the original request to the next handle
    return next.handle(newRequest);
  }
}
