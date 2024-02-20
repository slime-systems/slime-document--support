# Easy Integration

## Objectives
Easiest and quick method for integrating with Slime Document.  
If this is your first time integrating, this is the recommended default.

## Scenario Overview
* Customers place orders for products or services through your application or website.
* Fulfill the product or service, ensuring stock availability or service delivery.
* Utilize our API to issue a blank tax invoice (a type of abbreviated tax invoice).
* Deliver the generated document through your application or website.
* A blank tax invoice is an abbreviated tax invoice that can be converted to a full tax invoice at any time. We will assist your customer in such cases; no additional action is required from your end.

## Relevant APIs and remarks
1. Issuing a blank tax invoice: [Simple Transaction: Initiate with Abbreviated Tax Invoice](../api.md#simple-transaction-initiate-with-abbreviated-tax-invoice).
   * A blank tax invoice is an abbreviated tax invoice with a document theme supporting customer operations. 
     * `retail-hatsu` is a common theme supporting a blank tax invoice; it is also the first theme and the recommended one endorsed by Slime Document.
     * Pro tip: `retail-hatsu` also supports color customizations.
2. After issuance, a link to the generated document can be displayed starting by retrieving the generation status with the `show transaction` API: [Trading Transaction: Show](../api.md#trading-transaction-show).
   * Recommend parameter: `include_documents` = `latest`
   * There are two scenarios when displaying a link to the generated document:
     * If document generation is completed, the `show transaction` API will respond with the `documents` field (See step 3).
     * If generation is not complete yet (no `documents` field), and you still want to display a link to the document (See step 4).
3. In the generation completed scenario:
   * The download link to the document can be displayed on your application or website.
   * The download link should points to your backend with `document_id` (`documents[].id` received in step 2).
   * Once your backend receives the `document_id`, call the download PDF API: [Trading Document: Download PDF](../api.md#trading-document-download-pdf).
     * Recommended parameter: `redirect` = false
   * Slime Document will respond with the file location. Your backend can now redirect your customer to the location.
     * Note that the location received is temporary and will expire in one minute. This should not be an issue since the customer will be redirected right away.
4. In the scenario where the document is still generating, but you want to display the link:
   * Use the `service_url` field received in step 2 as a customer-facing frontend and display the link from your website or application.
     * Note that this URL is confidential and permanent; it should only be exposed to you and the customer who placed the order.

## Communication is the key

Feel free to [ask a question](https://github.com/slime-systems/slime-document--support/discussions) when you have anything in mind.
