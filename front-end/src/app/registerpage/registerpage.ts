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
      password: [''],
      statcode: ['']
    });
  }
  // tslint:disable-next-line:typedef
  signUp(){
  }

  redirectLogin(): void {
  }


}
