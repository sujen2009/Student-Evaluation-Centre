import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from './services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public userDetail;

  constructor(
    private readonly sessionService: SessionService,
    private readonly router: Router
  ) { }

  ngOnInit() {
    this.userDetail = this.sessionService.getUser();
    this.sessionService.onAuthChanged().subscribe(() => {
      this.userDetail = this.sessionService.getUser();
    });
  }

  public logout() {
    this.sessionService.revokeAuthentication();
    this.router.navigate(['/logout']);
  }

}
