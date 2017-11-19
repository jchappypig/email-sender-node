const request = require('supertest');
const app = require('../../app');

describe('email', () => {
  describe('GET /emails', () => {
    it('reponses 200', async () => {
      const response = await request(app).get('/emails');
      expect(response.statusCode).toBe(200);
    });
  });
});