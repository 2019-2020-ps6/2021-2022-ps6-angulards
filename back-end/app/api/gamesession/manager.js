const { Responses } = require('../../models')

/**
 * Game Session Manager.
 * This file contains all the logic needed to by the game session routes.
 */


/**
 * filterResponseByUserIdAndQuizId.
 * This function filters among the responses to return only the question linked with the given quizId and userId.
 * @param quizId
 * @param userId
 */
const filterResponseByUserIdAndQuizId = (userId, quizId) => {
    const responses = Responses.get()
    return responses.filter((response) => response.quizId === Number(quizId) && response.userId === userId)
}

/**
 * filterResponseByUserIdAndQuizIdAndQuestions.
 * This function filters among the responses to return only the question linked with the given quizId and userId and questionId.
 * @param quizId
 * @param userId
 * @param questionId
 */
const filterResponseByUserIdAndQuizIdAndQuestions = (userId, quizId, questionId) => {
    const responses = Responses.get()
    console.log('ok ', typeof responses[0].questionId)
    return responses.filter((response) => response.quizId === Number(quizId) && response.questionId === Number(questionId) && response.userId === userId)
}

module.exports = {
    filterResponseByUserIdAndQuizId,
    filterResponseByUserIdAndQuizIdAndQuestions,
}
