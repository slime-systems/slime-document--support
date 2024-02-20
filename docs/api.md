# API Document

## Pro Tip

- Check [How to read the API reference?](https://github.com/slime-systems/slime-document--support/discussions/2) before
  continue.

## API Request Format

The request payload consists of an __API Subject__ and __parameters__
encapsulated as `sub` and `data` claims of a JSON Web Token, respectively.
It resembles the following example:

~~~json
{
  "sub": "***API Subject***",
  "data": {
    "param1": "value of param1",
    "param2": "value of param2"
  }
}
~~~

Refer to [the guide](./guides.md#understand-the-authentication) to understand the format of encoded request payloads.

## API Response Format

### Success Response

The success response returns with the HTTP status code `200` and the JSON body resembling the following example:

~~~json
{
  "data": {
    "hello": "Sekai"
  }
}
~~~

Unless otherwise specified, the `data` value should be a JSON object.
The actual value of `data` can vary between APIs.

### Exception Response

The exception response returns with the HTTP status code of `422` and the JSON body resembling the following example:

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

Unless otherwise specified, the value of the `exception` should be a JSON object.  
The `code` is an exception code conveying meaning to humans and machines alike,
suitable for programming consumption.  
We won't change exception codes for aesthetic reasons.

Sometimes, the exception will be accompanied by `message` to help developers pinpoint the issue.
And sometimes, it may be accompanied by `metadata` for programming consumption.

An exception code is always available in an exception response.

## API Authentication

If you are looking for explanations, refer to [the guide](./guides.md#understand-the-authentication) covering the topic.
The info in this document is more of a reference than a guide.

<details>
  <summary>exception codes</summary>

| Code                   | Description                                                                                                                                           |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| JWT::KeyNotFound       | The `kid` specified in the JWT header can't be found in the system. Also, check the API endpoint because each project has a different API endpoint.   |
| JWT::IATDrift          | The `iat` claim in the JWT drifts beyond the acceptable period. The token may be stale, or the system's clock used to generate the token is unusable. |
| JWT::InvalidSubject    | Unrecognized `API subject` specified.                                                                                                                 |
| JWT::VerificationError | Mainly invalid signature; check the secret key and API endpoint.                                                                                      |
| JWT::DecodeError       | General JWT decode issues; this exception code should be accompanied by a useful message for debugging.                                               |
| JWT::SchemaViolation   | Some fields do not conform to the agreed format at the JWT level.                                                                                     |

</details>

## Test API

APIs for testing your API connections and authentications.

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

| Name | Type   | Required | Remarks |
|------|--------|----------|---------|
| name | String | true     | <N/A>   |

</details>

## Simple Transaction API

APIs for a trading transaction that requires a document once it is settled.

### Simple Transaction: Initiate with Abbreviated Tax Invoice

Initiate a transaction and generate an abbreviated tax invoice.

API Subject: `simple-transaction/initiate-with-abbreviated-tax-invoice`
<details>
  <summary>example payload</summary>

~~~json
{
  "sub": "simple-transaction/initiate-with-abbreviated-tax-invoice",
  "data": {
    "transaction_id": "TEST-ES-0001",
    "document": {
      "issued_at": "2023-11-30T17:00:00Z",
      "line_items": [
        {
          "name": "ข้าวโพดปิ้ง",
          "unit_price": "15",
          "quantity": "8",
          "vatable": true
        },
        {
          "name": "ไข่ต้ม",
          "unit_price": "6",
          "quantity": "10",
          "vatable": true
        },
        {
          "name": "ข้าวสาร",
          "unit_price": "220",
          "quantity": "1",
          "vatable": false
        }
      ]
    },
    "customization": {
      "theme": {
        "id": "retail-hatsu",
        "color": "#cd0c2b"
      },
      "vat_included": false,
      "vat_rate": "0.07"
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

There is tons of information surrounding the standard,
as it is intended to be used as a universal all-purposed representation of as many use cases as possible.

And we have to admit we really can't write about every rule mentioned in the standard here,
or we are just writing another standard.

However, we perform reasonable validations on your inputs to ensure they can be represented in the format specified by
the standard.

__We would highly recommend__ starting with the example, and if you think our APIs don't support your use cases,
you can always contact us
in [the discussions section](https://github.com/slime-systems/slime-document--support/discussions).
We are positive that we will have a good solution for you.

| Name                              | Type                 | Required    | Remarks                                                                                                                                                                                                                      |
|-----------------------------------|----------------------|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| transaction_id                    | String               | true        | Client-generated transaction ID;<br>must be unique within the project;<br>__accepted regex pattern:__ `/^[-_\/a-zA-Z0-9]+$/`;<br>__max length:__ 30                                                                          |
| document                          | JSON Object          | true        | The data of the receipt to be generated                                                                                                                                                                                      |
| document.ref                      | String               | false       | Client-generated document reference;<br>must be unique within the transaction; this will be used as an [idempotency](https://en.wikipedia.org/wiki/Idempotence) key if you required one. Otherwise, you may leaves it blank. |
| document.line_items               | Array\<JSON Object\> | true        | List of items involved in the trading transactions;<br>__min size:__ 1;<br>__max size:__ 1,000                                                                                                                               |
| document.line_items[].product_id  | String               | false       | <N/A>                                                                                                                                                                                                                        |
| document.line_items[].name        | String               | true        | <N/A>                                                                                                                                                                                                                        |
| document.line_items[].description | String               | false       | <N/A>                                                                                                                                                                                                                        |
| document.line_items[].unit_price  | Decimal as String    | true        | Do not sent float via JSON; it is a lossy format                                                                                                                                                                             |
| document.line_items[].quantity    | Decimal as String    | true        | Do not sent float via JSON; it is a lossy format                                                                                                                                                                             |
| document.line_items[].unit_code   | String               | false       | Unit code listed in UN/CEFACT Recommendation No. 20                                                                                                                                                                          |
| document.issued_at                | String               | false       | ISO-8601-formatted timestamp of the time when the trading transaction was settled; it can be in the past or present, but it wouldn't make much sense to be in the future.                                                    |
| document.theme_parameters         | JSON Object          | conditional | Theme-specific parameters, you should not sent the parameters unless specified by the theme you are using.                                                                                                                   |
| customization                     | JSON Object          | true        | Customization for the trading trasaction; it is required because, at least, you must pick a theme (skin) for the documents.                                                                                                  |
| customization.theme               | JSON Object          | true        | <N/A>                                                                                                                                                                                                                        |
| customization.theme.id            | String               | true        | Theme ID                                                                                                                                                                                                                     |
| customization.vat_included        | Boolean              | true        | <N/A>                                                                                                                                                                                                                        |
| customization.vat_rate            | Decimal as String    | true        | For 7% VAT, please inputs "0.07"                                                                                                                                                                                             |
| tags                              | Array\<String\>      | false       | The transaction can be tagged; similar to hashtags, you can filter your transactions by a tag;<br>__min size:__ 0;<br>__max size:__ 2                                                                                        |

</details>
<details>
  <summary>exception codes</summary>

| Code                           | Description                                                                      |
|--------------------------------|----------------------------------------------------------------------------------|
| SchemaViolation                | <N/A>                                                                            |
| Certificate::NotReady          | <N/A>                                                                            |
| Fund::InsufficientBalance      | Please top up your account                                                       |
| Trade::Initiated               | The trading transaction with the supplied `transaction_id` already existed.      |
| Seller::NotConfigured          | Seller info not ready                                                            |
| LineItems::InvalidUnitCode     | <N/A>                                                                            |
| Theme::NotFound                | <N/A>                                                                            |
| Theme::UnsupportedDocumentType | The theme selected does not support this document type (abbreviated tax invoice) |
| Theme::UnsupportedLanguage     | The theme selected does not support the language you configured                  |

</details>

### Simple Transaction: Initiate with Receipt

Initiate a transaction and generate the receipt document corresponding to the transaction.

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

There is tons of information surrounding the standard,
as it is intended to be used as a universal all-purposed representation of as many use cases as possible.

And we have to admit we really can't write about every rule mentioned in the standard here,
or we are just writing another standard.

However, we perform reasonable validations on your inputs to ensure they can be represented in the format specified by
the standard.

__We would highly recommend__ starting with the example, and if you think our APIs don't support your use cases,
you can always contact us
in [the discussions section](https://github.com/slime-systems/slime-document--support/discussions).
We are positive that we will have a good solution for you.

| Name                                            | Type                 | Required    | Remarks                                                                                                                                                                                                                      |
|-------------------------------------------------|----------------------|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| transaction_id                                  | String               | true        | Client-generated transaction ID;<br>must be unique within the project;<br>__accepted regex pattern:__ `/^[-_\/a-zA-Z0-9]+$/`;<br>__max length:__ 30                                                                          |
| document                                        | JSON Object          | true        | The data of the receipt to be generated                                                                                                                                                                                      |
| document.ref                                    | String               | false       | Client-generated document reference;<br>must be unique within the transaction; this will be used as an [idempotency](https://en.wikipedia.org/wiki/Idempotence) key if you required one. Otherwise, you may leaves it blank. |
| document.buyer_info                             | JSON Object          | true        | <N/A>                                                                                                                                                                                                                        |
| document.buyer_info.name                        | String               | true        | <N/A>                                                                                                                                                                                                                        |
| document.buyer_info.identity                    | JSON Object          | true        | Legal identity of the buyer                                                                                                                                                                                                  |
| document.buyer_info.identity.type               | String               | true        | One of: __TXID__ (Tax ID, for juristic persons), __NIDN__ (National ID Number, for Thai Citizen), __CCPT__ (Passport Number) __OTHR__ (Other, custom ID)                                                                     |
| document.buyer_info.identity.tax_id             | String               | conditional | __accepted regex pattern:__ `/^\d{13}$/`                                                                                                                                                                                     |
| document.buyer_info.identity.branch_id          | String               | false       | __accepted regex pattern:__ `/^\d{5}$/`                                                                                                                                                                                      |
| document.buyer_info.identity.national_id_number | String               | conditional | __accepted regex pattern:__ `/^\d{13}$/`                                                                                                                                                                                     |
| document.buyer_info.identity.passport_number    | String               | conditional | __accepted regex pattern:__ `/^[a-zA-Z0-9]+$/`                                                                                                                                                                               |
| document.buyer_info.identity.other_id           | String               | conditional | <N/A>                                                                                                                                                                                                                        |
| document.buyer_info.email                       | String               | false       | <N/A>                                                                                                                                                                                                                        |
| document.buyer_info.phone_number                | String               | false       | <N/A>                                                                                                                                                                                                                        |
| document.buyer_info.address                     | JSON Object          | conditional | <N/A>                                                                                                                                                                                                                        |
| document.buyer_info.address.country_id          | String               | true        | ISO 3166-1 alpha-2 country code                                                                                                                                                                                              |
| document.buyer_info.address.post_code           | String               | true        | <N/A>                                                                                                                                                                                                                        |
| document.buyer_info.address.changwat_id         | String               | conditional | Thailand's Changwat code                                                                                                                                                                                                     |
| document.buyer_info.address.amphoe_id           | String               | conditional | Thailand's Amphoe code                                                                                                                                                                                                       |
| document.buyer_info.address.tambon_id           | String               | conditional | Thailand's Tambon code                                                                                                                                                                                                       |
| document.buyer_info.address.moo                 | String               | false       | <N/A>                                                                                                                                                                                                                        |
| document.buyer_info.address.moo_barn            | String               | false       | <N/A>                                                                                                                                                                                                                        |
| document.buyer_info.address.street_name         | String               | false       | <N/A>                                                                                                                                                                                                                        |
| document.buyer_info.address.soi                 | String               | false       | <N/A>                                                                                                                                                                                                                        |
| document.buyer_info.address.building_name       | String               | false       | <N/A>                                                                                                                                                                                                                        |
| document.buyer_info.address.building_number     | String               | false       | <N/A>                                                                                                                                                                                                                        |
| document.buyer_info.address.floor               | String               | false       | <N/A>                                                                                                                                                                                                                        |
| document.buyer_info.address.room                | String               | false       | <N/A>                                                                                                                                                                                                                        |
| document.buyer_info.address.line1               | String               | conditional | <N/A>                                                                                                                                                                                                                        |
| document.buyer_info.address.line2               | String               | false       | <N/A>                                                                                                                                                                                                                        |
| document.line_items                             | Array\<JSON Object\> | true        | List of items involved in the trading transactions;<br>__min size:__ 1;<br>__max size:__ 1,000                                                                                                                               |
| document.line_items[].product_id                | String               | false       | <N/A>                                                                                                                                                                                                                        |
| document.line_items[].name                      | String               | true        | <N/A>                                                                                                                                                                                                                        |
| document.line_items[].description               | String               | false       | <N/A>                                                                                                                                                                                                                        |
| document.line_items[].unit_price                | Decimal as String    | true        | Do not sent float via JSON; it is a lossy format                                                                                                                                                                             |
| document.line_items[].quantity                  | Decimal as String    | true        | Do not sent float via JSON; it is a lossy format                                                                                                                                                                             |
| document.line_items[].unit_code                 | String               | false       | Unit code listed in UN/CEFACT Recommendation No. 20                                                                                                                                                                          |
| document.issued_at                              | String               | false       | ISO-8601-formatted timestamp of the time when the trading transaction was settled; it can be in the past or present, but it wouldn't make much sense to be in the future.                                                    |
| document.theme_parameters                       | JSON Object          | conditional | Theme-specific parameters, you should not sent the parameters unless specified by the theme you are using.                                                                                                                   |
| customization                                   | JSON Object          | true        | Customization for the trading trasaction; it is required because, at least, you must pick a theme (skin) for the documents.                                                                                                  |
| customization.theme                             | JSON Object          | true        | <N/A>                                                                                                                                                                                                                        |
| customization.theme.id                          | String               | true        | Theme ID                                                                                                                                                                                                                     |
| customization.quirks                            | JSON Object          | false       | Options for customize beyond standards; AKA: non-standard customizations; should be left blank in generals but please contact us when you have a challenge you cannot overcome by standard means.                            |
| tags                                            | Array\<String\>      | false       | The transaction can be tagged; similar to hashtags, you can filter your transactions by a tag;<br>__min size:__ 0;<br>__max size:__ 2                                                                                        |

</details>
<details>
  <summary>exception codes</summary>

| Code                           | Description                                                                      |
|--------------------------------|----------------------------------------------------------------------------------|
| SchemaViolation                | <N/A>                                                                            |
| Certificate::NotReady          | <N/A>                                                                            |
| Fund::InsufficientBalance      | Please top up your account                                                       |
| Trade::Initiated               | The trading transaction with the supplied `transaction_id` already existed.      |
| Seller::NotConfigured          | Seller info not ready                                                            |
| Buyer::InvalidEmail            | <N/A>                                                                            |
| Buyer::InvalidPhoneNumber      | <N/A>                                                                            |
| Buyer::InvalidCountry          | <N/A>                                                                            |
| Buyer::InvalidPostcode         | <N/A>                                                                            |
| Buyer::InvalidChangwat         | <N/A>                                                                            |
| Buyer::InvalidAmphoe           | <N/A>                                                                            |
| Buyer::InvalidTambon           | <N/A>                                                                            |
| Buyer::AmphoeNotInChangwat     | <N/A>                                                                            |
| Buyer::TambonNotInAmphoe       | <N/A>                                                                            |
| LineItems::InvalidUnitCode     | <N/A>                                                                            |
| Theme::NotFound                | <N/A>                                                                            |
| Theme::UnsupportedDocumentType | The theme selected does not support this document type (abbreviated tax invoice) |
| Theme::UnsupportedLanguage     | The theme selected does not support the language you configured                  |

</details>

## Trading Transaction API

APIs for trading transactions in general.

### Trading Transaction: Show

Retrieve transaction information using the `transaction_id`.

API Subject: `trading-transaction/show`
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
    "service_url": "https://app.thai-document.slime.systems/projects/1234/trading-document-interface/TEST-TRANSACTION-0001/0123456789abcdef0123456789abcdef",
    "documents": [
      {
        "id": "TEST-TRANSACTION-0001D1",
        "sequence": 1,
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
 -------------------|----------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 transaction_id    | String         | true     | <N/A>                                                                                                                                                                                                                                                                                                                   
 include_documents | Enum\<String\> | false    | - __"latest"__: include the latest document of the transaction. - __"readied"__: include documents ready to be viewed or downloaded. - __"all"__: include all documents of the transaction. - __Omit the parameter__ if you don't want to include data about the documents, saving bandwidth and improving performance. 

</details>
<details>
  <summary>exception codes</summary>

 Code     | Description 
 ----------|-------------
 NotFound | <N/A>       

</details>

### Trading Transaction: Set Tags

Assign tags to the transaction for filtering purposes.

Alternatives:

* Tags can be set during transaction initiation, which is preferred over setting them afterward.
* Ditching tags: manage everything your way and associate with us through `transaction_id`.

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
<details>
  <summary>exception codes</summary>

 Code     | Description 
 ----------|-------------
 NotFound | <N/A>       

</details>

### Trading Transaction: List By Tag

Retrieve transactions based on a specified tag.  
The tag used for filtering can be a user-supplied tag or a system tag.

Limitation:

* Only one tag per filtering.
* The response is limited to 1,000 transactions, which suffice for common use cases. Otherwise, revise your tagging
  strategy.

Alternatives:

* For complex or uncommon requirements,
  manage everything in your backend and associate with us through `transaction_id`,
  ignoring tags-related APIs.

See also:

* [Set Tags](#trading-transaction-set-tags)

API Subject: `trading-transaction/list-by-tag`
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
        "storage_used": 120099,
        "service_url": "https://app.thai-document.slime.systems/projects/1234/trading-document-interface/TEST-TRANSACTION-001/0123456789abcdef0123456789abcdef"
      },
      {
        "id": "TEST-TRANSACTION-002",
        "initiated_at": "2023-11-20T11:38:57Z",
        "trade_value": "60.0",
        "tags": [],
        "system_tags": [
          "NIDN:1234567851234"
        ],
        "storage_used": 120219,
        "service_url": "https://app.thai-document.slime.systems/projects/1234/trading-document-interface/TEST-TRANSACTION-002/0123456789abcdef0123456789abcdef"
      },
      {
        "id": "TEST-TRANSACTION-003",
        "initiated_at": "2023-11-20T11:41:30Z",
        "trade_value": "120.0",
        "tags": [],
        "system_tags": [
          "NIDN:1234567851234"
        ],
        "storage_used": 120068,
        "service_url": "https://app.thai-document.slime.systems/projects/1234/trading-document-interface/TEST-TRANSACTION-003/0123456789abcdef0123456789abcdef"
      }
    ]
  }
}
~~~

</details>
<details>
  <summary>parameters</summary>

 Name              | Type           | Required | Remarks                                                                                                                                                                                                                                                                                                                  
 -------------------|----------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 tag               | String         | true     | <N/A>                                                                                                                                                                                                                                                                                                                    
 include_documents | Enum\<String\> | false    | - __"latest"__: include the latest document of the transactions. - __"readied"__: include documents ready to be viewed or downloaded. - __"all"__: include all documents of the transaction. - __Omit the parameter__ if you don't want to include data about the documents, saving bandwidth and improving performance. 
 include_pending   | Boolean        | false    | Weather you want transactions without generated documents or not; __true:__ Include transactions without generated documents.; __default value:__ false                                                                                                                                                                  

</details>

## Trading Document API

A trading transaction may consist of one or more documents.  
Trading Document APIs facilitate direct interaction with these documents.

### Trading Document: Show

Retrieve document information by specifying the `document_id`.

API Subject: `trading-document/show`
<details>
  <summary>example payload</summary>

~~~json
{
  "sub": "trading-document/show",
  "data": {
    "document_id": "TEST-TRANSACTION-001D1"
  }
}
~~~

</details>
<details>
  <summary>example response</summary>

~~~json
{
  "data": {
    "id": "TEST-TRANSACTION-001D1",
    "transaction_id": "TEST-TRANSACTION-001",
    "sequence": 1,
    "ready": true,
    "readied_at": "2023-11-21T09:26:02Z",
    "xml_size": 12942,
    "pdf_size": 107229
  }
}
~~~

</details>
<details>
  <summary>parameters</summary>

 Name        | Type   | Required | Remarks 
 -------------|--------|----------|---------
 document_id | String | true     | <N/A>   

</details>
<details>
  <summary>exception codes</summary>

 Code     | Description 
 ----------|-------------
 NotFound | <N/A>       

</details>

### Trading Document: List by Transaction

Retrieve a list of documents in a specific transaction.

API Subject: `trading-document/list-by-transaction`
<details>
  <summary>example payload</summary>

~~~json
{
  "sub": "trading-document/list-by-transaction",
  "data": {
    "transaction_id": "TEST-TRANSACTION-001"
  }
}
~~~

</details>
<details>
  <summary>example response</summary>

~~~json
{
  "data": {
    "documents": [
      {
        "id": "TEST-TRANSACTION-001D1",
        "transaction_id": "TEST-TRANSACTION-001",
        "sequence": 1,
        "ready": true,
        "readied_at": "2023-11-21T09:26:02Z",
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

 Name           | Type   | Required | Remarks 
 ----------------|--------|----------|---------
 transaction_id | String | true     | <N/A>   

</details>

### Trading Document: Download PDF

Obtain an ephemeral document URL to download the PDF file.

Please ensure to initiate the download promptly, as the URL expires in one minute.  
There is also an option to `redirect` to the target location instead of receiving a JSON response.

See also:

* [Download XML](#trading-document-download-xml)

API Subject: `trading-document/download-pdf`
<details>
  <summary>example payload</summary>

~~~json
{
  "sub": "trading-document/download-pdf",
  "data": {
    "document_id": "TEST-TRANSACTION-001D1",
    "redirect": false
  }
}
~~~

</details>
<details>
  <summary>example response</summary>

~~~json
{
  "data": {
    "location": "https://temporary.example.com/thai-document/temporary-path-that-expires-in-1-minute"
  }
}
~~~

</details>
<details>
  <summary>parameters</summary>

 Name        | Type    | Required | Remarks                                                                                             
 -------------|---------|----------|-----------------------------------------------------------------------------------------------------
 document_id | String  | true     | <N/A>                                                                                               
 redirect    | Boolean | false    | If set to _true_, the server will redirect to the document location instead of returning JSON data. 

</details>
<details>
  <summary>exception codes</summary>

 Code     | Description                                                                         
 ----------|-------------------------------------------------------------------------------------
 NotReady | The system received the document's info, but the generation still needs to be done. 
 NotFound | <N/A>                                                                               

</details>

### Trading Document: Download XML

Obtain an ephemeral document URL to download the XML file.

Please ensure to initiate the download promptly, as the URL expires in one minute.  
There is also an option to `redirect` to the target location instead of receiving a JSON response.

See also:

* [Download PDF](#trading-document-download-pdf)

API Subject: `trading-document/download-xml`
<details>
  <summary>example payload</summary>

~~~json
{
  "sub": "trading-document/download-xml",
  "data": {
    "document_id": "TEST-TRANSACTION-001D1",
    "redirect": false
  }
}
~~~

</details>
<details>
  <summary>example response</summary>

~~~json
{
  "data": {
    "location": "https://temporary.example.com/thai-document/temporary-path-that-expires-in-1-minute"
  }
}
~~~

</details>
<details>
  <summary>parameters</summary>

 Name        | Type    | Required | Remarks                                                                                             
 -------------|---------|----------|-----------------------------------------------------------------------------------------------------
 document_id | String  | true     | <N/A>                                                                                               
 redirect    | Boolean | false    | If set to _true_, the server will redirect to the document location instead of returning JSON data. 

</details>
<details>
  <summary>exception codes</summary>

 Code     | Description                                                                         
 ----------|-------------------------------------------------------------------------------------
 NotReady | The system received the document's info, but the generation still needs to be done. 
 NotFound | <N/A>                                                                               

</details>

### Trading Document: Stream Generated

This API enables the streaming of document information upon generation.  
To initiate the streaming process, [polling for updates](https://en.wikipedia.org/wiki/Polling_(computer_science)).
The API offers fault tolerance through indefinite stream replayability.

Example use cases:

* Sending the generated PDF to your customer via email.
* Sending push notifications to your app to alert your customer when the document is ready for download.

API Subject: `trading-document/stream-generated`
<details>
  <summary>example payload</summary>

Starting the stream

~~~json
{
  "sub": "trading-document/stream-generated",
  "data": {
    "from": "2024-08-20T18:10:42Z",
    "limit": 200
  }
}
~~~

Continue the stream

~~~json
{
  "sub": "trading-document/stream-generated",
  "data": {
    "continuation_token": "eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwidHlwIjoiSldUIiwia2lkIjoic2syMzIwODkifQ..PoifQQJIrboO0PqOa5F7aQ.VyptXgCKFsT7g9Xe0O5WB4ozwIgjI5dyGYpkhC_4XKuG45Hi9IpDV76N2wJJb5rqBDCjLVqoO6WqCOmQ3ZpZ9uFPlbA5LYUQ_zvLI34pZ05_Ei1AleWlbtzR1ZjcFPw4LoTmfR9XoR-KNbGbILuD2TwHuAJoSz7oKsuaR9rNuIqwygPDjc-WWQVMKw7MmAge.BuTlj8j1agfeeQ24ipLR-A",
    "limit": 200
  }
}
~~~

</details>
<details>
  <summary>example response</summary>

~~~json
{
  "data": {
    "documents": [
      {
        "id": "TEST-TRANSACTION-001D1",
        "transaction_id": "TEST-TRANSACTION-001",
        "sequence": 1,
        "ready": true,
        "readied_at": "2023-11-21T09:26:02Z",
        "xml_size": 12942,
        "pdf_size": 107229
      }
    ],
    "continuation_token": "eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwidHlwIjoiSldUIiwia2lkIjoic2syMzIwODkifQ..e8rJxWap87J8yeGJGy--DQ.zxygE9yFNMTyd2yvMEH3brC1mObljlyds8HX0SmKC7G3zT85JGB-hVGFv4tsq6boJsRuLaWVXC781HK4P1TkXh3ROqanE5ysqoLjQjcAXHsbJCXN1Y4MUn8AyvHiE9KiM7gwqOuOXN4-JNHP1pQt8fGA3C7d_dMO4G8hEPkzYYSbqnzTFoQQX4wI3rpEwgbm.KoIa7V39Jh0eEkWaDj_4hA"
  }
}
~~~

</details>
<details>
  <summary>parameters</summary>

 Name               | Type    | Required    | Remarks                                                                                                           
 --------------------|---------|-------------|-------------------------------------------------------------------------------------------------------------------
 from               | String  | conditional | ISO-8601-formatted timestamp of the time you want to start streaming from.                                        
 continuation_token | Boolean | conditional | The token returned from the previous call; it contains a streaming cursor to continue polling for the next items. 
 limit              | Integer | false       | The limit of returned items; The value can be from 1 to 1,000; __default value:__ 100                             

Either `from` or `continuation_token` must be present in a call.
</details>
<details>
  <summary>exception codes</summary>

 Code                     | Description                                                               
 --------------------------|---------------------------------------------------------------------------
 AmbiguousInstruction     | Occurs when you set both `from` and `continuation_token` in the same call 
 InvalidContinuationToken | <N/A>                                                                     

</details>
