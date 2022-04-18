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
    this.quizService.setSelectedQuiz(quiz.id);
    this.router.navigate(['/quizzes/' + quiz.id]).then();
  }

  editQuiz(quiz: Quiz): void {
    this.router.navigate(['/edit-quiz/' + quiz.id]).then();
  }

  deleteQuiz(quiz: Quiz): void {
    this.quizToDelete = quiz;
    this.quizService.deleteQuiz(this.quizToDelete);
  }

  // tslint:disable-next-line:typedef
  redirectToQuizForm(){
    this.router.navigateByUrl('/quiz-form').then();
  }

  LogOut() {
    localStorage.clear();
    this.router.navigate(['/welcomepage']).then();
  }
}
