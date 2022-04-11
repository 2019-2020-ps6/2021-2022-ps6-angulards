const { Router } = require('express')
const path = require('path')
const formidable = require('formidable')
// const fs = require('fs')
const { Quiz, Responses } = require('../../models')
const manageAllErrors = require('../../utils/routes/error-management')
const QuestionsRouter = require('./questions')
const { buildQuizz, buildQuizzes } = require('./manager')

const router = new Router()
const uploadDirPath = path.join(__dirname, 'files')

router.use('/:quizId/questions', QuestionsRouter)

router.get('/', (req, res) => {
  try {
    const quizzes = buildQuizzes()
    res.status(200).json(quizzes)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

router.get('/:quizId', (req, res) => {
  try {
    const quizz = buildQuizz(req.params.quizId)
    res.status(200).json(quizz)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

router.post('/', (req, res) => {
  try {
    const quiz = Quiz.create({ ...req.body })
    res.status(201).json(quiz)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

router.post('/persistimage', (req, res) => {
  const form = formidable({ uploadDir: uploadDirPath })
  // eslint-disable-next-line no-console
  console.log(`res is ${res.status(0)}`)
  form
    .on('fileBegin', (formname, file) => {
      // WARNING HERE TO FIX
      // eslint-disable-next-line no-param-reassign
      file.filepath = `${uploadDirPath}/${file.originalFilename}`
    })
    .on('file', (fieldName, file) => {
      // eslint-disable-next-line no-console
      console.log(fieldName, file)
    })
    .on('end', () => {
      // eslint-disable-next-line no-console
      console.log('-> upload done')
    })

  form.parse(req)

  // form.parse(req, (err, fields, files) => {
  //   if (err) {
  //     console.log("ERROR IN THE BACKEND WHILE PERSISING AND IMAGE", err)
  //     res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
  //     res.end(String(err));
  //     return;
  //   }
  //   res.writeHead(200, { 'Content-Type': 'application/json' });
  //   res.end(JSON.stringify({ fields, files }, null, 2));
  // });
})

router.put('/:quizId', (req, res) => {
  try {
    res.status(200).json(Quiz.update(req.params.quizId, req.body))
  } catch (err) {
    manageAllErrors(res, err)
  }
})

router.delete('/:quizId', (req, res) => {
  try {
    Quiz.delete(req.params.quizId)
    res.status(204).end()
  } catch (err) {
    manageAllErrors(res, err)
  }
})


router.post('/response', (req, res) => {
  try {
    console.log('    before creating response')
    console.log(req.body)
    const response = Responses.create({ ...req.body })
    console.log('    response created :', response)
    res.status(201).json(response)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

module.exports = router
