
const axios = require('axios');
const mailgun = require('../../providers/mailgun');
const Querystring = require('querystring');

describe('mailgun', () => {
  describe('send', () => {
    it('posts to mailgun API', () => {
      const postFnMock = jest.fn().mockReturnValue({ status: 202, data: {} });
      axios.post = postFnMock;

      mailgun.send(
        'jchappypig@hotmail.com',
        'stefano.fratini@siteminder.com',
        'kent.cameron@siteminder.com',
        'jchappypig@gmail.com',
        'Hi',
        'How is your weekend?'
      );

      expect(postFnMock).toHaveBeenCalled();
      expect(postFnMock.mock.calls[0][0]).toBe(mailgun.apiUrl);
    });

    it('composes the data and send to mailgun API', () => {
      const postFnMock = jest.fn().mockReturnValue({ status: 202, data: {} });
      axios.post = postFnMock;

      mailgun.send(
        'jchappypig@hotmail.com',
        'stefano.fratini@siteminder.com',
        'kent.cameron@siteminder.com',
        'jchappypig@gmail.com',
        'Hi',
        'How is your weekend?'
      );

      expect(postFnMock.mock.calls[0][1]).toEqual(Querystring.stringify({
        from: 'jchappypig@hotmail.com',
        to: 'stefano.fratini@siteminder.com',
        cc: 'kent.cameron@siteminder.com',
        bcc: 'jchappypig@gmail.com',
        subject: 'Hi',
        text: 'How is your weekend?'
      }));
    });

    describe('when success', async () => {
      it('returns mailgun response', async () => {
        const postFnMock = jest.fn().mockReturnValue({ status: 202, data: {} });
        axios.post = postFnMock;

        const response = await mailgun.send(
          'jchappypig@hotmail.com',
          'stefano.fratini@siteminder.com',
          'kent.cameron@siteminder.com',
          'jchappypig@gmail.com',
          'Hi',
          'How is your weekend?'
        );

        expect(response).toEqual({ statusCode: 202, response: 'Email sent successfully!\n' });
      });
    });
  });
});