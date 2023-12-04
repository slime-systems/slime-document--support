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
it is suitable for programming consumption.  
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
 JWT::DecodeError       | General JWT decode issues; this exception code shoud accompanied with a useful message for debugging.                                                       
 JWT::SchemaViolation   | Some of the fields is not conformed to agreed format at the JWT level.                                                                                      

</details>

## Test API

APIs for testing your API connections and authentications

### Test: Hello

API Subject: `test/hello`
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

<details>
  <summary>parameters</summary>

 Name | Type   | Required | Remarks 
 ------|--------|----------|---------
 name | String | true     | <N/A>   

</details>

## Simple Transaction API

APIs for a trading transaction that only requires a single document once it is settled

### Simple Transaction: Initiate with Receipt

Initiate a transaction and generate the receipt document correspond with the transaction.

API Subject: `simple-transaction/initiate-with-receipt`
<details>
  <summary>example payload</summary>

~~~json
{
  "sub": "simple-transaction/initiate-with-receipt",
  "data": {
    "transaction_id": "TEST-RECEIPT-0001",
    "document": {
      "issued_at": "2023-11-30T17:00:00Z",
      "buyer_info": {
        "name": "เมธี วัชรีเมาคลีกระโทก",
        "identity": {
          "type": "NIDN",
          "national_id_number": "1234567851231"
        },
        "address": {
          "country_id": "TH",
          "post_code": "20180",
          "changwat_id": "20",
          "amphoe_id": "2009",
          "tambon_id": "200905",
          "street_name": "ถนนข่าวสาร",
          "soi": "ตรอกไดแอกอน",
          "building_number": "123/456"
        }
      },
      "line_items": [
        {
          "name": "ข้าวโพดปิ้ง",
          "unit_price": "15",
          "quantity": "5"
        }
      ]
    },
    "customization": {
      "theme": {
        "id": "retail-hatsu",
        "color": "#cd0czb"
      }
    }
  }
}
~~~

</details>

<details>
  <summary>example response</summary>

~~~json
{
  "data": {
    "success": true
  }
}
~~~

</details>

<details>
  <summary>parameters</summary>

There are tons of information surrounding the standard; it is intended to be used as a universal
all-purposed representation of as many use cases as possible.

And we have to admit we really can't write about every rule mentioned in the standard here or we are just writing
another standard.
However, we perform reasonable validations on your inputs to ensure they can be represented in the format specified by
the standard.

