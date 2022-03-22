import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-question-upload',
  templateUrl: './question-upload.component.html',
  styleUrls: ['./question-upload.component.scss']
})
export class QuestionUploadComponent implements OnInit {


  @Input()
  uploadType: string;
  IMAGE = 'image';
  AUDIO = 'audio';

  constructor() {
  }

  ngOnInit(): void {
    this.setType(this.IMAGE);
  }


  setType(param: string): void {
    this.uploadType = param;
  }
}
