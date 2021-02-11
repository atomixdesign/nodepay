import {
  CustomerDetails,
  DirectDebit,
  OnceOffPayment,
  RecurringPayment,
} from './features'
import {
  IDirectDebit,
  IBaseCharge,
  ICustomerDetails,
  ICreditCard,
  IBankAccount,
} from './types'
import { IBaseResponse } from './network'

import debug from 'debug'
import { BaseGateway } from './gateways'
const log = debug('nodepay:core')

const _hasOwnProperty = (object: any, methodName: string) => {
  return Object.prototype.hasOwnProperty.call(object, methodName)
}

export class Context implements
  CustomerDetails,
  DirectDebit,
  OnceOffPayment,
  RecurringPayment
{
  [x: string]: any

  constructor(private gateway?: any) {
    return augmentWithNoSuchMethod(this)
  }

  public use(adapter: BaseGateway): void {
    this.gateway = adapter
  }

  public get name(): string {
    return this.gateway.name
  }

  public get shortName(): string {
    return this.gateway.shortName
  }

  private dispatch(methodName: string, arguments_: any) {
    if (_hasOwnProperty(this.gateway.__proto__, methodName)) {
      return this.gateway.__proto__[methodName].apply(this.gateway, Object.values(arguments_))
    }

    throw new Error(`Method not implemented: ${methodName}, class ${this.gateway.constructor.name}`)
  }

  addCustomer(
    customerDetails: ICustomerDetails,
    creditCard?: ICreditCard | undefined,
    bankAccount?: IBankAccount | undefined,
  ): Promise<IBaseResponse> {
    log(`calling addCustomer on ${this.gateway.constructor.name}`)
    log({ customerDetails })
    log({ creditCard })
    log({ bankAccount })
    return this.dispatch('addCustomer', {
      customerDetails,
      creditCard,
      bankAccount,
    })
  }
  updateCustomer(
    reference: string,
    customerDetails: ICustomerDetails,
    creditCard?: ICreditCard | undefined,
    bankAccount?: IBankAccount | undefined,
  ): Promise<IBaseResponse> {
    log(`calling updateCustomer on ${this.gateway.constructor.name}`)
    log({ reference })
    log({ customerDetails })
    log({ creditCard })
    log({ bankAccount })
    return this.dispatch('updateCustomer', {
      reference,
      customerDetails,
      creditCard,
      bankAccount,
    })
  }
  directDebit(directDebitCharge: IDirectDebit): Promise<IBaseResponse> {
    log(`calling directDebit on ${this.gateway.constructor.name}`)
    log({ directDebitCharge })
    return this.dispatch('directDebit', {
      directDebitCharge,
    })
  }
  charge(
    onceOffCharge: IBaseCharge,
    creditCard?: ICreditCard | undefined,
  ): Promise<IBaseResponse> {
    log(`calling charge on ${this.gateway.constructor.name}`)
    log({ onceOffCharge })
    log({ creditCard })
    return this.dispatch('charge', {
      onceOffCharge,
      creditCard,
    })
  }
  chargeRecurring(...arguments_: unknown[]): Promise<unknown> {
    log(`calling chargeRecurring on ${this.gateway.constructor.name}`)
    log({ arguments_ })
    return this.dispatch('chargeRecurring', {
      ...arguments_
    })
  }

  __noSuchMethod__(name: string, arguments_: any): any {
    log('warning: no such method on standard interface')
    log(`non-standard method ${name} called on ${this.gateway.constructor.name}`)
    log('attempting dispatch')
    return this.dispatch(name, {
      ...arguments_,
    })
  }
}

function augmentWithNoSuchMethod(object: any) {
  return new Proxy(object, {
    get(target, p) {
      if (p in target || p in new Promise(() => {})) {
        return target[p]
      } else if (typeof target.__noSuchMethod__ == 'function') {
        return function(...arguments_: any) {
          return target.__noSuchMethod__.call(target, p, arguments_)
        }
      }
    }
  })
}