__We would highly recommend__ starting with the example, and if you think our APIs don't support your use cases, you can
always contact us in [the discussions section](https://github.com/slime-systems/slime-document--support/discussions).
We are positive that we will have a good solution for you.

 Name                                            | Type                 | Required    | Remarks                                                                                                                                                                                                                                                                                                                                 
 -------------------------------------------------|----------------------|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 transaction_id                                  | String               | true        | Client-generated transaction ID;<br>must be unique within the project;<br>__accepted regex pattern:__ `/^[-_\/a-zA-Z0-9]+$/`;<br>__max length:__ 30                                                                                                                                                                                     
 document                                        | JSON Object          | true        | The data of the receipt to be generated                                                                                                                                                                                                                                                                                                 
 document.ref                                    | String               | false       | Client-generated document reference;<br>must be unique within the transaction;<br>__default value:__ `<the sequence of the document in the transaction>`;<br> A pair of `transaction_id` and `ref` can be used to refer to a document in other API. If you don't set the `ref`, you have to rely on soon-to-be-generated `document_id`. 
 document.buyer_info                             | JSON Object          | true        | <N/A>                                                                                                                                                                                                                                                                                                                                   
 document.buyer_info.name                        | String               | true        | <N/A>                                                                                                                                                                                                                                                                                                                                   
 document.buyer_info.identity                    | JSON Object          | true        | Legal identity of the buyer                                                                                                                                                                                                                                                                                                             
 document.buyer_info.identity.type               | String               | true        | One of: __TXID__ (Tax ID, for juristic persons), __NIDN__ (National ID Number, for Thai Citizen), __CCPT__ (Passport Number) __OTHR__ (Other, custom ID)                                                                                                                                                                                
 document.buyer_info.identity.tax_id             | String               | conditional | __accepted regex pattern:__ `/^\d{13}$/`                                                                                                                                                                                                                                                                                                
 document.buyer_info.identity.branch_id          | String               | false       | __accepted regex pattern:__ `/^\d{5}$/`                                                                                                                                                                                                                                                                                                 
 document.buyer_info.identity.national_id_number | String               | conditional | __accepted regex pattern:__ `/^\d{13}$/`                                                                                                                                                                                                                                                                                                
 document.buyer_info.identity.passport_number    | String               | conditional | __accepted regex pattern:__ `/^[a-zA-Z0-9]+$/`                                                                                                                                                                                                                                                                                          
 document.buyer_info.identity.other_id           | String               | conditional | <N/A>                                                                                                                                                                                                                                                                                                                                   
 document.buyer_info.email                       | String               | false       | <N/A>                                                                                                                                                                                                                                                                                                                                   
 document.buyer_info.phone_number                | String               | false       | <N/A>                                                                                                                                                                                                                                                                                                                                   
 document.buyer_info.address                     | JSON Object          | conditional | <N/A>                                                                                                                                                                                                                                                                                                                                   
 document.buyer_info.address.country_id          | String               | true        | ISO 3166-1 alpha-2 country code                                                                                                                                                                                                                                                                                                         
 document.buyer_info.address.post_code           | String               | true        | <N/A>                                                                                                                                                                                                                                                                                                                                   
 document.buyer_info.address.changwat_id         | String               | conditional | Thailand's Changwat code                                                                                                                                                                                                                                                                                                                
 document.buyer_info.address.amphoe_id           | String               | conditional | Thailand's Amphoe code                                                                                                                                                                                                                                                                                                                  
 document.buyer_info.address.tambon_id           | String               | conditional | Thailand's Tambon code                                                                                                                                                                                                                                                                                                                  
 document.buyer_info.address.moo                 | String               | false       | <N/A>                                                                                                                                                                                                                                                                                                                                   
 document.buyer_info.address.moo_barn            | String               | false       | <N/A>                                                                                                                                                                                                                                                                                                                                   
 document.buyer_info.address.street_name         | String               | false       | <N/A>                                                                                                                                                                                                                                                                                                                                   
 document.buyer_info.address.soi                 | String               | false       | <N/A>                                                                                                                                                                                                                                                                                                                                   
 document.buyer_info.address.building_name       | String               | false       | <N/A>                                                                                                                                                                                                                                                                                                                                   
 document.buyer_info.address.building_number     | String               | false       | <N/A>                                                                                                                                                                                                                                                                                                                                   
 document.buyer_info.address.floor               | String               | false       | <N/A>                                                                                                                                                                                                                                                                                                                                   
 document.buyer_info.address.room                | String               | false       | <N/A>                                                                                                                                                                                                                                                                                                                                   
 document.buyer_info.address.line1               | String               | conditional | <N/A>                                                                                                                                                                                                                                                                                                                                   
 document.buyer_info.address.line2               | String               | false       | <N/A>                                                                                                                                                                                                                                                                                                                                   
 document.line_items                             | Array\<JSON Object\> | true        | List of items involved in the trading transactions;<br>__min size:__ 1;<br>__max size:__ 1,000                                                                                                                                                                                                                                          
 document.line_items[].product_id                | String               | false       | <N/A>                                                                                                                                                                                                                                                                                                                                   
 document.line_items[].name                      | String               | true        | <N/A>                                                                                                                                                                                                                                                                                                                                   
 document.line_items[].description               | String               | false       | <N/A>                                                                                                                                                                                                                                                                                                                                   
 document.line_items[].unit_price                | Decimal as String    | true        | Do not sent float via JSON; it is a lossy format                                                                                                                                                                                                                                                                                        
 document.line_items[].quantity                  | Decimal as String    | true        | Do not sent float via JSON; it is a lossy format                                                                                                                                                                                                                                                                                        
 document.line_items[].unit_code                 | String               | false       | Unit code listed in UN/CEFACT Recommendation No. 20                                                                                                                                                                                                                                                                                     
 document.issued_at                              | String               | false       | ISO-8601-formatted timestamp of the time the trading transaction was settled; it can be in the past or present, but it wouldn't make much sense to be in the future.                                                                                                                                                                    
 document.theme_parameters                       | JSON Object          | conditional | Theme-specific parameters, you should not sent the parameters unless specified by the theme you are using.                                                                                                                                                                                                                              
 customization                                   | JSON Object          | true        | Customization for the trading trasaction; it is required because, at least, you must pick a theme (skin) for the documents.                                                                                                                                                                                                             
 customization.theme                             | JSON Object          | true        | <N/A>                                                                                                                                                                                                                                                                                                                                   
 customization.theme.id                          | String               | true        | Theme ID                                                                                                                                                                                                                                                                                                                                
 customization.quirks                            | JSON Object          | false       | Options for customize beyond standards; AKA: non-standard customizations; should be left blank in generals but please contact us when you have a challenge you cannot overcome by standard means.                                                                                                                                       
 tags                                            | Array\<String\>      | false       | The transaction can be tagged; similar to hash tags, you can filter your transactions by a tag;<br>__min size:__ 0;<br>__max size:__ 2                                                                                                                                                                                                  

</details>

<details>
  <summary>Possible exception codes</summary>

 Code                           | Description                                                                                                                                               
 --------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
 SchemaViolation                | <N/A>                                                                                                                                                     
 Certificate::NotReady          | <N/A>                                                                                                                                                     
 Fund::InsufficientBalance      | Please top up your account                                                                                                                                
 Trade::Initiated               | The trading transaction with the supplied `transaction_id` already existed.                                                                               
 Trade::DocumentExists          | The document with `transaction_id` and `ref` pair already existed. This exception let you add idempotency to your document generation by given its `ref`. 
 Seller::NotConfigured          | Seller info not ready                                                                                                                                     
 Buyer::InvalidEmail            | <N/A>                                                                                                                                                     
 Buyer::InvalidPhoneNumber      | <N/A>                                                                                                                                                     
 Buyer::InvalidCountry          | <N/A>                                                                                                                                                     
 Buyer::InvalidPostcode         | <N/A>                                                                                                                                                     
 Buyer::InvalidChangwat         | <N/A>                                                                                                                                                     
 Buyer::InvalidAmphoe           | <N/A>                                                                                                                                                     
 Buyer::InvalidTambon           | <N/A>                                                                                                                                                     
 Buyer::AmphoeNotInChangwat     | <N/A>                                                                                                                                                     
 Buyer::TambonNotInAmphoe       | <N/A>                                                                                                                                                     
 LineItems::InvalidUnitCode     | <N/A>                                                                                                                                                     
 Theme::NotFound                | <N/A>                                                                                                                                                     
 Theme::UnsupportedDocumentType | <N/A>                                                                                                                                                     
 Theme::UnsupportedLanguage     | <N/A>                                                                                                                                                     

</details>

## Trading Transaction API

APIs for a trading transaction in generals

### Trading Transaction: Show

Show transaction info by `transaction_id`.

<details>
  <summary>example payload</summary>

~~~json
{
  "sub": "trading-transaction/show",
  "data": {
    "transaction_id": "TEST-TRANSACTION-0001",
    "include_documents": "latest"
  }
}
~~~

</details>

<details>
  <summary>example response</summary>

~~~json
{
  "data": {
    "id": "TEST-TRANSACTION-0001",
    "initiated_at": "2023-11-20T11:38:57Z",
    "trade_value": "90.0",
    "tags": [],
    "system_tags": [
      "NIDN:1234567851234"
    ],
    "storage_used": 120171,
    "documents": [
      {
        "id": "TEST-TRANSACTION-0001D1",
        "sequence": 1,
        "ref": "1",
        "ready": true,
        "xml_size": 12942,
        "pdf_size": 107229
      }
    ]
  }
}
~~~

</details>


<details>
  <summary>parameters</summary>

 Name              | Type           | Required | Remarks                                                                                                                                                                                                                                                                                                                                       
 -------------------|----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 transaction_id    | String         | true     | <N/A>                                                                                                                                                                                                                                                                                                                                         
 include_documents | Enum\<String\> | false    | __"latest"__: include the latest document of the transactions; __"readied"__: include documents readied to be view or download; __"all"__: include all documents of the transaction; __Omit the parameter__ if you don't want to include data about the documents, which will save you some bandwidth and having slightly better performance. 

</details>

### Trading Transaction: Set Tags

Set tags on the transaction so it can be filtered.

Alternatives:

* Tags can be set on the transaction initiation which should be preferred than setting it afterward.
* Don't use tags at all, customize and manage everything yourself and associate with us through `transaction_id`.

See also:
* [List by Tag](#trading-transaction-list-by-tag)

API Subject: `trading-transaction/set-tags`
<details>
  <summary>example payload</summary>

~~~json
{
  "sub": "trading-transaction/set-tags",
  "data": {
    "transaction_id": "TEST-TRANSACTION-0001",
    "tags": [
      "order_id:314159",
      "customer_id:265358"
    ]
  }
}
~~~

</details>

<details>
  <summary>example response</summary>

~~~json
{
  "data": {
    "success": true
  }
}
~~~

</details>

<details>
  <summary>parameters</summary>

 Name           | Type            | Required | Remarks                                                     
 ----------------|-----------------|----------|-------------------------------------------------------------
 transaction_id | String          | true     | <N/A>                                                       
 tags           | Array\<String\> | true     | __maximum array length:__ 2; __maximum string length:__ 255 

</details>

### Trading Transaction: List By Tag

List transactions by a tag.  
The tag used for filtering can be a user-supplied tag or a system tag.

Limitation:

* You can only filter using a single tag.
* The response is limited to 1,000 transactions; which should suffice for common use cases.

Alternatives:

* If you have complex or uncommon requirements you can also and manage everything in your backend and associate with us
  through `transaction_id` ditching tags-related APIs altogether.

See also:
* [Set Tags](#trading-transaction-set-tags)

API Subject: `trading-transaction/set-tags`
<details>
  <summary>example payload</summary>

~~~json
{
  "sub": "trading-transaction/list-by-tag",
  "data": {
    "tag": "NIDN:1234567851234",
    "include_pending": true
  }
}
~~~

</details>

<details>
  <summary>example response</summary>

~~~json
{
  "data": {
    "transactions": [
      {
        "id": "TEST-TRANSACTION-001",
        "initiated_at": "2023-11-20T11:35:36Z",
        "trade_value": "42.0",
        "tags": [],
        "system_tags": [
          "NIDN:1234567851234"
        ],
        "storage_used": 120099
      },
      {
        "id": "TEST-TRANSACTION-002",
        "initiated_at": "2023-11-20T11:38:57Z",
        "trade_value": "60.0",
        "tags": [],
        "system_tags": [
          "NIDN:1234567851234"
        ],
        "storage_used": 120219
      },
      {
        "id": "TEST-TRANSACTION-003",
        "initiated_at": "2023-11-20T11:41:30Z",
        "trade_value": "120.0",
        "tags": [],
        "system_tags": [
          "NIDN:1234567851234"
        ],
        "storage_used": 120068
      }
    ]
  }
}
~~~

</details>

<details>
  <summary>parameters</summary>

 Name              | Type           | Required | Remarks                                                                                                                                                                                                                                                                                                                                       
 -------------------|----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 tag               | String         | true     | <N/A>                                                                                                                                                                                                                                                                                                                                         
 include_documents | Enum\<String\> | false    | __"latest"__: include the latest document of the transactions; __"readied"__: include documents readied to be view or download; __"all"__: include all documents of the transaction; __Omit the parameter__ if you don't want to include data about the documents, which will save you some bandwidth and having slightly better performance. 
 include_pending   | Boolean        | false    | Weather you want the transaction without generated document or not; __true:__ the transaction without generated document should be included; __default value:__ false
</details>

