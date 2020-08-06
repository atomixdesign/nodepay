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
    if (_hasOwnProperty(this.gateway, methodName)) {
      return this.gateway[methodName](...arguments_)
    }

    throw new Error(`Method not implemented: ${methodName}, class ${this.gateway.constructor.name}`)
  }

  addCustomer(
    customerDetails: ICustomerDetails,
    creditCard?: ICreditCard | undefined,
    bankAccount?: IBankAccount | undefined,
  ): Promise<IBaseResponse> {
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
    return this.dispatch('updateCustomer', {
      reference,
      customerDetails,
      creditCard,
      bankAccount,
    })
  }
  directDebit(directDebitCharge: IDirectDebit): Promise<IBaseResponse> {
    return this.dispatch('directDebit', {
      directDebitCharge,
    })
  }
  charge(
    onceOffCharge: IBaseCharge,
    creditCard?: ICreditCard | undefined,
  ): Promise<IBaseResponse> {
    return this.dispatch('charge', {
      onceOffCharge,
      creditCard,
    })
  }
  chargeRecurring(...arguments_: unknown[]): Promise<unknown> {
    return this.dispatch('chargeRecurring', {
      ...arguments_
    })
  }



}
