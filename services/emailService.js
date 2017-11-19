const sendgrid = require('../providers/sendgrid');
const mailgun = require('../providers/mailgun');

const send = async (from, to, cc, bcc, subject, content) => {
  sendgrid.send(from, to, cc, bcc, subject, content);
  const sendgridResponse = await sendgrid.send(from, to, cc, bcc, subject, content);

  const { statusCode, response } = sendgridResponse;
  if (statusCode === 400 || (statusCode >= 200 && statusCode < 300)) {
    return sendgridResponse;
  }

  return await mailgun.send(from, to, cc, bcc, subject, content);
};

module.exports = {
  send
};