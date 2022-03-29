import {Component, OnInit} from '@angular/core';
import {Answer, Question} from '../../models/question.model';
import {ActivatedRoute} from '@angular/router';
import {Quiz} from '../../models/quiz.model';
import {QuizService} from '../../services/quiz.service';
import {NONE_TYPE} from '@angular/compiler';


@Component({
  selector: 'app-quiz-page',
  templateUrl: './quiz-page.component.html',
  styleUrls: ['./quiz-page.component.scss']
})
export class QuizPageComponent implements OnInit {

  constructor(private route: ActivatedRoute, public quizService: QuizService) {
    this.quizService.quizSelected$.subscribe((quiz: Quiz) => {
      this.quiz = quiz;
    });
  }

  public DISPLAY_RIGHT_ANSWER = 2;
  public DISPLAY_WRONG_ANSWER = 1;
  public DISPLAY_NO_ANSWER = 0;

  quiz: Quiz;
  question: Question;
  answer: Answer;
  correctAnswer = 0;
  indexQuiz = 0;
  selectedAnswer = new Map();
  id: string;
  displayResult = this.DISPLAY_NO_ANSWER;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.quizService.setSelectedQuiz(this.id);
  }

  getQuestionsLength(): number {
    return this.quiz.questions.length - 1;
  }

  getAnswersLength(): number {
    return this.quiz.questions[this.indexQuiz].answers.length;
  }

  getCorrectAnswer(): Answer {
    const nbAns = this.getAnswersLength();
    for (let i = 0; i < nbAns; i++) {
      if (this.quiz.questions[this.indexQuiz].answers[i].isCorrect) {
        return this.quiz.questions[this.indexQuiz].answers[i];
      }
    }
  }

  removeAnswer(): void {
    console.log('answer deleted : ');
    // tslint:disable-next-line:max-line-length
    console.log(this.quiz.questions[this.indexQuiz].answers.pop().isCorrect ? this.quiz.questions[this.indexQuiz].answers.pop().value : NONE_TYPE);
  }

  isAnswerCorrect(answer): void {
    const correct = this.getCorrectAnswer().value;
    if (correct === answer) {
      this.correctAnswer++;
      this.displayResult = this.DISPLAY_RIGHT_ANSWER;
    } else {
      this.displayResult = this.DISPLAY_WRONG_ANSWER;
      this.removeAnswer();
    }
    this.selectedAnswer.set(this.indexQuiz, answer);
  }

  isStart(): boolean {
    return this.indexQuiz < 1;
  }

  isEnd(): boolean {
    return this.indexQuiz >= this.getQuestionsLength();
  }
}
