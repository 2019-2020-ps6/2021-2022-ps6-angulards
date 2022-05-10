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
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})

export class StatisticComponent implements OnInit {

  userId: string;
  user: User;

  responses;

  quizId: string;
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

    this.userId = localStorage.getItem('application-user');
    this.getUserById();

    this.quizId = this.route.snapshot.paramMap.get('id');
    this.quizService.getQuizById(this.quizId);

    this.getNumberWrongAnswer();
    this.getResponsesOfUser();

    this.userService.user$.subscribe((user) => {
      this.user = user;
    });

    this.quizService.quiz$.subscribe((quiz) => {
      this.quiz = quiz;
      this.getResponsesOfUserPerQuestion();
    });

    this.statService.responses$.subscribe((responses) => {
      this.responses = responses;
    });
    this.statService.responsesOfUser$.subscribe((responsesOfUser) => {
      this.responseOfUser = responsesOfUser;
      this.getAveragesStat();
    });
    this.statService.responsesOfUserPerQuestion$.subscribe((responsesOfUserPerQuestion) => {
      this.responseOfUserPerQuestion = responsesOfUserPerQuestion;
      this.allTriesPerQuestionStatistics();
    });

    this.showDetail = false;

    this.averageWrongAnswers = 0;
    this.averageRightAnswers = 0;
  }

  showDetails(): void{
    this.showDetail = !this.showDetail;
  }

  getUserById(): void{
    this.userService.getUserById();
  }

  getNumberWrongAnswer(): void{
    this.statService.getNumberWrongAnswer();
  }

  getResponsesOfUser(): void {
    this.statService.getResponsesOfUser(this.quizId, this.userId);
  }

  getAveragesStat(): void{
    let i;
    console.log('response of user ', this.responseOfUser);
    for (i = 0; i < this.responseOfUser.length ; i++) {
      if (this.responseOfUser[i].isQuestionAnswered) {
        if (this.responseOfUser[i].wrongAnswerCount === 0) {
          this.averageRightAnswers++;
        } else {
          this.averageWrongAnswers += this.responseOfUser[i].wrongAnswerCount;
        }
      }
    }

    this.averageRightAnswers =  (this.averageRightAnswers / this.responseOfUser.length ) * 100;
    this.averageWrongAnswers = (this.averageWrongAnswers / this.responseOfUser.length );
  }

  getResponsesOfUserPerQuestion(): void {
    this.statService.getResponsesOfUserPerQuestion(this.quiz, this.quizId, this.userId);
  }

  allTriesPerQuestionStatistics(): void{
    
    let i;
    for (i = 0; i < this.responseOfUserPerQuestion.length ; i++) {
      if (this.responseOfUserPerQuestion[i].isQuestionAnswered) {
        if (!this.allTriesPerQuestionCount.has(this.responseOfUserPerQuestion[i].questionId)) {
          this.allTriesRightAnswerPerQuestionCount.set(this.responseOfUserPerQuestion[i].questionId, 0);
          this.allTriesPerQuestionCount.set(this.responseOfUserPerQuestion[i].questionId, 0);
        }
        this.allTriesPerQuestionCount.set(this.responseOfUserPerQuestion[i].questionId, this.allTriesPerQuestionCount.get(this.responseOfUserPerQuestion[i].questionId) + 1);
        if (this.responseOfUserPerQuestion[i].wrongAnswerCount === 0) {
          this.allTriesRightAnswerPerQuestionCount.set(this.responseOfUserPerQuestion[i].questionId, this.allTriesRightAnswerPerQuestionCount.get(this.responseOfUserPerQuestion[i].questionId) + 1);
        }
      }
    }



  }
}
