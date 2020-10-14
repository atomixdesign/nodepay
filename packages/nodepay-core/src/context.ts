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
  constructor(private gateway?: any) {}

  public use(adapter: any): void {
    this.gateway = adapter
  }

  private dispatch(methodName: string, arguments_: any) {
    if (_hasOwnProperty(this.gateway.__proto__, methodName)) {
      return this.gateway.__proto__[methodName].call(this.gateway, Object.values(arguments_))
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
}
