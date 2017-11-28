const axios = require('axios');
const mailgunApiKey = `${process.env.MAILGUN_API_KEY}`;
const apiUrl = `https://api:${mailgunApiKey}@api.mailgun.net/v3/sandbox65ab063cd04f42ecb08990f311580dce.mailgun.org/messages`;
const Querystring = require('querystring');

const send = async (from, to, cc, bcc, subject, content) => {
  try {
    data = Querystring.stringify({
      from: 'jchappypig@hotmail.com',
      to,
      cc,
      bcc,
      subject,
      text: content
    });

    const response = await axios.post(apiUrl, data, {});
    return { statusCode: response.status, response: 'Email sent successfully!\n' }
    return response;
  } catch (error) {
    const { response } = error;
    return { statusCode: response.status, response: [response.data] }
  }
};

module.exports = {
  send,
  apiUrl
};