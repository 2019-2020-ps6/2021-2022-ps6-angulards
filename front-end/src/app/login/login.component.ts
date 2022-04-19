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
      email: [''],
      password: ['']

    });

  }

  redirectHome(): void {
    this.router.navigateByUrl('/userquiz').then();
  }

  login(): void {
    let userName: number;
    this.http.get<any>('http://localhost:9428/api/users')
      .subscribe(res => {
        console.log('the response = ' + res + ' password is '  + this.loginForm.value.password);

        const user = Array.from(res).find((a: any) => {
          userName = a.id;
          return a.email === this.loginForm.value.email && a.password === this.loginForm.value.password;

        });
        if (user){
          this.loginForm.reset();
          this.router.navigate(['userquiz']);
          this.storeName(userName);
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

}
