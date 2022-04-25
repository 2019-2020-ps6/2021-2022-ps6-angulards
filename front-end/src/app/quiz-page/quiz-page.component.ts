import {Component, OnInit} from '@angular/core';
import {Answer, Question} from '../../models/question.model';
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
  DISPLAY_HINT = false;
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
  nextQuestionType = 'all'; // could be image or audio, image by default
  indexOfImageQuestion = [];
  indexOfAudioQuestion = [];
  lastAnswer = undefined;
  nbWrongAnswerPerQuestion = 0;
  nextQuestionElo = 0;
  // 0 -> 4 rep image
  // 1 -> 6 rep image
  // 2 -> 4 rep audio
  // 3 -> 6 rep audio
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
    if (this.quiz === undefined) {
      return 0;
    }
    return this.quiz.questions.length - 1;
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
    this.manageQuestionScore(answer);
    this.selectedAnswer.set(this.indexQuiz, answer);
  }

  /**
   * Increment the number of wrong answer for a specific user
   */
  manageQuestionScore(answer): void {
    const corrects = this.getCorrectAnswer();
    const userId = localStorage.getItem('application-user');
    if (!this.wrongAnswerScore.has(userId)) {
      this.wrongAnswerScore.set(userId, 0);
    }
    if (!corrects.includes(answer)) {
      this.wrongAnswerScore.set(userId, this.wrongAnswerScore.get(userId) + 1);
    }
  }

  /**
   * Next question with question type
   * TO DO: change data structure to make previous question working
   */
  nextQuestion(): void {
    const userId = localStorage.getItem('application-user');
    this.quizService.addResponseScore(this.quiz.id, this.quiz.questions[this.indexQuiz].id, userId, this.wrongAnswerScore.get(userId));
    this.wrongAnswerScore.set(userId, 0);
    if (this.isPicto()) {
      this.indexQuiz++;
      console.log('pictogram next question');
    }
    if (this.isExpression()) {
      this.nextQuestionType = 'all';
      this.nbWrongAnswerPerQuestion = 0;
      this.DISPLAY_HINT = false;
      this.indexQuiz++;
      console.log('expression next question');
    }
    if (this.isEmotion()) {
      this.changeNextQuestionElo();
      this.selectEloQuestion();
      this.selectImageOrAudioQuestion(); // then change question
      console.log('expresssion next question');
    }
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
    const lastImageQuestionIndex = Math.max.apply(null, this.indexOfImageQuestion);
    const lastAudioQuestionIndex = Math.max.apply(null, this.indexOfAudioQuestion);
    return ((this.nextQuestionType === 'image' && (lastImageQuestionIndex === this.indexQuiz))
      || (this.nextQuestionType === 'audio' && (lastAudioQuestionIndex === this.indexQuiz))
      || (this.indexQuiz === this.getQuestionsLength()));
  }

  /**
   * At the end of the quiz, used to display score
   */
  finished(): void {
    console.log((this.scoreGame) / (this.getQuestionsLength() + 1));
    this.endForScore = true;
  }

  navigateToQuizPage(): void {
    this.router.navigate(['userquiz']).then();
  }

  isVideo(): boolean {
    return this.quiz !== undefined
      && this.quiz.questions[this.indexQuiz].image != null
      && this.quiz.questions[this.indexQuiz].image.includes('youtu');
  }

  isImage(): boolean {
    return this.quiz !== undefined && this.quiz.questions[this.indexQuiz].image != null && !this.isVideo();
  }

  isAudio(): boolean {
    return this.quiz !== undefined && this.quiz.questions[this.indexQuiz].audio != null;
  }

  /**
   * Pick next question
   * Image or video depending on nextQuestionType variable
   * @private
   */
  private selectImageOrAudioQuestion(): void {
    let questionPicked = false;
    let newIndex = this.indexQuiz;
    do {
      if (this.quiz.questions[newIndex++] == null) {
        questionPicked = true;
      } else {
        if ((this.nextQuestionType === 'audio' && this.isAudioQuestion(newIndex))
          || this.nextQuestionType === 'image' && this.isImageQuestion(newIndex)) {
          questionPicked = true;
          this.indexQuiz = newIndex;
        }
      }
    } while (!questionPicked);
  }

  /**
   * ### DIFFICULTY 3 ###
   * change question difficulty depending on ELO
   * @private
   */
  private selectEloQuestion(): void {
    if (this.nextQuestionElo <= 1) {
      // next question 4 rep image
      this.nextQuestionType = 'image';
      console.log('niveau 1');
    } else if (this.nextQuestionElo <= 2) {
      // next question 6 rep image
      this.nextQuestionType = 'audio';
      console.log('niveau 2');
    } else if (this.nextQuestionElo <= 3) {
      // next question audio 4 rep
      this.nextQuestionType = 'audio';
      console.log('niveau 3');
    } else {
      // next question audio 6 rep
      this.nextQuestionType = 'audio';
      console.log('niveau 4');
    }
    // next question video or error
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
    if (this.getWrongAnswer().length > miniWrongAnswer) {
      const idToDelete = this.quiz.questions[this.indexQuiz].answers.indexOf(answer);
      delete this.quiz.questions[this.indexQuiz].answers[idToDelete];
    }
  }

  /**
   * ### DIFFICULTY NOT UNDERSTOOD ###
   * 4 answers, 6 answers, all answer depending on the elo
   * @param answer answer to remove
   */
  private removeWrongAnswerElo(answer): void {
    if (this.elo < 0) {
      this.removeWrongAnswer(answer, 3);
    } else if (this.elo >= 0 && this.elo < 3) {
      this.removeWrongAnswer(answer, 5);
    } else {
      this.removeWrongAnswer(answer, 16);
    }
  }

  /**
   * Get correct answers of the current question
   * return: Array of correct answer(s)
   */
  private getCorrectAnswer(): Array<Answer> {
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
   * When user click the right answer
   * Increment elo
   * Change display with DISPLAY_RIGHT_ANSWER field
   * increment score game for final result
   * @private
   */
  private onRightAnswer(): void {
    if (this.isPicto()) {
      this.elo++;
    }
    this.scoreGame++;
    this.displayResult = this.DISPLAY_RIGHT_ANSWER;
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
    if (this.isPicto()) {
      this.removeWrongAnswer(answer, 0);
      this.elo--;
      console.log('pictogram wrong answer');
      console.log('new elo : ' + this.elo);
    }
    if (this.isExpression()) {
      this.nbWrongAnswerPerQuestion++;
      this.DISPLAY_HINT = this.nbWrongAnswerPerQuestion >= 2;
      console.log('expression wrong answer');
    }
    if (this.isEmotion()) {
      this.lastAnswer = false;
      console.log('emotion wrong answer');
    }
    this.displayResult = this.DISPLAY_WRONG_ANSWER;
  }

  /**
   * change nextQuestionElo global variable
   * make sure elo is in the range [0 : 4]
   * @private
   */
  private changeNextQuestionElo(): void {
    this.nextQuestionElo -= 0.5;

    if (this.lastAnswer !== false) {
      this.nextQuestionElo += 1;
    }
    if (this.nextQuestionElo > 4) {
      this.nextQuestionElo = 4;
    }
    if (this.nextQuestionElo < 0.5) {
      this.nextQuestionElo = 0;
    }
    this.lastAnswer = undefined;
    console.log('elo next question ' + this.nextQuestionElo);
  }


  private isAudioQuestion(i): boolean {
    return this.quiz.questions[i] != null && this.quiz.questions[i].image == null && this.quiz.questions[i].audio != null;
  }

  private isImageQuestion(i): boolean {
    return this.quiz.questions[i] != null && this.quiz.questions[i].image != null && this.quiz.questions[i].audio == null;
  }

  private isEmotion(): boolean {
    return this.quiz.theme.toLocaleLowerCase().includes('motion');
  }

  private isPicto(): boolean {
    return this.quiz.theme.toLocaleLowerCase().startsWith('picto');
  }

  private isExpression(): boolean {
    return this.quiz.theme.toLocaleLowerCase().includes('express');
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

  private numberOfWrongAnswer(): number {
    return this.getWrongAnswer().length;
  }

}
