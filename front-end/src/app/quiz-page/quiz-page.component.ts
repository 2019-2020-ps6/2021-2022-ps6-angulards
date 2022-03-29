import {Component, OnInit} from '@angular/core';
import {Answer, Question} from '../../models/question.model';
import {ActivatedRoute} from '@angular/router';
import {Quiz} from '../../models/quiz.model';
import {QuizService} from '../../services/quiz.service';

@Component({
  selector: 'app-quiz-page',
  templateUrl: './quiz-page.component.html',
  styleUrls: ['./quiz-page.component.scss']
})
export class QuizPageComponent implements OnInit {

  quiz: Quiz;
  question: Question;
  answer: Answer;
  correctAnswer = 0;
  indexQuiz = 0;
  selectedAnswer = new Map();
  id: string;
  resultAffiche = false;

  constructor(private route: ActivatedRoute, public quizService: QuizService) {
    this.quizService.quizSelected$.subscribe((quiz: Quiz) => {
      this.quiz = quiz;
    });
  }

  ngOnInit(): void {
    console.log(this.question);
    this.id = this.route.snapshot.paramMap.get('id');
    this.quizService.setSelectedQuiz(this.id);
  }

  getCorrectAnswer(): Answer {
    for (let i = 0; i < this.question.answers.length; i++) {
      if (this.quiz.questions[this.indexQuiz].answers[i].isCorrect) {
        return this.quiz.questions[this.indexQuiz].answers[i];
      }
    }
  }

  incrementCorrect(answer): void {
    const correct = this.getCorrectAnswer().value;
    if (correct === answer) {
      this.correctAnswer++;
    }
    this.resultAffiche = true;
    this.selectedAnswer.set(this.indexQuiz, answer);
  }

  isStart(): boolean {
    return this.indexQuiz < 1;
  }

  isEnd(): boolean {
    return this.indexQuiz >= this.quiz.questions.length - 1;
  }
}
