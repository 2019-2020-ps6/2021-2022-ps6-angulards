import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-registerpage',
  templateUrl: './registerpage.html',
  styleUrls: ['./registerpage.css']
})
export class RegisterComponent implements OnInit{
  public signupForm !: FormGroup;
  constructor(private router: Router, private formBuilder: FormBuilder, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      fullname: [''],
      email: [''],
      password: [''],
      statcode: ['']
    });
  }
  // tslint:disable-next-line:typedef
  signUp(){
    this.http.post<any>('http://localhost:8000/signUpUsers', this.signupForm.value)
      .subscribe(res => {
        this.signupForm.reset();
        this.router.navigate(['login']);
      }, err => {
        alert('Failure');
      });

  }

  redirectLogin(): void {
    this.router.navigateByUrl('/login').then();
  }


}
