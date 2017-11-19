const axios = require('axios');
const sendgrid = require('../../providers/sendgrid');

describe('sendgrid', () => {
  describe('mapToEmails', () => {
    const { mapToEmails } = sendgrid;

    it('returns undefined if input is undefined', () => {
      expect(mapToEmails()).toEqual(undefined);
    });

    it('maps email string value to personalization objects', () => {
      expect(mapToEmails('jchappypig@email.com')).toEqual([
        { email: 'jchappypig@email.com' }
      ]);
    });

    it('trims email', () => {
      expect(mapToEmails('jchappypig@email.com ')).toEqual([
        { email: 'jchappypig@email.com' }
      ]);

      expect(mapToEmails(' jchappypig@email.com ')).toEqual([
        { email: 'jchappypig@email.com' }
      ]);
    });

    it('can gets multiple emails', () => {
      expect(mapToEmails('Huanhuan <jchappypig@email.com> , hello@email.com')).toEqual([
        {
          email: 'jchappypig@email.com',
          name: 'Huanhuan'
        },
        { email: 'hello@email.com' }
      ]);
    });

    it('ignore empty email address', () => {
      expect(mapToEmails(' jchappypig@email.com ,')).toEqual([
        { email: 'jchappypig@email.com' }
      ]);
    });

    it('understands email with <>', () => {
      expect(mapToEmails('<jchappypig@email.com>')).toEqual([
        { email: 'jchappypig@email.com' }
      ]);

      expect(mapToEmails('< jchappypig@email.com>')).toEqual([
        { email: 'jchappypig@email.com' }
      ]);

      expect(mapToEmails('< jchappypig@email.com >')).toEqual([
        { email: 'jchappypig@email.com' }
      ]);
    });

    it('understands email with name', () => {
      expect(mapToEmails('Happy Huang<jchappypig@email.com>')).toEqual([
        {
          email: 'jchappypig@email.com',
          name: 'Happy Huang'
        }
      ]);

      expect(mapToEmails('Huan< jchappypig@email.com>')).toEqual([
        {
          email: 'jchappypig@email.com',
          name: 'Huan'
        }
      ]);

      expect(mapToEmails(' Huanhuan Huang  < jchappypig@email.com >')).toEqual([
        {
          email: 'jchappypig@email.com',
          name: 'Huanhuan Huang'
        }
      ]);
    });
  });

  describe('send', () => {
    it('posts to sendgrid API', () => {
      const postFnMock = jest.fn().mockReturnValue({ status: 202, data: {} });
      axios.post = postFnMock;

      sendgrid.send(
        'jchappypig@hotmail.com',
        'stefano.fratini@siteminder.com',
        'kent.cameron@siteminder.com',
        'jchappypig@gmail.com',
        'Hi',
        'How is your weekend?'
      );

      expect(postFnMock).toHaveBeenCalled();
      expect(postFnMock.mock.calls[0][0]).toBe(sendgrid.apiUrl);
    });

    it('composes the data and send to sendgrid API', () => {
      const postFnMock = jest.fn().mockReturnValue({ status: 202, data: {} });
      axios.post = postFnMock;

      sendgrid.send(
        'jchappypig@hotmail.com',
        'stefano.fratini@siteminder.com',
        'kent.cameron@siteminder.com',
        'jchappypig@gmail.com',
        'Hi',
        'How is your weekend?'
      );

      expect(postFnMock.mock.calls[0][1]).toEqual({
        personalizations: [{
          to: [{
            email: 'stefano.fratini@siteminder.com'
          }],
          cc: [{
            email: 'kent.cameron@siteminder.com'
          }],
          bcc: [{
            email: 'jchappypig@gmail.com'
          }]
        }],
        from: {
          email: 'jchappypig@hotmail.com'
        },
        subject: 'Hi',
        content: [{
          type: 'text/plain',
          value: 'How is your weekend?'
        }]
      });
    });

    it('sends nothing to sendgrid api if params are not provided', () => {
      const postFnMock = jest.fn().mockReturnValue({ status: 400, data: { errors: 'Invalid data' } });
      axios.post = postFnMock;

      sendgrid.send();

      expect(postFnMock.mock.calls[0][1]).toEqual({
        personalizations: [{
          to: undefined,
          cc: undefined,
          bcc: undefined
        }],
        from: undefined,
        subject: undefined,
        content: [{
          type: 'text/plain',
          value: undefined
        }]
      });
    });

    it('configs api key', () => {
      const postFnMock = jest.fn().mockReturnValue({ status: 202, data: {} });
      axios.post = postFnMock;

      sendgrid.send(
        'jchappypig@hotmail.com',
        'stefano.fratini@siteminder.com',
        'kent.cameron@siteminder.com',
        'jchappypig@gmail.com',
        'Hi',
        'How is your weekend?'
      );

      expect(postFnMock.mock.calls[0][2]).toEqual({
        headers: {
          'Authorization': `Bearer ${sendgrid.sendgridApiKey}`
        }
      });
    });
  });
});