import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.html',
  styleUrls: ['./statistic.css']
})
// tslint:disable-next-line:component-class-suffix
export class Statistic implements OnInit {
  ngOnInit(): void {
  }

  constructor(private router: Router) {
  }

}
