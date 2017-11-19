const emailService = require('../../services/emailService');
const sendgrid = require('../../providers/sendgrid');
const mailgun = require('../../providers/mailgun');

describe('emailService', () => {
  describe('send', () => {
    const sendgridResponse = {
      statusCode: 200,
      response: { message: 'sendgrid message' }
    };

    it('sends email through sendgridProvider', () => {
      const sendgridSendFnMock = jest.fn().mockReturnValue(sendgridResponse);
      sendgrid.send = sendgridSendFnMock;

      emailService.send(
        'jchappypig@hotmail.com',
        'stefano.fratini@siteminder.com',
        'kent.cameron@siteminder.com',
        'jchappypig@gmail.com',
        'Hi',
        'How is your weekend?'
      );

      expect(sendgridSendFnMock).toHaveBeenCalledWith(
        'jchappypig@hotmail.com',
        'stefano.fratini@siteminder.com',
        'kent.cameron@siteminder.com',
        'jchappypig@gmail.com',
        'Hi',
        'How is your weekend?'
      );
    });

    [400, 200, 202].forEach(statusCode => {
      describe(`when sendgrid returns ${statusCode}`, () => {
        const sendgridResponse = {
          statusCode: statusCode,
          response: { message: 'abc message' }
        };

        it('returns sendgrids response', async () => {
          const sendgridSendFnMock = jest.fn().mockReturnValue(sendgridResponse);
          sendgrid.send = sendgridSendFnMock;

          const response = await emailService.send('jchappypig@hotmail.com');

          expect(response).toEqual(sendgridResponse);
        });

        it('does not send email through mailgun', async () => {
          const sendgridSendFnMock = jest.fn().mockReturnValue(sendgridResponse);
          sendgrid.send = sendgridSendFnMock;
          const mailgunSendFnMock = jest.fn();
          mailgun.send = mailgunSendFnMock;

          const response = await emailService.send('jchappypig@hotmail.com');

          expect(mailgunSendFnMock).not.toHaveBeenCalled();
        })
      });
    });

    [429, 401, 500].forEach(statusCode => {
      describe(`when sendgrid returns ${statusCode}`, () => {
        const sendgridResponse = {
          statusCode: statusCode,
          response: { message: 'sendgrid message' }
        };

        const mailgunResponse = {
          statusCode: statusCode,
          response: { message: 'mailgun message' }
        };

        it('fallbacks to mailgun provider', async () => {
          const sendgridSendFnMock = jest.fn().mockReturnValue(sendgridResponse);
          sendgrid.send = sendgridSendFnMock;
          const mailgunSendFnMock = jest.fn().mockReturnValue(mailgunResponse);
          mailgun.send = mailgunSendFnMock;

          const response = await emailService.send('jchappypig@hotmail.com');

          expect(mailgunSendFnMock).toHaveBeenCalled();
        });

        it('returns mailgun response', async () => {
          const sendgridSendFnMock = jest.fn().mockReturnValue(sendgridResponse);
          sendgrid.send = sendgridSendFnMock;
          const mailgunSendFnMock = jest.fn().mockReturnValue(mailgunResponse);
          mailgun.send = mailgunSendFnMock;

          const response = await emailService.send('jchappypig@hotmail.com');

          expect(response).toEqual(mailgunResponse);
        });
      });
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});