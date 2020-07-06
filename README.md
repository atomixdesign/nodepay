[![Build Status](https://travis-ci.com/atomixdesign/nodepay.svg?branch=master)](https://travis-ci.com/atomixdesign/nodepay)
[![npm (scoped)](https://img.shields.io/npm/v/@atomixdesign/nodepay)](https://www.npmjs.com/package/@atomixdesign/nodepay)
[![GitHub issues](https://img.shields.io/github/issues/atomixdesign/nodepay)](https://github.com/atomixdesign/nodepay/issues)

# Nodepay

A payment gateway abstraction layer written in Typescript, taking inspiration from
[Omnipay](https://omnipay.thephpleague.com/) & [Active Merchant](http://activemerchant.org/)

## Installation

Install the base package with:

`npm install @atomixdesign/nodepay/core`

**or**

`yarn add @atomixdesign/nodepay/core`

Then install <ins>adapters</ins> for popular payment gateways:

`npm install @atomixdesign/nodepay/ezidebit`

`npm install @atomixdesign/nodepay/payway`

Nodepay also has full support for **TypeScript** and includes and exposes all its type declarations.

## Requirements
:warning: **most merchant gateways require full compliance with PCI DSS for any operation involving sensitive information.**

In order to use nodepay, you *must* ensure that any such action within your own application also meets the requirements of PCI DSS, and where applicable, you must obtain written permission, and provide proof of your compliance to the gateway provider.

**However** most merchant gateways also provide escape hatches in the form of client-side infrastructure. For example, Payway offers a solution called [**Trusted Frame**](https://www.payway.com.au/docs/rest.html#tutorials) that enables you to handle credit cards without ever transporting credit card information.

You can find more information about PCI DSS from:
https://www.pcisecuritystandards.org/
https://www.pcicomplianceguide.org/faq/

## Usage

**javascript**
```javascript
import { CreditCard } from 'nodepay'
import {
  Adapter as EzidebitAdapter,
} from '@atomixdesign/nodepay/ezidebit'

const creditCard = new CreditCard({
  number: '123456789',
  nameOnCard: 'John Doe',
  expiryMonth: '17',
  expiryYear: '29',
  cvv: '0000',
});

nodepay.strict(); // Enable strict mode to report warnings about PCI compliance

const adapter = EzidebitAdapter({
    clientId: '000-0000',
    secretKey: 'yourSecretAPIKey',
    publicKey: 'yourPublicAPIKey',
    apiRoot: '',
});
const gateway = nodepay.createGateway(EzidebitAdapter);
const charge = gateway.createCharge(
  amountInCents: 100,
  customerRef: 'xxx-yyy-zzz',
  orderNumber: '100-117-2541',
);

gateway
  .makePayment(creditCard, charge)
  .then((response) => {
    console.dir(response);
  }).catch((exception) => {
    //... handle API exception
  });

```

## License
[MIT](LICENSE.md)

## Contributors

...
