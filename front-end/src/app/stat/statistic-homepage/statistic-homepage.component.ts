import {Component, OnInit} from '@angular/core';
import {QuizService} from '../../../services/quiz.service';
import {Quiz} from '../../../models/quiz.model';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup} from '@angular/forms';
import {User} from '../../../models/user.model';


@Component({
  selector: 'app-statistic-homepage',
  templateUrl: './statistic-homepage.component.html',
  styleUrls: ['./statistic-homepage.component.scss']
})

export class StatHomePage implements OnInit {
  userId: string;
  public quizList: Quiz[] = [];

  constructor(private router: Router, public quizService: QuizService, private http: HttpClient,  private formBuilder: FormBuilder) {
    this.userId = localStorage.getItem('application-user');

    this.quizService.quizzes$.subscribe((quizList) => {
      this.quizList = quizList;
    });
  }

  ngOnInit(): void {
  }

  quizPlay(quiz: Quiz): void {
    this.router.navigate(['/stat/' + quiz.id]).then();
  }

}
