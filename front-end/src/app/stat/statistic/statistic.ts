// @ts-ignore

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {any} from 'codelyzer/util/function';
import {Question} from '../../../models/question.model';
import {Response} from '../../../models/response.model';
import {Quiz} from '../../../models/quiz.model';
import {QuizService} from '../../../services/quiz.service';
import {User} from '../../../models/user.model';
import {UserService} from '../../../services/user.service';
import {StatisticsServices} from '../../../services/statistics.services';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.html',
  styleUrls: ['./statistic.css']
})

// tslint:disable-next-line:component-class-suffix
export class Statistic implements OnInit {

  userId: string;
  user: User;

  responses;
  responseURL = 'http://localhost:9428/api/gamesession/response';

  id: string;
  quiz: Quiz;

  averageWrongAnswers: number;
  averageRightAnswers: number;
  allTriesRightAnswerPerQuestionCount = new Map<string, number>();
  allTriesPerQuestionCount = new Map<string, number>();

  responseOfUser: Response[];
  responseOfUserPerQuestion: Response[];

  showDetail: boolean;

  ngOnInit(): void {

  }

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient,
              public quizService: QuizService,  public userService: UserService, public statService: StatisticsServices) {
    this.userService.getUserById();
    this.id = this.route.snapshot.paramMap.get('id');
    this.quizService.getQuizById(this.id);

    this.userService.user$.subscribe((user) => {
      this.user = user;
    });

    this.quizService.quiz$.subscribe((quiz) => {
      this.quiz = quiz;
      this.getResponsesOfUserPerQuestion();
    });

    this.userId = localStorage.getItem('application-user');
    this.showDetail = false;
    this.getNumberWrongAnswer();
    this.getResponsesOfUser();

    this.averageWrongAnswers = 0;
    this.averageRightAnswers = 0;
  }

  getUserById(): void{
    this.userService.getUserById();

  }


  showDetails(): void{
    this.showDetail = !this.showDetail;
  }

  getNumberWrongAnswer(): void {

    this.http.get<Response[]>(this.responseURL)
      .subscribe(res => {
        this.responses = res;
      });
  }

  getResponsesOfUser(): void {
    const urlWithId = 'http://localhost:9428/api/gamesession/response/' + this.id + '/' + this.userId;

    this.http.get<Response[]>(urlWithId)
      .subscribe(res => {
        this.responseOfUser = res;
        this.getAveragesStat();
      });
  }

  getAveragesStat(): void{
    let i;
    console.log('response of user ', this.responseOfUser);
    for (i = 0; i < this.responseOfUser.length ; i++){
      if (this.responseOfUser[i].wrongAnswerCount === 0){
        this.averageRightAnswers++;
      }
      else{
        this.averageWrongAnswers += this.responseOfUser[i].wrongAnswerCount;
      }
    }

    this.averageRightAnswers =  (this.averageRightAnswers / this.responseOfUser.length ) * 100;
    this.averageWrongAnswers = (this.averageWrongAnswers / this.responseOfUser.length );
  }

  getResponsesOfUserPerQuestion(): void {
    console.log('quiz in function', this.quiz);
    this.quiz.questions.forEach(question => {
      const urlWithId = 'http://localhost:9428/api/gamesession/response/' + this.id + '/' + this.userId + '/' + question.id;

      this.http.get<Response[]>(urlWithId)
        .subscribe(res => {
          this.responseOfUserPerQuestion = res;
          this.allTriesPerQuestionStatistics();
        });
    });

  }

  allTriesPerQuestionStatistics(): void{
    this.responseOfUserPerQuestion.forEach(res => {
      if (!this.allTriesPerQuestionCount.has(res.questionId)) {
        this.allTriesRightAnswerPerQuestionCount.set(res.questionId, 0);
        this.allTriesPerQuestionCount.set(res.questionId, 0);
      }
      this.allTriesPerQuestionCount.set(res.questionId, this.allTriesPerQuestionCount.get(res.questionId) + 1);
      if (res.wrongAnswerCount === 0) {
        this.allTriesRightAnswerPerQuestionCount.set(res.questionId, this.allTriesRightAnswerPerQuestionCount.get(res.questionId) + 1);
      }
    });
  }
}
