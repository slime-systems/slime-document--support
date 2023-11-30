# Guides

## Introduction

Slime Document helps you generate documents, store them securely, and manage them effectively.
We offer the service through architectured and well-thought-out APIs.

## Authentication & Getting Started

### Getting your hands dirty

Download or clone this repository to your workstation; we are interested in specifically the hello example resided
at [./examples/hello](../examples/hello).

~~~sh
CLONE_TO=slime-document-examples; \
git clone https://github.com/slime-systems/slime-document--support.git $CLONE_TO && \
cd "$CLONE_TO/examples/hello"
~~~

It is assumed you have nodejs and npm installed on the machine. You can try running the example right away.

~~~sh
npm install && npm start
~~~

If you get something similar to

~~~json
{
  "exception": {
    "code": "JWT::KeyNotFound"
  }
}
~~~

, congrats. You are now successfully connected with the API.

### Setting the API credentials

You may now examine the file at [./index.js](../examples/hello/index.js) on your machine and set the variables to the
real API credentials from your projects.

~~~javascript
const projectId = 123456;
const keyId = 'k1234';
const secret = 'Bl9j0NXcWz70VMqxzk3Psk1ZAwQ6Pa5xlT9EHucd';
~~~

#### Where to find the credentials?

After logging into the customer portal, go to the project dashboard;
you can generate an API key from the "API Keys" section of the project dashboard.

Not having a project yet?  
Create a project now by clicking on the "New Project" link.

#### Testing the credentials

You could rerun the hello example as many times as you want after editing [./index.js](../examples/hello/index.js) on
your machine.

~~~sh
npm start
~~~

You will be greeted with the successful API response if done correctly, similar to:

~~~json
{
  "data": {
    "hello": "Sekai"
  }
}
~~~

Congrats you are now successfully authenticated with the API.

## Understand the Authentication

You have to understand what happened in the example in order to authenticate it your way with your language of choice.
There is not much to be learned, actually.

### High-level overview

The client sends a command and its parameters to the API endpoint and receives the response.

### Communication medium

We use POST-method HTTP requests to carry the encoded payload to the designated API endpoint.
The encoded payload is sent as the POST parameter named `request`.

~~~javascript
const response = await axios.post(apiEndpoint, {
  request: jwt,
});
~~~

### Payload encoding

We use the industry standard, [JWT](https://jwt.io/), for API authentication
because of [the support of communities of many programming languages](https://jwt.io/libraries).

Encoding the command into a payload is as simple as picking your preferred JWT library and passing in the parameters.

In the example, we want to call the "hello" command passing name as the only parameter.
By reading the API document, you will find out that the "hello" command corresponds to the "test/hello" API subject;
the command accepts the `name` parameter.
We then start constructing our payload with `sub` and `data` claims as shown.

~~~javascript
new SignJWT({
  sub: 'test/hello',
  data: {
    name: 'Sekai',
  },
})
~~~

Please note that the `data` claim is a custom claim; it is not backed by the JWT standard.

Then you have to set `iat` and `aud` claims for the JWT;
the technical details of what they are for are out of the scope of this document.
Let's say the claims make the token more secure against advisories;
if you are curious, google for the details later.

~~~javascript
jwtBuilder.setIssuedAt().setAudience('thai-document.slime.systems')
~~~

The `aud` (Audience) claim should be fixed to "thai-document.slime.systems" value.

Then, construct the header; we use `HS256` (HMAC-SHA-256) algorithm for token signing with `kid` (Key ID) received from
the customer portal.

~~~javascript
jwtBuilder.setProtectedHeader({
  typ: 'JWT',
  alg: 'HS256',
  kid: keyId,
})
~~~

Then, sign the token with our shared secret.

~~~javascript
const jwt = jwtBuilder.sign(secret);
~~~

Combining it all, you'll get what you see in [examples/hello/index.js](../examples/hello/index.js).

### Other languages

For other languages, it is just the same principle but different syntaxes.

In fact, we don't use javascript as our primary backend language;
we made the example in the language because we hoped it would provide you with a quick way to try things out.
