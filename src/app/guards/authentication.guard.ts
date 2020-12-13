import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { EnvironmentService } from '../services/environment.service';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  /**
   * Holds the URL component for the ID App.
   */
  private readonly LOGIN_APP_ID: string = 'id';

  constructor(
    private readonly sessionService: SessionService,
    private readonly environmentService: EnvironmentService,
    private readonly router: Router
  ) {}

  /**
   * Verifies that the current user is properly authenticated, as well as authorized
   *
   * @param route
   */
  public async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const isAuthenticated = await this.sessionService.isAuthenticated();
    if (!isAuthenticated) {
      this.redirectToLoginPage();
      return false;
    }
    return true;
  }

  /**
   * Determines the URL of the ID App to redirect to, in case the user is
   * not authenticated yet.
   *
   */
  private redirectToLoginPage(): void {
    this.router.navigate(['/login']);
  }
}
