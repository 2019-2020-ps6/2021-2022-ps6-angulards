import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-welcomepage',
  templateUrl: './welcomepage.html',
  styleUrls: ['./welcomepage.css']
})
export class WelcomePageComponent implements OnInit {
  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  redirectUserLogin(): void {
    this.router.navigateByUrl('/login');
  }


}
