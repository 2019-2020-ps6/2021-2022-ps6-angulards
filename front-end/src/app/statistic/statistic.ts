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
  statistic: number;
  userId: string;
  questionId: string;
  quizId: string;

  question: Question;
  response: Response;


  ngOnInit(): void {
  }

  constructor(private router: Router, private http: HttpClient) {
    this.userId = localStorage.getItem('application-user');
    this.getNumberWrongAnswer();
  }

  getNumberWrongAnswer(): void {

    /*fetch('http://localhost:9428/api/users/response')
      .then(res => res.json())
      .then(data => console.log(data.userId));*/

    // change the request demande from users to quizzes
   /* this.http.get<any>('http://localhost:9428/api/users/response')
      .subscribe(res => {
        const stat = res.find((a: any) => {

            if (this.userId === a.userId) {
              return a.wrongAnswerCount;
            }

          },
          err => {
            alert('Error');
          });
        console.log('stat ', stat, this.statistic);
        this.statistic = stat.wrongAnswerCount;
        this.questionId = stat.questionId;
        this.quizId = stat.quizId;
      });*/

    /*
    console.log(' qst id and quiz id : ', this.questionId, this.quizId);

    this.question = this.http.get<Question>('http://localhost:9428/api/quizzes/' + this.quizId + '/questions/' + this.questionId)
      .subscribe(res => {});*/

    this.http.get<Response>('http://localhost:9428/api/users/response')
      .subscribe(res => {
        console.log('liste de reponse : ', res);
        this.response = res;
      });

  }
}
