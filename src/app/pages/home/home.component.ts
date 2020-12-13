import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CountdownComponent } from 'ngx-countdown';
import { ToastNotificationService, ToastType } from 'src/app/components/toast-notification/toast-notification.service';
import { QuestionAnswerService } from 'src/app/services/question-answer.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(
    private readonly toastNotificationService: ToastNotificationService,
    private readonly sessionService: SessionService,
    private readonly questionAnswerService: QuestionAnswerService,
    private readonly router: Router
  ) {
  }

  public examNotAssigned: boolean;
  public hangTimer: boolean;
  public questions = {
    intro: '',
    aid: '',
    time: 0,
    questions: []
  };
  public isLoading: boolean;
  public answer = {};
  public showQuestions: boolean;


  title = 'exam';

  ngOnInit() {
    this.getAllQuestions();
  }

  public onAnswer(questionID, optionID) {
    this.answer[questionID] = optionID;
  }

  public getAllQuestions() {
    this.isLoading = true;
    this.questionAnswerService.getAllQuestions().subscribe(
      {
        next: (data) => {
          if (data.error) {
            this.sessionService.revokeAuthentication();
            this.router.navigate(['/login']);
            this.showTokenError();
            return;
          }
          if (data.data.error) {
            this.examNotAssigned = true;
          } else {
            this.examNotAssigned = false;
          }
          this.questions = data.data;
          this.isLoading = false;
        }
      }
    );
  }

  private showTokenError() {
    this.toastNotificationService.showToast({
      content: 'Invalid token. Please try logging in again.',
      type: ToastType.ERROR,
      duration: 5000
    });
  }

  public submitUserAnswer() {
    this.isLoading = true;
    this.questionAnswerService.submitAnswer(this.answer).subscribe(
      {
        next: (data) => {
          if (data.error) {
            this.sessionService.revokeAuthentication();
            this.router.navigate(['/login']);
            this.showTokenError();
            return;
          }
          this.questions = data.data;
          this.isLoading = false;
          this.toastNotificationService.showToast({
            content: 'Your answer has been received.',
            type: ToastType.SUCCESS,
            duration: 20000
          });
          this.sessionService.revokeAuthentication();
          this.router.navigate(['/login']);
        }
      }
    );
  }

  public handleEvent(event) {
    if (event.action === 'start') {
      return;
    }
    if (event.action === 'done') {
      this.submitUserAnswer();
      return;
    }
    if (event.action.left === 60000) {
      this.toastNotificationService.showToast({
        content: 'Hurry up! Only one minute left!',
        type: ToastType.ALERT,
        duration: 20000
      });
    }
    if (event.action !== 'start') {
      this.toastNotificationService.showToast({
        content: 'You are on half way mark.',
        type: ToastType.ALERT,
        duration: 20000
      });
    }
  }

  public startTest() {
    this.questionAnswerService.markTestAsStarted(this.questions.aid).subscribe({
      next: () => {
        this.showQuestions = true;
      }
    });
  }

  // @HostListener('scroll', ['$event']) // for scroll events of the current element
  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    if (event.srcElement.scrollingElement.scrollTop >= 63) {
      this.hangTimer = true;
    } else {
      this.hangTimer = false;
    }
  }
}
