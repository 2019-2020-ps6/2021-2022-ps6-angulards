import {Component, OnInit} from '@angular/core';
import {QuizService} from '../../../services/quiz.service';
import {Quiz} from '../../../models/quiz.model';

@Component({
  selector: 'app-userquiz-list',
  templateUrl: './userquiz-list.component.html',
  styleUrls: ['./userquiz-list.component.scss']
})
export class UserQuizListComponent implements OnInit {

  public quizList: Quiz[] = [];

  constructor(public quizService: QuizService) {
    this.quizService.quizzes$.subscribe((quizList) => {
      this.quizList = quizList;
    });
  }

  ngOnInit(): void {
  }

  quizSelected(selected: boolean): void {
    console.log('event received from child:', selected);
  }
}
