const { Router } = require('express')
const { User, Responses } = require('../../models')
const manageAllErrors = require('../../utils/routes/error-management')
const { filterResponseByUserIdAndQuizIdAndQuestions, filterResponseByUserIdAndQuizId } = require('./manager')


const router = new Router()

router.get('/response', (req, res) => {
  try {
    console.log('I AM INSIDE')
    res.status(200).json(Responses.get())
  } catch (err) {
    manageAllErrors(res, err)
  }
})

router.post('/response', (req, res) => {
  try {
    console.log('    before creating response')
    console.log(req.body)
    const response = Responses.create({ ...req.body })
    console.log(response)
    res.status(201).json(response)
  } catch (err) {
    manageAllErrors(res, err)
  }
})


router.get('/response/:quizId/:userId', (req, res) => {
  try {
    console.log('inside')
    User.getById(req.params.userId)
    res.status(200).json(filterResponseByUserIdAndQuizId(req.params.userId, req.params.quizId))
  } catch (err) {
    manageAllErrors(res, err)
  }
})


/**
 * Get Responses of a specific questions
 */
router.get('/response/:quizId/:userId/:questionId', (req, res) => {
  try {
    User.getById(req.params.userId)
    console.log('quest id : ', typeof req.params.questionId)
    res.status(200).json(filterResponseByUserIdAndQuizIdAndQuestions(req.params.userId, req.params.quizId, req.params.questionId))
  } catch (err) {
    manageAllErrors(res, err)
  }
})

module.exports = router
