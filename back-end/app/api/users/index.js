const { Router } = require('express')
const { User, Responses } = require('../../models')
const manageAllErrors = require('../../utils/routes/error-management')

const router = new Router()

router.get('/', (req, res) => {
  try {
    res.status(200).json(User.get())
  } catch (err) {
    manageAllErrors(res, err)
  }
})

router.get('/response', (req, res) => {
  try {
    console.log('I AM INSIDE')
    res.status(200).json(Responses.get())
  } catch (err) {
    manageAllErrors(res, err)
  }
})

/**
 * filterQuestionsFromQuizz.
 * This function filters among the questions to return only the question linked with the given quizId.
 * @param quizId
 */
const filterResponseByUserIdAndQuizId = (userId, quizId) => {
  const responses = Responses.get()
  return responses.filter((response) => response.quizId === Number(quizId) && response.userId === userId)
}

router.get('/response/:quizId/:userId', (req, res) => {
  try {
    User.getById(req.params.userId)
    res.status(200).json(filterResponseByUserIdAndQuizId(req.params.userId, req.params.quizId))
  } catch (err) {
    manageAllErrors(res, err)
  }
})

router.get('/:userId', (req, res) => {
  try {
    res.status(200).json(User.getById(req.params.userId))
  } catch (err) {
    manageAllErrors(res, err)
  }
})

router.post('/', (req, res) => {
  try {
    const user = User.create({ ...req.body })
    res.status(201).json(user)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

router.put('/:userId', (req, res) => {
  try {
    res.status(200).json(User.update(req.params.userId, req.body))
  } catch (err) {
    manageAllErrors(res, err)
  }
})

router.delete('/:userId', (req, res) => {
  try {
    User.delete(req.params.userId)
    res.status(204).end()
  } catch (err) {
    manageAllErrors(res, err)
  }
})

module.exports = router
