# Email sender
A backend service that accepts necessary information and send emails

## Running env
- Node 8.9.0
- Please setup your SendGrid API key as `SENDGRID_API_KEY` and Mailgun API key as `MAILGUN_API_KEY` in `.env` file
## How to run the service
To start this service, you can just run

```
npm install
```
then
```
npm start
```

Server will be started at [http://localhost:3000](http://localhost:3000)

NOTE: You need to config the `SENDGRID_API_KEY` in `.env` file

Once you setup, try this 👇:

```
curl --request POST --url 'http://localhost:3000/emails' --data "from='jchappypig@hotmail.com&to='jchappypig@hotmail.com,jchappypig@gmail.com'&subject='Hi'&content='How is your weekend?'"
```

## How to run the tests

```
npm test
```
## App structure
I have created this app using express generator to begin with.

**emails.js** (*talks to*)-> **emailService.js** (*talks to*) -> either **providers/sendgrid.js** or **providers/mailgun.js**


```
providers
  sendgrid.js       # Massage user input to match sendgrid format; send email through sendgrid API.
  mailgun.js        # Massage user input to match mailgun format; send email through mailgun API.
services
  emailService.js   # Use sendgrid provider to send email. In case of failure, fallback to mailgun provider.
routes
  emails.js         # Post /emails to send email using email service
  index.js          # Express generator auto generated file. Render home page.

__test__            # Unit tests
  providers
    sendgrid.js   
    mailgun.js
  services
    emailService.js
  routes
    emails.js
    index.js


```


Feedback is always welcome 🤗