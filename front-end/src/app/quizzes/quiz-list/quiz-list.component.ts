import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {QuizService} from '../../../services/quiz.service';
import {Quiz} from '../../../models/quiz.model';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit {

  public quizList: Quiz[] = [];

  quizToDelete: Quiz;

  constructor(private router: Router, public quizService: QuizService) {
    this.quizService.quizzes$.subscribe((quizzes: Quiz[]) => {
      this.quizList = quizzes;
    });
  }

  ngOnInit(): void {
  }

  playQuiz(quiz: Quiz): void {
    this.router.navigate(['/quizzes/' + quiz.name]).then();
  }

  editQuiz(quiz: Quiz): void {
    this.router.navigate(['/edit-quiz/' + quiz.name]).then();
  }

  deleteQuiz(quiz: Quiz): void {
    this.quizToDelete = quiz;
  }
}
