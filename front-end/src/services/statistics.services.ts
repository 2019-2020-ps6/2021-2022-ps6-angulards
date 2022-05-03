import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from '../models/user.model';
import { serverUrl, httpOptionsBase } from '../configs/server.config';
import {UserMock} from '../mocks/user.mock';
import {Response} from '../models/response.model';
import {ResponseMock} from '../mocks/response.mock';
import {Quiz} from "../models/quiz.model";

@Injectable({
  providedIn: 'root'
})
export class StatisticsServices {


  private userUrl = serverUrl + '/users';

  responseURL = serverUrl + '/gamesession/response';

  private responses: Response[] = ResponseMock;

  public responses$: BehaviorSubject<Response> = new BehaviorSubject(this.responses[0]);

  public responsesOfUser$: BehaviorSubject<Response[]> = new BehaviorSubject(this.responses);

  public responsesOfUserPerQuestion$: BehaviorSubject<Response[]> = new BehaviorSubject(this.responses);


  constructor(private http: HttpClient) {

  }

  getNumberWrongAnswer(): void {

    this.http.get<Response>(this.responseURL)
      .subscribe(responses => {
        this.responses$.next(responses);
      });
  }

  getResponsesOfUser(quizId: string, userId: string): void {
    const urlWithId = this.responseURL + '/' + quizId + '/' + userId;

    this.http.get<Response[]>(urlWithId)
      .subscribe(responsesOfUser => {
        this.responsesOfUser$.next(responsesOfUser);
      });
  }

  getResponsesOfUserPerQuestion(quiz: Quiz, quizId: string, userId: string): void {
    quiz.questions.forEach(question => {
      const urlWithId = 'http://localhost:9428/api/gamesession/response/' + quizId + '/' + userId + '/' + question.id;

      this.http.get<Response[]>(urlWithId)
        .subscribe(responsesOfUserPerQuestion => {
          this.responsesOfUserPerQuestion$.next(responsesOfUserPerQuestion);
        });
    });

  }

}
