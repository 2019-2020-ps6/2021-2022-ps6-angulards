const Joi = require('joi')
const BaseModel = require('../utils/base-model.js')

module.exports = new BaseModel('User', {
  email: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  statcode: Joi.string().allow(''),
  password: Joi.string().required(),
  admin: Joi.boolean().required(),
})
