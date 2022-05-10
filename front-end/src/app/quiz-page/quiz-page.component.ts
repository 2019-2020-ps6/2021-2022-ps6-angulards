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
  public readonly DISPLAY_RIGHT_ANSWER = 2;
  public readonly DISPLAY_WRONG_ANSWER = 1;
  public readonly DISPLAY_NO_ANSWER = 0;
  DISPLAY_HINT = false;
  endForScore: boolean;
  quiz: Quiz;
  question: Question;
  answer: Answer;
  wrongAnswerScore = new Map<string, number>();
  indexQuiz = 0;
  id: string;
  displayResult = this.DISPLAY_NO_ANSWER;
  // Check if the question was skipped
  isQuestionAnswered: boolean;

  // IF NOT EMOTIONS
  nextQuestionType = 'all'; // could be image or audio, image by default
  indexOfImageQuestion = [];
  indexOfAudioQuestion = [];
  // EXPRESSION HINT IF TWO WRONG SAME QUESTIONS
  nbWrongAnswerPerQuestion = 0;
  // 3 -> 6 rep audio
  nextQuestionElo = 0.5;
  // EMOTIONS INDEXES
  indexQuestionsAnswered: number[] = [];
  indexOfFourthRepImages: number[] = [];
  // 2 -> 4 rep audio
  indexOfSixthRepImages: number[] = [];

  // 0 -> 4 rep image
  // 1 -> 6 rep image
  indexOfFourthRepAudios: number[] = [];
  indexOfSixthRepAudios: number[] = [];
  nextQuestionNumberOfAnswers: number;
  hasCorrectlyAnswered: boolean;
  private lastAnswer = undefined;
  private readonly ANSWERS_NEEDED_TO_CHANGE_LEVEL = 4;
  private elo = 0;
  private scoreGame = 0;

  constructor(private route: ActivatedRoute, public quizService: QuizService, private router: Router) {
    this.isQuestionAnswered = false;
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
    return this.quiz !== undefined ? this.quiz.questions.length - 1 : 0;
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
    this.isQuestionAnswered = true;
    this.getCorrectAnswer().includes(answer) ? this.onRightAnswer() : this.onWrongAnswer(answer);
    this.manageQuestionScore(answer);
  }

  /**
   * Increment the number of wrong answer for a specific user
   */
  manageQuestionScore(answer): void {
    const userId = localStorage.getItem('application-user');
    if (!this.wrongAnswerScore.has(userId)) {
      this.wrongAnswerScore.set(userId, 0);
    }
    if (!this.getCorrectAnswer().includes(answer)) {
      this.wrongAnswerScore.set(userId, this.wrongAnswerScore.get(userId) + 1);
    }
  }

  /**
   * Next question with question type
   * TO DO: change data structure to make previous question working
   */
  nextQuestion(): void {
    this.sendStatistics();
    this.isQuestionAnswered = false;
    this.hasCorrectlyAnswered = undefined;
    this.displayResult = this.DISPLAY_NO_ANSWER;
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
      this.indexQuiz = this.nextAvailableQuestion();
      if (this.indexQuiz === -1) {
        this.finished();
      }
      console.log('emotion next question');
    }
  }

  /**
   * First page of the quiz
   * if this.indexQuiz === 0
   *
   * order the question by type and number of answers if necessary
   */
  isStart(): boolean {
    this.isEmotion() ? this.orderQuestionByNumberOfAnswers() : this.orderQuestionByType();
    return this.indexQuiz === 0;
  }

  /**
   * Last page of the quiz
   */
  isEnd(): boolean {
    if (this.isEmotion()) {
      return this.nextAvailableQuestion() === -1;
    } else {
      const lastImageQuestionIndex = Math.max.apply(null, this.indexOfImageQuestion);
      const lastAudioQuestionIndex = Math.max.apply(null, this.indexOfAudioQuestion);
      if (this.nextQuestionType === 'image' && (lastImageQuestionIndex === this.indexQuiz)) {
        return true;
      }
      if (this.nextQuestionType === 'audio' && (lastAudioQuestionIndex === this.indexQuiz)) {
        return true;
      }
      if (this.indexQuiz === this.getQuestionsLength()) {
        return true;
      }
      return false;
    }
  }

  /**
   * At the end of the quiz, used to display score
   */
  finished(): void {
    console.log((this.scoreGame) / (this.getQuestionsLength() + 1));
    this.sendStatistics();
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
   * Find the first index of a non-answered question according to a difficulty
   * @private
   */
  private nextValue(indexInList: number[]): number {
    indexInList.sort();
    this.indexQuestionsAnswered.sort();
    console.log('index in next list: ' + indexInList.toString());
    console.log('already answered :' + this.indexQuestionsAnswered.toString());
    for (const id of indexInList) {
      if (!this.indexQuestionsAnswered.includes(id)) {
        console.log('out ' + id);
        return id;
      }
    }
    return -1;
  }

  private nextAvailableQuestion(): number {
    if (this.nextQuestionType === 'image') {
      if (this.nextQuestionNumberOfAnswers <= this.ANSWERS_NEEDED_TO_CHANGE_LEVEL) {
        return this.nextValue(this.indexOfFourthRepImages);
      } else {
        return this.nextValue(this.indexOfSixthRepImages);
      }
    }
    if (this.nextQuestionType === 'audio') {
      if (this.nextQuestionNumberOfAnswers <= this.ANSWERS_NEEDED_TO_CHANGE_LEVEL) {
        return this.nextValue(this.indexOfFourthRepAudios);
      } else {
        return this.nextValue(this.indexOfSixthRepAudios);
      }
    }
  }

  private sendStatistics(): void {
    const userId = localStorage.getItem('application-user');
    this.quizService.addResponseScore(this.quiz.id, this.quiz.questions[this.indexQuiz].id, userId, this.wrongAnswerScore.get(userId), this.isQuestionAnswered);
    this.wrongAnswerScore.set(userId, 0);
  }
  /**
   * ### DIFFICULTY 3 ###
   * change question difficulty depending on ELO
   * @private
   */
  private selectEloQuestion(): void {
    if (this.nextQuestionElo <= 1) {
      this.nextQuestionType = 'image';
      this.nextQuestionNumberOfAnswers = 4;
    } else if (this.nextQuestionElo <= 2) {
      this.nextQuestionType = 'image';
      this.nextQuestionNumberOfAnswers = 6;
    } else if (this.nextQuestionElo <= 3) {
      this.nextQuestionType = 'audio';
      this.nextQuestionNumberOfAnswers = 4;
    } else {
      this.nextQuestionType = 'audio';
      this.nextQuestionNumberOfAnswers = 6;
    }
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
   * Get wrong answers of the current question
   * return: Array of wrong answer(s)
   */
  private getWrongAnswerNextQuestion(index): Array<Answer> {
    return this.quiz.questions[index] !== undefined ? this.quiz.questions[index].answers.filter(x => !x.isCorrect) : [];
  }

  /**
   * When user click the right answer
   * Increment elo
   * Change display with DISPLAY_RIGHT_ANSWER field
   * increment score game for final result
   * @private
   */
  private onRightAnswer(): void {
    this.hasCorrectlyAnswered = true; // to prevent wrong answer after
    this.elo++; // for pictogram game mode
    this.indexQuestionsAnswered.push(this.indexQuiz); // store the index of the current question for emotion
    this.scoreGame++; // for stats
    this.displayResult = this.DISPLAY_RIGHT_ANSWER; // to display
    this.lastAnswer === undefined ? this.lastAnswer = true : this.lastAnswer = false;
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
    if (this.hasCorrectlyAnswered !== true) {
      if (this.isPicto()) {
        this.removeWrongAnswer(answer, 0);
        this.elo--;
      }
      if (this.isExpression()) {
        this.nbWrongAnswerPerQuestion++;
        this.DISPLAY_HINT = this.nbWrongAnswerPerQuestion >= 2;
      }
      if (this.isEmotion()) {
        this.lastAnswer = false;
      }
      this.displayResult = this.DISPLAY_WRONG_ANSWER;
    }
  }

  /**
   * change nextQuestionElo global variable
   * make sure elo is in the range [0 : 4]
   * @private
   */
  private changeNextQuestionElo(): void {
    console.log('last answer : ' + this.lastAnswer);
    if (this.lastAnswer === undefined) {
      this.nextQuestionElo -= 0.5;
      this.lastAnswer = false;
    } else if (this.lastAnswer === true) {
      this.nextQuestionElo += 0.5;
      this.lastAnswer = undefined;
    } else if (this.lastAnswer === false) {
      this.nextQuestionElo -= 0.5;
      this.lastAnswer = false;
    }
    this.nextQuestionElo = Math.min(4, Math.max(0, this.nextQuestionElo));
    this.lastAnswer = undefined; // clear
  }


  private isAudioQuestion(i): boolean {
    return this.quiz.questions[i] != null && this.quiz.questions[i].image == null && this.quiz.questions[i].audio != null;
  }

  private isImageQuestion(i): boolean {
    return this.quiz.questions[i] != null && this.quiz.questions[i].image != null && this.quiz.questions[i].audio == null;
  }

  /**
   * Système d'elo
   * Question suivante adapté
   * Images ou Audios
   * 4 rep ou 6 rep
   * @private
   */
  isEmotion(): boolean {
    return this.quiz.theme.toLocaleLowerCase().includes('motion');
  }

  /**
   * On supprime simplement les mauvaises réponses
   * @private
   */
  isPicto(): boolean {
    return this.quiz.theme.toLocaleLowerCase().startsWith('picto');
  }

  /**
   * Si deux mauvaises réponses sur une même question
   * Afficher un indice
   * @private
   */
  isExpression(): boolean {
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

  /**
   * Emotion need to filter by answer quantity
   */
  private orderQuestionByNumberOfAnswers(): void {
    const j = this.getQuestionsLength() + 1;
    for (let i = 0; i <= j; i++) {
      if (this.getWrongAnswerNextQuestion(i).length < this.ANSWERS_NEEDED_TO_CHANGE_LEVEL) {
        if (this.isImageQuestion(i)) {
          this.indexOfFourthRepImages.push(i);
        }
        if (this.isAudioQuestion(i)) {
          this.indexOfFourthRepAudios.push(i);
        }
      }
      if (this.getWrongAnswerNextQuestion(i).length >= this.ANSWERS_NEEDED_TO_CHANGE_LEVEL) {
        if (this.isAudioQuestion(i)) {
          this.indexOfSixthRepAudios.push(i);
        }
        if (this.isImageQuestion(i)) {
          this.indexOfSixthRepImages.push(i);
        }
      }
    }
  }

  previousQuestion(): void {
    if (this.isEmotion()) {
      this.indexQuiz = this.searchPreviousQuestion();
    } else {
      this.indexQuiz--;
    }
    this.displayResult = this.DISPLAY_NO_ANSWER;
  }

  private searchPreviousQuestion(): number {
    this.indexQuestionsAnswered = Array.from(new Set(this.indexQuestionsAnswered.sort()));
    const lastQuestionId = this.indexQuestionsAnswered.pop();
    console.log('last answered question id was ' + lastQuestionId);
    return lastQuestionId;
  }
}
