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

  public DISPLAY_RIGHT_ANSWER = 2;
  public DISPLAY_WRONG_ANSWER = 1;
  public DISPLAY_NO_ANSWER = 0;
  quiz: Quiz;
  question: Question;
  answer: Answer;
  elo = 0;
  indexQuiz = 0;
  selectedAnswer = new Map();
  id: string;
  displayResult = this.DISPLAY_NO_ANSWER;
  filteredAnswers: Answer[];

  constructor(private route: ActivatedRoute, public quizService: QuizService) {
    this.quizService.quizSelected$.subscribe((quiz: Quiz) => {
      this.quiz = quiz;
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.quizService.setSelectedQuiz(this.id);
  }

  getQuestionsLength(): number {
    return this.quiz.questions.length - 1;
  }


  removeWrongAnswer(answer: Answer): void {
    this.answer = answer;
    console.log('remove wrong answer: ' + this.answer.value);
    const idToDelete = this.quiz.questions[this.indexQuiz].answers.indexOf(answer);
    delete this.quiz.questions[this.indexQuiz].answers[idToDelete];
  }

  getCorrectAnswer(): Answer {
    // this.quiz.questions[this.indexQuiz].answers.forEach((value, index) => console.log(value));
    return this.quiz.questions[this.indexQuiz].answers.find(x => x.isCorrect);
  }

  takeActionOnClick(answer): void {
    const correct = this.getCorrectAnswer();
    console.log('correct = ' + correct.value);
    if (correct.value === answer.value) {
      this.elo++;
      this.displayResult = this.DISPLAY_RIGHT_ANSWER;
    } else {
      this.elo--;
      this.displayResult = this.DISPLAY_WRONG_ANSWER;
      if (!answer.isCorrect) { this.removeWrongAnswer(answer); }
    }
    this.selectedAnswer.set(this.indexQuiz, answer);
  }

  isStart(): boolean {
    return this.indexQuiz < 1;
  }

  isEnd(): boolean {
    return this.indexQuiz >= this.getQuestionsLength();
  }

  finished(): void {
    // on finish
    console.log('End screen here');
  }
}
