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

  question: Question[];
  response: Response[];
  // change users in url to get it from quizzes
  responseURL = 'http://localhost:9428/api/users/response';

  ngOnInit(): void {
  }

  constructor(private router: Router, private http: HttpClient) {
    this.userId = localStorage.getItem('application-user');
    this.getNumberWrongAnswer();
    //this.getQuestionsById();
  }

  getNumberWrongAnswer(): void {

    this.http.get<Response[]>(this.responseURL)
      .subscribe(res => {
        console.log('liste de reponse : ', res);
        this.response = res;
      });

  }

  /*getQuestionsById(): void {
    console.log('quizId : ', this.response[0].quizId);
    this.http.get<Question[]>('http://localhost:9428/api/quizzes/' + this.response[0].quizId + '/questions')
      .subscribe(res => {
        console.log('liste de reponse : ', res);
        this.question = res;
      });
  }*/





}
