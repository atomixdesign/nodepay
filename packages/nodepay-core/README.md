[![Build Status](https://travis-ci.com/atomixdesign/nodepay.svg?branch=master)](https://travis-ci.com/atomixdesign/nodepay)
[![npm (scoped)](https://img.shields.io/npm/v/@atomixdesign/nodepay)](https://www.npmjs.com/package/@atomixdesign/nodepay)
[![GitHub issues](https://img.shields.io/github/issues/atomixdesign/nodepay)](https://github.com/atomixdesign/nodepay/issues)

# Nodepay

A payment gateway abstraction layer written in Typescript, taking inspiration from
[Omnipay](https://omnipay.thephpleague.com/) & [Active Merchant](http://activemerchant.org/)


## Getting Started

The API follows the Strategy Pattern, where each gateway connector provides its own way to fulfill an API (`addCustomer`, `updateCustomer`,  `charge`, etc).

```typescript
import { Context } from '@atomixdesign/nodepay'
import { Strategy, Config, Customer, CreditCard } from '@atomixdesign/nodepay-ezidebit'

const config = new Config({
  // Add your own values obtained from the gateway here ->
  clientId: ...,
    digitalKey: ...,
    publicKey: ...,
    apiRoot: ...,
    nonPCIApiRoot: ...,
})
const ezidebitStrategy = new Strategy(config)
const gateway = new Context(ezidebitStrategy)

const creditCard = new CreditCard({
    /* CAUTION: When using card details this way,
	/* you need to make sure that your program meets PCI requirements.
	/* Find out more: https://bit.ly/2PvyxGM */
	cardNumber: ...,
    expiryDateMonth: ...,
    public expiryDateYear: ...,
    public CCV: ...,
    public cardHolderName: ...,
})

const customer = new Customer({
    customerId: ...,        // Generate for use with your own system
    contractStartDate: ..., // yyyy-MM-dd, see Ezidebit: https://bit.ly/3ibuZWo
    lastName: ...,
    ...
})

// Add customer
gateway.addCustomer(customer, creditCard /*, bankAccount */)

const onceOffCharge = new Charge({
  orderNumber: ...,
    amountInCents: ...,
    customerName: ...,
})

// Once-off charge. This doesn't need customer info.
gateway.charge(onceOffCharge, creditCard)
```

## Reference

See [https://nodepay.netlify.app/#/](https://nodepay.netlify.app/#/)


## Tooling

This is the base monorepo for `@atomixdesign/nodepay` projects. The following npm scripts are available. Whenever possible, the scripts are designed to run standalone from inside a package, or from the project root with the same or similar configuration. For example, *yarn build && yarn test*

**yarn build**

Builds each dependency, with precedence to `nodepay-core`

**yarn test**

Runs full tests (unit and api integration) asynchronously against each api. Env vars must be configured.

**yarn reset**

Removes all build artifacts and all dependencies. Effectively resets the monorepo to clean slate.

**yarn clean**

Clean compiled outputs + artifacts.

  - _yarn clean:deps_

    Remove node_modules at top-level and in all nodepay packages.

  - _yarn clean:artifacts_

    Clean build artifacts and dependencies, but leave compiled outputs (build files and caches).

  - _yarn clean:build_

    Clean compiled outputs.

**yarn cli**

In-built cli, with starter template for gateway connector *(needs update).*

```
Usage: yarn cli <command> [options]

Commands:
  nodepay-cli adapter:create  Create an adapter for a payment gateway
                                                                   [aliases: c]

Options:
  --version  Show version number                                      [boolean]
  --help     Show help                                                [boolean]
```

**yarn docs**

Generate and aggregate documentation for all packages.

**yarn lint**

Run lint for each package.

**yarn publish:dev**

Publish packages locally. For use with sinopia, [verdaccio](https://verdaccio.org/) or a local repo.
