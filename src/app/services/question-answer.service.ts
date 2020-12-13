import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from './environment.service';

@Injectable()
export class QuestionAnswerService {

  constructor(
    private readonly http: HttpClient,
    private readonly environmentService: EnvironmentService
  ) {
  }

  public getAllQuestions(): Observable<any> {
    return this.http.get<any>(`${this.environmentService.getUrl()}?action=getQuestions`);
  }

  public submitAnswer(answers): Observable<any> {
    const body = new FormData();
    body.append('answers', JSON.stringify(answers));
    return this.http.post<any>(`${this.environmentService.getUrl()}?action=userAnswers`, body);
  }
  public markTestAsStarted(examID: string): Observable<any> {
    const body = new FormData();
    body.append('examID', JSON.stringify(examID));
    return this.http.post<any>(`${this.environmentService.getUrl()}?action=markTestAsStarted`, body);
  }
}
