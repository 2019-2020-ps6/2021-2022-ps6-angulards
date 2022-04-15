import {Component, OnInit} from '@angular/core';
import {QuizService} from '../../../services/quiz.service';
import {Quiz} from '../../../models/quiz.model';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-userquiz-list',
  templateUrl: './userquiz-list.component.html',
  styleUrls: ['./userquiz-list.component.scss']
})
export class UserQuizListComponent implements OnInit {
  userId: string;
  showStatcCodeInput = false ;

  public quizList: Quiz[] = [];

  public statCodeForm!: FormGroup;

  constructor(private router: Router, public quizService: QuizService, private http: HttpClient,  private formBuilder: FormBuilder) {
    this.userId = localStorage.getItem('application-user');

    this.quizService.quizzes$.subscribe((quizList) => {
      this.quizList = quizList;
    });
  }

  ngOnInit(): void {
    this.statCodeForm = this.formBuilder.group({
      statCode: [''],
    });
  }

  quizPlay(quiz: Quiz): void {
    this.router.navigate(['/quizzes/' + quiz.id]).then();
  }

  // tslint:disable-next-line:typedef
  EnterStatCode(){
    // this.router.navigate(['stat']).then();
    this.showStatcCodeInput = true;
  }

  loginToStat(): void {
    const urlWithId = 'http://localhost:9428/api/users/' + this.userId;
    this.http.get<any>(urlWithId)
      .subscribe(res => {
          console.log('user : ' + res);
          const RightStatCode = res.find((a: any) => {
          console.log('user code : ' + a.statcode);
          return a.statcode === this.statCodeForm.value.statCode;
          });
          if (RightStatCode){
            this.statCodeForm.reset();
            this.showStatcCodeInput = false;
            this.router.navigate(['stat']).then();
          }else {
            alert('Wrong Statistic Code, please retry');
          }
        },
        err => {
          alert('Erreur de connextion');
        });


  }

}
