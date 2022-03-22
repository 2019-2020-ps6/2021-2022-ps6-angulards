import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Quiz} from '../../../models/quiz.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-userquiz',
  templateUrl: './userquiz.component.html',
  styleUrls: ['./userquiz.component.scss']
})
export class UserQuizComponent implements OnInit {

  /**
   * Input here could be undefined, if the parent component doesn't give any userquiz.
   * If you remove `undefined`, you will have an error saying:
   * "Property 'userquiz' has no initializer and is not definitely assigned in the constructor."
   * We can also defined the initial value of the userquiz in the constructor.
   */
  @Input()
  quiz: Quiz | undefined;

  @Output()
  quizSelected: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(private router: Router) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
  }

  selectQuiz(): void {
    console.log('clicked');
    this.quizSelected.emit(true); // va renvoyer l'information au parent
  }

  redirectToQuiz(url: string): void {
    console.log(url + ' test url');
    this.router.navigateByUrl(url);
  }
}
