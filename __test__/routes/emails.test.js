const request = require('supertest');
const app = require('../../app');
const emailService = require('../../services/emailService');

describe('routes/emails', () => {
  describe('GET /emails', () => {
    it('reponses 200', async () => {
      const response = await request(app).get('/emails');
      expect(response.statusCode).toBe(200);
    });
  });

  describe('POST /emails', () => {
    const data = {
      'from': 'jchappypig@hotmail.com',
      'to': 'stefano.fratini@siteminder.com',
      'cc': 'kent.cameron@siteminder.com',
      'bcc': 'jchappypig@gmail.com',
      'subject': 'Hi',
      'content': 'How is your weekend?'
    };
    const sendSpy = jest.spyOn(emailService, 'send');

    it('uses email service to send email', async () => {
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

    [200, 400, 500].forEach((statusCode) => {
      it(`responses ${statusCode} which the same as email service`, async () => {
        const sendSpy = jest.spyOn(emailService, 'send').mockReturnValue({ statusCode });

        const response = await request(app).post('/emails')
          .send(data);

        expect(response.statusCode).toBe(statusCode);
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });
  });
});