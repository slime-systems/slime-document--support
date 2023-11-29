# Guides

## Introduction

Slime Document helps you generate documents, store them securely, and manage them effectively.
We offer the service through architectured and well-thought-out APIs.

## Authentication & Getting Started

### Getting your hands dirty

Download or clone this repository to your workstation; we are interested in specifically the hello example resided at [./examples/hello](../examples/hello).
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

You may now examine the file at [./index.js](../examples/hello/index.js) on your machine and set the variables to the real API credentials from your projects.

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

You could rerun the hello example as many times as you want after editing [./index.js](../examples/hello/index.js) on your machine.

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
