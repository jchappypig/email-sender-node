# Email sender
A backend service that accepts necessary information and send emails

## Running env
- Node 8.9.0
- Please setup your SendGrid API key as `SENDGRID_API_KEY` in `.env` file
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

## How to run the tests

```
npm test
```
## App structure
I have created this app using express generator to begin with.

```
providers
  sendgrid.js       # Massage user input to match sendgrid format; send email through sendgrid API.
  mailgun.js        # TODO: Massage user input to match mailgun format; send email through mailgun API.
services
  emailService.js   # Use sendgrid provider to send email. In case of failure, fallback to mailgun provider.
routes
  emails.js         # Post /emails to send email using email service
  index.js          # Express generator auto generated file. Render home page.

__test__            # Unit tests
  providers
      sendgrid.js   
      mailgun.js    # TODO
  services
    emailService.js
  routes
    emails.js
    index.js


```

## TO DO

- Integrate with mailgun api
- Rails version
