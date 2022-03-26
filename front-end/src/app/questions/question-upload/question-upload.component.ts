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


  constructor(public quizService: QuizService) {
  }

  onFileSelected(event) {
    const file:File = event.target.files[0];
    
    if (file) {
      const imageId = uuid.v4().toString();
      let fileExtension:string = file.name.split('?')[0].split('.').pop();

      console.log(imageId)
      console.log(fileExtension)

      const formData = new FormData();

      formData.append('file', file, imageId + "." + fileExtension);

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
