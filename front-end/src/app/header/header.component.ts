import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {User} from '../../models/user.model';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {QuizService} from '../../services/quiz.service';
import {Quiz} from '../../models/quiz.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
   showStatcCodeInput = false ;
   userId: string;
   private code: string;
   public statCodeForm!: FormGroup;
   public quizList: Quiz[] = [];
   isUserAdmin: boolean;


  // tslint:disable-next-line:max-line-length
  constructor(private http: HttpClient, public location: Location, public quizService: QuizService, private router: Router, private formBuilder: FormBuilder) {
    console.log(this.location.path());
    this.getUserById();

    this.quizService.quizzes$.subscribe((quizList) => {
       this.quizList = quizList;
     });
  }

  ngOnInit(): void {
     this.statCodeForm = this.formBuilder.group({
       statCode: [''],
     });
  }



  // tslint:disable-next-line:typedef
  LogOut() {
    localStorage.clear();
    this.router.navigate(['/welcomepage']).then();
  }

  EnterStatCode(): void{
    // this.router.navigate(['stat']).then();
    this.showStatcCodeInput = !this.showStatcCodeInput;
  }

  loginToStat(): void {
      this.userId = localStorage.getItem('application-user');
      const urlWithId = 'http://localhost:9428/api/users/' + this.userId;
      this.http.get<User>(urlWithId)
       .subscribe(res => {
         this.checkAccessStat(res.statcode);
       });


  }

  checkAccessStat(code: string): void{
    if (code === this.statCodeForm.value.statCode){
      this.statCodeForm.reset();
      this.showStatcCodeInput = !this.showStatcCodeInput;
      this.router.navigate(['stat']).then();
    }else {
      const header = document.querySelector('h3');
      header.innerText = 'Code incorrect, veuillez r??ssayer';
    }
  }

  getUserById(): void{
      const urlWithId = 'http://localhost:9428/api/users/' + this.userId;

      this.http.get<User>(urlWithId)
        .subscribe(res => {
          this.isCurrentUserAdmin(res.admin);
        });
  }

  isCurrentUserAdmin(userAdmin: boolean): void{
    this.isUserAdmin = userAdmin;
    console.log(this.isUserAdmin);
  }
}
