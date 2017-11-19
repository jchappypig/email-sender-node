const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/', (req, res, next) => {
  const { from, to, cc, bcc, subject, content } = req.body;

  emailService.send(from, to, cc, bcc, subject, content);

  res.send('Email is sent successfully');
});

module.exports = router;
