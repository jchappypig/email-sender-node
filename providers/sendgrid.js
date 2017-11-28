const axios = require('axios');
const apiUrl = 'https://api.sendgrid.com/v3/mail/send';
const sendgridApiKey = `${process.env.SENDGRID_API_KEY}`;
const emailWithNameRegex = /(.+)?<(.+)>$/;

const mapToEmails = (input) => {
  if (input === undefined) return;

  const emails = input
    .split(',')
    .filter(email => (email.length))
    .map(email => (email.trim()))
    .map(email => (extractEmail(email)));

  return emails;
}

const mapToContent = (input) => {
  if (input === undefined) return;

  return [{
    type: 'text/plain',
    value: input
  }]
};

const mapToFrom = (input) => {
  const emails = mapToEmails(input)
  return emails && emails[0];
};

const extractEmail = (input) => {
  let email = input;
  let name;

  if (emailWithNameRegex.test(input)) {
    name = (RegExp.$1).trim();
    email = (RegExp.$2).trim();
  }

  if (name && name.length) {
    return { email, name };
  }

  return { email };
};

const send = async (from, to, cc, bcc, subject, content) => {
  const personalizations = [{
    to: mapToEmails(to),
    cc: mapToEmails(cc),
    bcc: mapToEmails(bcc),
  }];

  const data = {
    personalizations,
    from: mapToFrom(from),
    subject,
    content: mapToContent(content)
  }

  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${sendgridApiKey}`
    }
  }

  try {
    const response = await axios.post(apiUrl, data, axiosConfig);
    return { statusCode: response.status, response: 'Email sent successfully!\n' }
    return response;
  } catch (error) {
    const { response } = error;
    return { statusCode: response.status, response: response.data.errors }
  }
};

module.exports = {
  send,
  mapToEmails,
  mapToFrom,
  mapToContent,
  apiUrl,
  sendgridApiKey
};