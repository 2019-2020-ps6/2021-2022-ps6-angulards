// @ts-ignore

import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {any} from 'codelyzer/util/function';
import {Question} from '../../models/question.model';
import {Response} from '../../models/response.model';
import {Quiz} from '../../models/quiz.model';
import {QuizService} from '../../services/quiz.service';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.html',
  styleUrls: ['./statistic.css']
})

// tslint:disable-next-line:component-class-suffix
export class Statistic implements OnInit {

  userId: string;
  user: User;

  // question: Question[];
  response: Response[];
  // change users in url to get it from quizzes
  responseURL = 'http://localhost:9428/api/users/response';

  public quizList: Quiz[] = [];

  ngOnInit(): void {
  }

  constructor(private router: Router, private http: HttpClient, public quizService: QuizService) {
    this.userId = localStorage.getItem('application-user');
    this.getNumberWrongAnswer();
    this.getUserById();

    this.quizService.quizzes$.subscribe((quizzes: Quiz[]) => {
      this.quizList = quizzes;
    });
  }

  getNumberWrongAnswer(): void {

    this.http.get<Response[]>(this.responseURL)
      .subscribe(res => {
        console.log('liste de reponse : ', res);
        this.response = res;
      });
    console.log('responses ' , this.response);
  }

  getUserById(): void {
    const urlWithId = 'http://localhost:9428/api/users/' + this.userId;

    this.http.get<User>(urlWithId)
      .subscribe(res => {
        console.log('user : ', res);
        this.user = res;
      });
  }

  /*
  getQuestionsById(): void {
    console.log('quizId : ', this.response[0].quizId);
    const urlWithId = 'http://localhost:9428/api/quizzes/' + this.response[0].quizId + '/questions';

    this.http.get<Question[]>(urlWithId)
      .subscribe(res => {
        console.log('liste de reponse : ', res);
        this.question = res;
      });
  }*/





}
