import {Component, Input, OnInit} from '@angular/core';
import { QuizService } from '../../../services/quiz.service';

import * as uuid from 'uuid';

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
  imageVisible = false;
  path: string;


  constructor(public quizService: QuizService) {
  }

  showImage(): string {
    this.imageVisible = true;
    return this.path;
  }

  onFileSelected(event): void {
    const file: File = event.target.files[0];

    if (file) {
      const imageId = uuid.v4().toString();
      const fileExtension: string = file.name.split('?')[0].split('.').pop();

      console.log(imageId);
      console.log(fileExtension);

      const formData = new FormData();

      formData.append('file', file, imageId + '.' + fileExtension);

      console.log(formData.get('file'));

      this.quizService.addImage(formData);
    }
}

  ngOnInit(): void {
    this.setType(this.IMAGE);
  }


  setType(param: string): void {
    this.uploadType = param;
  }
}
