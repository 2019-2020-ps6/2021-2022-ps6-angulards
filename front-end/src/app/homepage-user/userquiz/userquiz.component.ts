import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Quiz} from '../../../models/quiz.model';
import {Router} from '@angular/router';
import {QuizService} from "../../../services/quiz.service";

@Component({
  selector: 'app-userquiz',
  templateUrl: './userquiz.component.html',
  styleUrls: ['./userquiz.component.scss']
})
export class UserQuizComponent implements OnInit {
  userId: string;
  public quizList: Quiz[] = [];

  /**
   * Input here could be undefined, if the parent component doesn't give any userquiz.
   * If you remove `undefined`, you will have an error saying:
   * "Property 'userquiz' has no initializer and is not definitely assigned in the constructor."
   * We can also defined the initial value of the userquiz in the constructor.
   */
  @Input()
  quiz: Quiz | undefined;

  @Output()
  quizPlayed: EventEmitter<Quiz> = new EventEmitter<Quiz>();


  constructor(private router: Router, public quizService: QuizService) {
    this.userId = localStorage.getItem('application-user');

    this.quizService.quizzes$.subscribe((quizList) => {
      this.quizList = quizList;
    });
  }

  ngOnInit(): void {
  }

  playQuiz(): void {
    this.quizPlayed.emit(this.quiz);
  }

  redirectToQuiz(url: string): void {
    console.log(url + ' test url');
    this.router.navigateByUrl(url).then();
  }
  quizPlay(quiz: Quiz): void {
    this.router.navigate(['/stat/' + quiz.id]).then();
  }

}
