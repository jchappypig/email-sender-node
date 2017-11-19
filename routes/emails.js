const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/', async (req, res, next) => {
  const { from, to, cc, bcc, subject, content } = req.body;
  try {
    const emailServiceResponse = await emailService.send(from, to, cc, bcc, subject, content);
    res.status(emailServiceResponse.statusCode).send(emailServiceResponse.response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
