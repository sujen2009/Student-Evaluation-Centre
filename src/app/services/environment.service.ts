import { Injectable } from '@angular/core';

export enum ENV_MOCK_KEYS {
  MOCK_REST = 'MOCK_REST'
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  public getUrl(
  ) {
    if (
      this.isLocalSystem()
    ) {
      return 'http://localhost/mountolivesuraj/api/';
    }
    return 'http://exam.mountoliveschool.edu.np/api/';
  }

  public isLocalSystem() {
    if (
      window.location.hostname.indexOf('localhost') !== -1
    ) {
      return true;
    }
    return false;
  }
}
