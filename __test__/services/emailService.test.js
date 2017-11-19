const emailService = require('../../services/emailService');
const sendgrid = require('../../providers/sendgrid');
const mailgun = require('../../providers/mailgun');

describe('emailService', () => {
  describe('send', () => {
    it('sends email through sendgridProvider', () => {
      const sendgridSendSpy = jest.spyOn(sendgrid, 'send').mockReturnValue({ statusCode: 200 });

      emailService.send(
        'jchappypig@hotmail.com',
        'stefano.fratini@siteminder.com',
        'kent.cameron@siteminder.com',
        'jchappypig@gmail.com',
        'Hi',
        'How is your weekend?'
      );

      expect(sendgridSendSpy).toHaveBeenCalledWith(
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
        const sendgripResponse = {
          statusCode: statusCode,
          response: { message: 'abc message' }
        };

        it('returns sendgrids response', () => {
          const sendgridSendSpy = jest.spyOn(sendgrid, 'send').mockReturnValue(sendgripResponse);

          const response = emailService.send('jchappypig@hotmail.com');

          expect(response).toEqual(sendgripResponse);
        });

        it('does not send email through mailgun', () => {
          const sendgridSendSpy = jest.spyOn(sendgrid, 'send').mockReturnValue(sendgripResponse);
          const mailgunSendSpy = jest.spyOn(mailgun, 'send');

          const response = emailService.send('jchappypig@hotmail.com');

          expect(mailgunSendSpy).not.toHaveBeenCalled();
        })
      });
    });

    [429, 401, 500].forEach(statusCode => {
      describe(`when sendgrid returns ${statusCode}`, () => {
        const sendgripResponse = {
          statusCode: statusCode,
          response: { message: 'sendgrid message' }
        };

        const mailgunResponse = {
          statusCode: statusCode,
          response: { message: 'mailgun message' }
        };

        it('fallbacks to mailgun provider', () => {
          const sendgridSendSpy = jest.spyOn(sendgrid, 'send').mockReturnValue(sendgripResponse);
          const mailgunSendSpy = jest.spyOn(mailgun, 'send').mockReturnValue(mailgunResponse);

          const response = emailService.send('jchappypig@hotmail.com');

          expect(mailgunSendSpy).toHaveBeenCalled();
        });

        it('returns mailgun response', () => {
          const sendgridSendSpy = jest.spyOn(sendgrid, 'send').mockReturnValue(sendgripResponse);
          const mailgunSendSpy = jest.spyOn(mailgun, 'send').mockReturnValue(mailgunResponse);

          const response = emailService.send('jchappypig@hotmail.com');

          expect(response).toEqual(mailgunResponse);
        });
      });
    });
  });
});