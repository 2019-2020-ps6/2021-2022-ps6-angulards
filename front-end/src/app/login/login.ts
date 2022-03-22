import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  redirectHome(): void {
    this.router.navigateByUrl('/userquiz');
  }

}
