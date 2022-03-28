import {Component, Input, OnInit} from '@angular/core';
import {Question} from '../../models/question.model';
import {Router} from '@angular/router';
import {Quiz} from '../../models/quiz.model';
import {QuizService} from '../../services/quiz.service';

@Component({
  selector: 'app-quiz-page',
  templateUrl: './quiz-page.component.html',
  styleUrls: ['./quiz-page.component.scss']
})
export class QuizPageComponent implements OnInit {

  quiz: Quiz;


  constructor(private router: Router, public quizService: QuizService) {
    this.quizService.quizSelected$.subscribe((quiz: Quiz) => {
      this.quiz = quiz;
    });
  }

  ngOnInit(): void {
    console.log(this.quiz);
  }

}
