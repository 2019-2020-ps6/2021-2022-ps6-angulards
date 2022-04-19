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
  scoreGame = 0;

  nextQuestionType = 'image'; // can be image or audio
  indexOfImageQuestion = [];
  indexOfAudioQuestion = [];


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
  public getQuestionsLength(): number {
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
    if (this.elo >= 0 && this.elo < 3) {
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
    const corrects = this.getCorrectAnswer();
    if (corrects.includes(answer)) {
      this.onRightAnswer();
    } else {
      this.onWrongAnswer(answer);
    }
    this.selectedAnswer.set(this.indexQuiz, answer);
    this.changeCurrentQuestionType();
    this.manageQuestionScore(answer);
  }

  /**
   * When user click the right answer
   * Increment elo
   * Change display with DISPLAY_RIGHT_ANSWER field
   * increment score game for final result
   * @private
   */
  private onRightAnswer(): void {
    this.elo++;
    this.displayResult = this.DISPLAY_RIGHT_ANSWER;
    this.scoreGame++;
    console.log('Score game : ' + this.scoreGame);
  }

  /**
   * When user click the wrong answer
   * Decrement elo, game score
   * Change display on html using display field
   * take action depending on the theme of the quiz
   * @param answer wrong answer to remove if necessary
   * @private
   */
  private onWrongAnswer(answer): void {
    this.elo--;
    this.displayResult = this.DISPLAY_WRONG_ANSWER;

    if (this.quiz.theme === 'picto' || this.quiz.theme === 'A') {
      this.removeWrongAnswerElo(answer);
    } else {
      this.removeWrongAnswer(answer, 0); // removing wrong answer till there is no more wrong answers available
    }
  }

  private changeCurrentQuestionType(): void {
    if (this.elo >= 0) {
      this.nextQuestionType = 'image';
    } else {
      this.nextQuestionType = 'audio';
    }
  }

  /**
   * Increment the number of wrong answer for a specific user
   */
  manageQuestionScore(answer): void {
    const corrects = this.getCorrectAnswer();
    if (!corrects.includes(answer)) {
      const userId = localStorage.getItem('application-user');
      if (!this.wrongAnswerScore.has(userId)) {
        this.wrongAnswerScore.set(userId, 0);
      }
      this.wrongAnswerScore.set(userId, this.wrongAnswerScore.get(userId) + 1);
    }
  }


  /**
   * Next question with question type
   * TO DO: change data structure to make previous question working

  nextQuestion(): void {
    console.log('elo : ' + this.elo);
    let questionPicked = false;
    let newIndex = this.indexQuiz;
    do {
      console.log('before matching ' + newIndex);
      if (this.quiz.questions[newIndex++].id == null) {
        questionPicked = true;
        console.log('matching end');
      } else {
        if ((this.nextQuestionType === 'audio' && this.isAudioQuestion(newIndex))
          || this.nextQuestionType === 'image' && this.isImageQuestion(newIndex)) {
          questionPicked = true;
          this.indexQuiz = newIndex;
          console.log('matching ' + newIndex);
        }
      }
    } while (!questionPicked);
    const userId = localStorage.getItem('application-user');
    this.quizService.addResponseScore(this.quiz.id, this.quiz.questions[this.indexQuiz].id, userId, this.wrongAnswerScore.get(userId));
  } */

  nextQuestion(): void {
    this.indexQuiz = this.indexQuiz + 1;
    const userId = localStorage.getItem('application-user');
    this.quizService.addResponseScore(this.quiz.id, this.quiz.questions[this.indexQuiz].id, userId, this.wrongAnswerScore.get(userId));
  }


  isAudioQuestion(i): boolean {
    return this.quiz.questions[i].image == null && this.quiz.questions[i].audio != null;
  }

  isImageQuestion(i): boolean {
    return this.quiz.questions[i].image != null && this.quiz.questions[i].audio == null;
  }


  /**
   * First page of the quiz
   */
  isStart(): boolean {
    if (this.indexQuiz === 0) {
      this.orderQuestionByType();
      return true;
    }
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

  isImage(): boolean {
    return this.quiz.questions[this.indexQuiz].image != null && !this.isVideo();
  }

  isAudio(): boolean {
    return this.quiz.questions[this.indexQuiz].audio != null;
  }

  /**
   * Store quiz index of questions by type
   * @private
   */
  private orderQuestionByType(): void {
    for (let i = 0; i <= this.getQuestionsLength(); i++) {
      if (this.isImageQuestion(i)) {
        this.indexOfImageQuestion.push(i);
      }
      if (this.isAudioQuestion(i)) {
        this.indexOfAudioQuestion.push(i);
      }
    }
  }
}
