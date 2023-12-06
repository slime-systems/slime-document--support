# Guides

## Introduction

Slime Document assists in document generation, secure storage, and effective management.  
Our service is delivered through well-architected and carefully designed APIs.

## Authentication & Getting Started

### Getting your hands dirty

Begin by downloading or cloning this repository to your workstation.  
Specifically, focus on the hello example located at [./examples/hello](../examples/hello).

~~~sh
CLONE_TO=slime-document-examples; \
git clone https://github.com/slime-systems/slime-document--support.git $CLONE_TO && \
cd "$CLONE_TO/examples/hello"
~~~

Assuming you have Node.js and npm installed, proceed to run the example:

~~~sh
npm install && npm start
~~~

If you encounter an error similar to the following JSON response:

~~~json
{
  "exception": {
    "code": "JWT::KeyNotFound"
  }
}
~~~

Congratulations, you are now successfully connected to the API.

### Setting API Credentials

Inspect the file at [./index.js](../examples/hello/index.js) on your machine.  
Set the variables to the actual API credentials from your projects.

~~~javascript
const projectId = 123456;
const keyId = 'k1234';
const secret = 'Bl9j0NXcWz70VMqxzk3Psk1ZAwQ6Pa5xlT9EHucd';
~~~

#### Where to Find the Credentials?

After logging into the customer portal,
go to the project dashboard,
and generate an API key from the "API Keys" section.

Don't have a project yet?  
Create a project now by clicking on the "New Project" link.

#### Testing the credentials

You can editing [./index.js](../examples/hello/index.js) and rerun the hello example as many times as you want.

~~~sh
npm start
~~~

A successful API response will look like:

~~~json
{
  "data": {
    "hello": "Sekai"
  }
}
~~~

Congratulations, you are now authenticated with the API.

## Understand Authentication

To implement authentication in your language of choice, it's essential to understand the example.  
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

We use the industry-standard, [JWT](https://jwt.io/),
for API authentication due to [support from communities of many programming languages](https://jwt.io/libraries).

Encoding the command into a payload is as simple as choosing your preferred JWT library and passing in the parameters.

In the code example, we want to call the "hello" command passing the name as the only parameter.
By [reading the API document](./api.md#test-hello), you will find out that the "hello" command corresponds to the "
test/hello" API subject;
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

Then, set `iat` and `aud` claims for the JWT;
the technical details of what they are for are out of the scope of this document.
Let's say the claims make the token more secure against advisories;
if you are curious, Google for the details later.

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
For other languages, it follows the same principle but with different syntaxes.

In fact, we don't use JavaScript as our primary backend language;
we made the example in the language because we hoped it would provide you with a quick way to try things out.
