import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastNotificationService, ToastType } from 'src/app/components/toast-notification/toast-notification.service';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [
    AuthService
  ]
})
export class LoginComponent implements OnInit {

  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();

  public isLoggingIn: boolean;

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly toastNotificationService: ToastNotificationService
  ) { }

  ngOnInit(){}

  submit() {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value);
    }
    this.isLoggingIn = true;
    this.authService.login(this.form.get('username').value, this.form.get('password').value).subscribe(
      {
        next: (data: { token: string }) => {
          this.isLoggingIn = false;
          if (data.token) {
            this.sessionService.storeAuthentication(data.token);
            this.router.navigate(['/home']);
          } else {
            this.toastNotificationService.showToast({
              content: 'Login Failed',
              duration: 5000,
              type: ToastType.ERROR
            })
          }
        }
      }
    );
  }
}
