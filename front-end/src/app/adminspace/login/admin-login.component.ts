import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {any} from 'codelyzer/util/function';
import {User} from '../../../models/user.model';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  public adminloginForm!: FormGroup;

  adminCod = 'admin123';

  constructor(private router: Router, private formBuilder: FormBuilder, private http: HttpClient) {
  }



  ngOnInit(): void {
    this.adminloginForm = this.formBuilder.group({
      email: [''],
      password: [''],
      adminCode: [''],

    });

  }

  login(): void {
    let userName: number;
    this.http.get<any>('http://localhost:9428/api/users')
      .subscribe(res => {
        const admin = Array.from(res).find((a: any) => {
          userName = a.id;
          return a.email === this.adminloginForm.value.firstName && a.password === this.adminloginForm.value.password
            && this.adminloginForm.value.adminCode === this.adminCod;

        });
        if (admin){
            this.adminloginForm.reset();
            this.router.navigate(['quiz-list']);
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
    localStorage.setItem('application-admin', userId);
  }

}
