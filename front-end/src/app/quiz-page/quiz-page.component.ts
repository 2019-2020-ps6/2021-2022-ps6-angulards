import {Component, OnInit} from '@angular/core';
import {Answer, Question} from '../../models/question.model';
import {GameSession} from '../../models/gamesession.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Quiz} from '../../models/quiz.model';
import {QuizService} from '../../services/quiz.service';


@Component({
  selector: 'app-quiz-page',
  templateUrl: './quiz-page.component.html',
  styleUrls: ['./quiz-page.component.scss']
})
export class QuizPageComponent implements OnInit {

  // enum answer state
  public DISPLAY_RIGHT_ANSWER = 2;
  public DISPLAY_WRONG_ANSWER = 1;
  public DISPLAY_NO_ANSWER = 0;
  endForScore: boolean;
  quiz: Quiz;
  question: Question;
  answer: Answer;
  elo = 0;
  indexQuiz = 0;
  selectedAnswer = new Map();
  id: string;
  displayResult = this.DISPLAY_NO_ANSWER;
  filteredAnswers: Answer[];
  scoreGame = 0;

  wrongAnswerScore = new Map<string, number>();

  constructor(private route: ActivatedRoute, public quizService: QuizService, private router: Router) {
    this.quizService.quizSelected$.subscribe((quiz: Quiz) => {
      this.quiz = quiz;
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.quizService.setSelectedQuiz(this.id);
    this.endForScore = false;

  }

  /**
   * return the number of questions in the quiz
   * used for isEnd calculation
   */
  getQuestionsLength(): number {
    return this.quiz.questions.length - 1;
  }


  /**
   * ### DIFFICULTY ONE ###
   * Remove a wrong answer
   * Check if answer is correct
   * Don't remove if there is not enough wrong answers
   * @param answer answer to remove
   * @param miniWrongAnswer minimum wrong answer to keep
   */
  private removeWrongAnswer(answer: Answer, miniWrongAnswer: number): void {
    if (answer.isCorrect) {
      return;
    }
    this.answer = answer;

    const wrongs = this.getWrongAnswer();
    if (wrongs.length > miniWrongAnswer) {
      const idToDelete = this.quiz.questions[this.indexQuiz].answers.indexOf(answer);
      delete this.quiz.questions[this.indexQuiz].answers[idToDelete];
    } else {
      console.log('nb wrong answer ', wrongs.length);
      console.log('nb mini wrong answer ', miniWrongAnswer);
    }
  }

  /**
   * ### DIFFICULTY 2 ###
   * @param answer answer to remove
   */
  private removeWrongAnswerElo(answer): void {
    console.log('elo: ', this.elo);
    if (this.elo < 0) {
      // si une rep correct
      // min reponse : 4
      // max reponse : inf
      this.removeWrongAnswer(answer, 3);
    }
    if (this.elo >= 0) { //  && this.elo < 3
      // si une rep correct
      // min reponse : 6
      // max reponse : inf
      this.removeWrongAnswer(answer, 5);
    }
  }

  /**
   * Get correct answers of the current question
   * return: Array of correct answer(s)
   */
  private getCorrectAnswer(): Array<Answer> {
    // this.quiz.questions[this.indexQuiz].answers.forEach((value, index) => console.log(value));
    return this.quiz.questions[this.indexQuiz].answers.filter(x => x.isCorrect);
  }

  /**
   * Get wrong answers of the current question
   * return: Array of wrong answer(s)
   */
  private getWrongAnswer(): Array<Answer> {
    return this.quiz.questions[this.indexQuiz].answers.filter(x => !x.isCorrect);
  }

  /**
   * do action depending on the click
   *
   * correct answer -> incrementing elo to improve difficulty
   * wrong answer -> decrementing elo and calling method depending on the theme
   *
   * @param answer answer clicked by the user
   */
  takeActionOnClick(answer): void {
    console.log('clicked on = ' + answer.value);
    const corrects = this.getCorrectAnswer();
    corrects.forEach(x => console.log(x.value));

    if (corrects.includes(answer)) {
      this.elo++;
      this.displayResult = this.DISPLAY_RIGHT_ANSWER;
      this.scoreGame++;
      console.log('Score game : ' + this.scoreGame);
    } else {
      this.elo--;
      this.displayResult = this.DISPLAY_WRONG_ANSWER;
      console.log('theme :', this.quiz.theme);
      if (this.quiz.theme === 'A') {
        this.removeWrongAnswerElo(answer);
      } else {
        // par défaut on enlève les réponses fausses
        this.removeWrongAnswer(answer, 0);
      }
    }
    this.selectedAnswer.set(this.indexQuiz, answer);

    this.manageQuestionScore(answer);
  }

  /**
   * Increment the number of wrong answer for a specific user
   */
  manageQuestionScore(answer): void{
    const corrects = this.getCorrectAnswer();
    corrects.forEach(x => console.log(x.value));

    if (!corrects.includes(answer)) {

      const userId = localStorage.getItem('application-user');

      if (!this.wrongAnswerScore.has(userId)) {
        this.wrongAnswerScore.set(userId, 0);
      }
      this.wrongAnswerScore.set(userId, this.wrongAnswerScore.get(userId) + 1);

    }

  }

  nextQuestion(): void{

    this.indexQuiz = this.indexQuiz + 1;
    const userId = localStorage.getItem('application-user');
    this.quizService.addResponseScore(this.quiz.id, this.quiz.questions[this.indexQuiz].id, userId, this.wrongAnswerScore.get(userId) );
  }


  /**
   * First page of the quiz
   */
  isStart(): boolean {
    return this.indexQuiz < 1;
  }

  /**
   * Last page of the quiz
   */
  isEnd(): boolean {
    return this.indexQuiz >= this.getQuestionsLength();
  }

  /**
   * At the end of the quiz, used to display score
   */
  finished(): void {
    console.log((this.scoreGame) / (this.getQuestionsLength() + 1));
    console.log('Nombre qst total : ' + this.getQuestionsLength() + 1);
    this.endForScore = true;
  }

  navigateToQuizPage(): void {
    this.router.navigate(['userquiz']).then();
  }

  isVideo(): boolean {
    return this.quiz.questions[this.indexQuiz].image.includes('youtu');

  }

}
