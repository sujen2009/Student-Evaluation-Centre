import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from './environment.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly http: HttpClient,
    private readonly environmentService: EnvironmentService
  ) {
  }

  public login(email, password): Observable<{token: string}> {
    const body = new FormData();
    body.append('email', email);
    body.append('password', password);
    return this.http.post<{token: string}>(`${this.environmentService.getUrl()}?action=login`, body, {
      params: {
        email,
        password
      }
    });
  }
}
