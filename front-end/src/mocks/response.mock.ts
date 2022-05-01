import {Response} from '../models/response.model';

export const ResponseMock: { questionId: string; wrongAnswerCount: number; quizId: string; userId: string }[] = [
  {

    quizId: '123456789',
    questionId: '1234567891',
    userId: '1234567821',
    wrongAnswerCount: 1,

  },
  {

    quizId: '123456789',
    questionId: '1234567891',
    userId: '1234567821',
    wrongAnswerCount: 0,

  }
];
