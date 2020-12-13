import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SessionService } from './services/session.service';

import {
  MatCardModule,
  MatInputModule,
  MatButtonModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieModule } from 'ngx-cookie';
import { ToastNotificationComponent } from './components/toast-notification/toast-notification.component';
import { AuthHeaderInterceptor } from './interceptor/auth-header.interceptor';
import { QuestionAnswerService } from './services/question-answer.service';
import { LoaderComponent } from './components/loader/loader.component';
import { CountdownGlobalConfig, CountdownModule } from 'ngx-countdown';

function countdownConfigFactory() {
  return { format: `mm:ss`};
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ToastNotificationComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CookieModule.forRoot(),
    CountdownModule
  ],
  providers: [
    SessionService,
    QuestionAnswerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInterceptor,
      multi: true
    },
    { provide: CountdownGlobalConfig, useFactory: countdownConfigFactory }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
