const request = require('supertest');
const app = require('../../app');
const emailService = require('../../services/emailService');

describe('email', () => {
  describe('GET /emails', () => {
    it('reponses 200', async () => {
      const response = await request(app).get('/emails');
      expect(response.statusCode).toBe(200);
    });
  });

  describe('POST /emails', () => {
    describe('when input is valid', async () => {
      const data = {
        'from': 'jchappypig@hotmail.com',
        'to': 'stefano.fratini@siteminder.com',
        'cc': 'kent.cameron@siteminder.com',
        'bcc': 'jchappypig@gmail.com',
        'subject': 'Hi',
        'content': 'How is your weekend?'
      };

      it('resposne 201', async () => {
        const response = await request(app).post('/emails')
          .send(data);

        expect(response.statusCode).toBe(200);
      });

      it('uses email service to send email', async () => {
        const sendSpy = jest.spyOn(emailService, 'send');

        await request(app).post('/emails')
          .send(data);

        expect(sendSpy).toHaveBeenCalledWith(
          'jchappypig@hotmail.com',
          'stefano.fratini@siteminder.com',
          'kent.cameron@siteminder.com',
          'jchappypig@gmail.com',
          'Hi',
          'How is your weekend?'
        );
      });

      afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
      });
    });
  });
});