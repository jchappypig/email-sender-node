const sendgrid = require('../providers/sendgrid');
const mailgun = require('../providers/mailgun');

const send = (from, to, cc, bcc, subject, content) => {
  const sendgridResponse = sendgrid.send(from, to, cc, bcc, subject, content);

  const { statusCode, response } = sendgridResponse;
  if (statusCode === 400 || (statusCode >= 200 && statusCode < 300)) {
    return sendgridResponse;
  }

  return mailgun.send(from, to, cc, bcc, subject, content);
};

module.exports = {
  send
};