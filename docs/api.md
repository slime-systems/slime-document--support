# API Document

## API Request Format

The request payload consisted of an __API Subject__ and __parameters__ encapsulated as `sub` and `data` claims of a JSON
Web Token respectively.
Resemble the following example:

~~~json
{
  "sub": "***API Subject***",
  "data": {
    "param1": "value of param1",
    "param2": "value of param2"
  }
}
~~~

Please refer to [the guide](./guides.md#understand-the-authentication) to understand the format of encoded request
payloads.

## API Response Format

### Success Response

The success response will return with the HTTP status code `200` with the JSON body resembling the following example.

~~~json
{
  "data": {
    "hello": "Sekai"
  }
}
~~~

Unless otherwise specified, the "data" value should be a JSON object.
The actual value of data can vary between APIs.

### Exception Response

The exception response will return with the HTTP status code of `422` with the JSON body resembling the following
example.

~~~json
{
  "exception": {
    "code": "Document::InvalidSender",
    "message": "This message might be your good friend.",
    "metadata": {
      "useful": "info"
    }
  }
}
~~~

Unless otherwise specified, the value of the __"exception"__ should be a JSON object.
The __"code"__ is an exception code that conveys the meaning to humans and machines alike;
it is suitable for program consumption.  
We won't make a change to exception codes for aesthetic reasons.

Sometimes, the exception will be accompanied by __"message"__ to help developers pinpoint the issue.
And sometimes, it may accompanied by __"metadata"__ for programming consumptions.

An exception code is always available in an exception response.

## API Authentication

If you are looking for explanations, please refer to [the guide](./guides.md#understand-the-authentication) which covers
the topic.
The info in this document is more of a reference than a guide.

<details>
  <summary>Possible exception codes</summary>

 Code                   | Description                                                                                                                                                 
 ------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------
 JWT::KeyNotFound       | The kid specified in the JWT header can't be found in the system. You should also check the API endpoint because each project has a different API endpoint. 
 JWT::IATDrift          | The `iat` claim in the JWT drifts beyond the acceptable period. The token may be stale, or the clock on the system used to generate the token is unusable.  
 JWT::InvalidSubject    | Unrecognized `API subject` specified.                                                                                                                       
 JWT::VerificationError | Mainly invalid signature; please check: the secret key and API endpoint.                                                                                    
 JWT::DecodeError       | General JWT docode isuues; this exception code shoud accompanied with a useful message for debugging.                                                       
 JWT::SchemaViolation   | Some of the fields is not conformed to agreed format at the JWT level.                                                                                      

</details>

## Test API

an API for testing your API connections and authentications

### Test: Hello

API Subject: `test/hello`
<details>
  <summary>parameters</summary>

 Name | Type   | Required | Description        
 ------|--------|----------|--------------------
 name | String | true     | What is your name? 

</details>

<details>
  <summary>example payload</summary>

~~~json
{
  "sub": "test/hello",
  "data": {
    "name": "Sekai"
  }
}
~~~

</details>

<details>
  <summary>example response</summary>

~~~json
{
  "data": {
    "hello": "Sekai"
  }
}
~~~

</details>

## Simple Transaction API

a trade transaction that only requires a single document once it is settled

### Simple Transaction: Initiate with Receipt

Initiate a transaction and generate the receipt document correspond with the transaction.

API Subject: `simple-transaction/initiate-with-receipt`
