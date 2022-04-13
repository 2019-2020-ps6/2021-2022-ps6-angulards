// @ts-ignore

import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {any} from 'codelyzer/util/function';
import {Question} from '../../models/question.model';
import {Response} from '../../models/response.model';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.html',
  styleUrls: ['./statistic.css']
})
// tslint:disable-next-line:component-class-suffix
export class Statistic implements OnInit {

  userId: string;

  response: Response;


  ngOnInit(): void {
  }

  constructor(private router: Router, private http: HttpClient) {
    this.userId = localStorage.getItem('application-user');
    this.getNumberWrongAnswer();
  }

  getNumberWrongAnswer(): void {
    /*
    this.question = this.http.get<Question>('http://localhost:9428/api/quizzes/' + this.quizId + '/questions/' + this.questionId)
      .subscribe(res => {});
      */

    this.http.get<Response>('http://localhost:9428/api/users/response')
      .subscribe(res => {
        console.log('liste de reponse : ', res);
        this.response = res;
      });

  }
}
