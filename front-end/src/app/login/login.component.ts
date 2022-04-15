import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {any} from 'codelyzer/util/function';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  constructor(private router: Router, private formBuilder: FormBuilder, private http: HttpClient) {
  }



  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      firstName: [''],
      password: ['']

    });

  }

  redirectHome(): void {
    this.router.navigateByUrl('/userquiz').then();
  }

  login(): void {
    let userName: number;
    let userStatCode: number;
    this.http.get<any>('http://localhost:9428/api/users')
      .subscribe(res => {
        const user = res.find((a: any) => {
          userName = a.id;
          userStatCode = a.statcode;
          return a.firstName === this.loginForm.value.firstName && a.password === this.loginForm.value.password;

        });
        if (user){
          this.loginForm.reset();
          this.router.navigate(['userquiz']);
          this.storeName(userName);
          this.storeStatCode(userStatCode);
        }else {
          alert('User Not Found');
        }
      },
      err => {
        alert('Erreur de connextion');
      });


  }

  // tslint:disable-next-line:typedef
  private storeName(userId: any) {
    localStorage.setItem('application-user', userId);
  }

  // tslint:disable-next-line:typedef
  private storeStatCode(userStatCode: any) {
    localStorage.setItem('user-statCode', userStatCode);
  }

}
