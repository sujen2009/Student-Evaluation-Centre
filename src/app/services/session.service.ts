import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import jwtDecode from 'jwt-decode';
import { EnvironmentService } from './environment.service';
import { Subject } from 'rxjs';


export interface JwtToken {
  exp: number;
  sub: string;
  given_name: string; // first name
  family_name: string; // last name
  email: string;
}

const COOKIE_NAME_TOKEN = `token`;
const ONE_MINUTE: number = 60 /* s */ * 1; /* min */

@Injectable()
export class SessionService {
  private authChanged: Subject<void> = new Subject();
  /**
   * Defines the TLD for which the cookie will be set.
   */
  private readonly COOKIE_DOMAIN: string = this.environmentService.isLocalSystem() ? 'localhost' : 'mountoliveschool.edu.np';

  constructor(
    private readonly cookieService: CookieService,
    private readonly environmentService: EnvironmentService
  ) {}

  /**
   * Returns the authentication token of the current user.
   */
  public getToken(): string {
    return this.cookieService.get(COOKIE_NAME_TOKEN);
  }

  public getDecodedToken(): JwtToken {
    if (!this.getToken()) {
      return null;
    }

    return jwtDecode(this.getToken());
  }

  /**
   * Returns the current user's information.
   */
  public getUser() {
    if (!this.getToken()) {
      return null;
    }

    return this.getDecodedToken();
  }

  /**
   * Saves the authorization state with a given id token
   *
   * @param idToken
   */
  public storeAuthentication(
    idToken: string
  ): void {
    this.cookieService.put(COOKIE_NAME_TOKEN, idToken, {
      domain: this.COOKIE_DOMAIN
    });
    this.authChanged.next();
  }

  /**
   * Removes the current authorization state, i.e. logs out the user.
   */
  public revokeAuthentication(): void {
    this.cookieService.remove(COOKIE_NAME_TOKEN, { domain: this.COOKIE_DOMAIN });

    // Remove me after a while! Just for clean-up
    this.cookieService.remove(COOKIE_NAME_TOKEN);
    this.authChanged.next();
  }

  /**
   * Returns whether the current token is expired or not.
   */
  public isTokenExpired(): boolean {
    // If any of the tokens is missing, clean up and bail out
    if (!this.getToken()) {
      return true;
    }
    const token = this.getDecodedToken();
    return token.exp <= Date.now() / 1000;
  }

  /**
   * Returns whether the current user is authenticated based on their existing tokens.
   */
  public async isAuthenticated(): Promise<boolean> {
    // If any of the tokens is missing, clean up and bail out
    if (!this.getToken()) {
      this.revokeAuthentication();
      return false;
    }

    const token = this.getDecodedToken();

    // Token is expired - can we refresh it?
    const isTokenExpired = token.exp <= Date.now() / 1000;
    this.authChanged.next();
    if (isTokenExpired) {
      return false;
    }

    return true;
  }

  public onAuthChanged() {
    return this.authChanged.asObservable();
  }

}
