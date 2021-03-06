const Joi = require('joi')
const BaseModel = require('../utils/base-model.js')

module.exports = new BaseModel('Responses', {
  quizId: Joi.number().required(),
  questionId: Joi.number().required(),
  userId: Joi.string().required(),
  wrongAnswerCount: Joi.number().required(),
})
