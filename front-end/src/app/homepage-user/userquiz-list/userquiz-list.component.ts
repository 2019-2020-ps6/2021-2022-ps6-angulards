import {Component, OnInit} from '@angular/core';
import {QuizService} from '../../../services/quiz.service';
import {Quiz} from '../../../models/quiz.model';
import {Router} from '@angular/router';


@Component({
  selector: 'app-userquiz-list',
  templateUrl: './userquiz-list.component.html',
  styleUrls: ['./userquiz-list.component.scss']
})
export class UserQuizListComponent implements OnInit {

  public quizList: Quiz[] = [];

  constructor(private router: Router, public quizService: QuizService) {
    this.quizService.quizzes$.subscribe((quizList) => {
      this.quizList = quizList;
    });
  }

  ngOnInit(): void {
  }

  quizPlay(quiz: Quiz): void {
    this.router.navigate(['/quizzes/' + quiz.id]).then();
  }

  // tslint:disable-next-line:typedef
  goToStatPage(){
    this.router.navigate(['stat']).then();
  }
}
