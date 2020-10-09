import { Container } from 'typedi'
import { validateOrReject } from 'class-validator'
import { BaseGateway } from '@atomixdesign/nodepay-core'
import {
  OnceOffPayment,
  RecurringPayment,
  CustomerDetails,
} from '@atomixdesign/nodepay-core/features'
import {
  PaystreamConfig,
  PaystreamCharge,
  PaystreamCustomer,
  PaystreamSubscription,
  PaystreamCreditCard,
  PaystreamAddress,
  PaystreamCustomerDetails,
} from './types'
import { IPaystreamAPIResponse } from './transport'
import { ChargeDTO, CustomerDTO, SubscriptionDTO } from './transport/dtos'
import { PaystreamAPI } from './transport/api'

export class Paystream extends BaseGateway<PaystreamConfig> implements
  OnceOffPayment,
  RecurringPayment,
  CustomerDetails
{
  private api: PaystreamAPI

  protected get baseConfig(): PaystreamConfig {
    return {
      username: '',
      apiKey: '',
      apiRoot: '',
    }
  }

  constructor(config?: Partial<PaystreamConfig>) {
    super(config)
    Container.set('paystream.config', config)
    this.api = Container.get(PaystreamAPI)
  }

  get name(): string {
    return 'Paystream'
  }

  get shortName(): string {
    return 'paystream'
  }

  async addCustomer(
    customerDetails: PaystreamCustomerDetails,
    creditCard?: PaystreamCreditCard,
  ): Promise<IPaystreamAPIResponse> {
    const customerObject = new CustomerDTO(
      customerDetails as PaystreamCustomer,
      creditCard,
      customerDetails as PaystreamAddress,
    )

    await validateOrReject(customerObject)
    return this.api.addCustomer(customerObject)
  }

  async updateCustomer(
    reference: string,
    customerDetails: PaystreamCustomerDetails,
  ): Promise<IPaystreamAPIResponse> {
    const customerObject = new CustomerDTO(
      customerDetails as PaystreamCustomer,
      // TODO: Fix expiry format issue on credit card update.
      // Probably expecting full ISO date as string.
      undefined,
      customerDetails as PaystreamAddress,
    )

    await validateOrReject(customerObject)
    return this.api.updateCustomer(reference, customerObject)
  }

  async charge(
    onceOffCharge: PaystreamCharge,
    creditCard?: PaystreamCreditCard,
  ): Promise<IPaystreamAPIResponse> {
    const chargeObject = new ChargeDTO(
      onceOffCharge,
      creditCard,
    )
    await validateOrReject(chargeObject)
    return this.api.placeCharge(chargeObject)
  }

  async chargeRecurring(
    subscription: PaystreamSubscription,
  ): Promise<IPaystreamAPIResponse> {
    const subscriptionObject = new SubscriptionDTO(subscription)
    await validateOrReject(subscriptionObject)
    return this.api.addSubscription(subscriptionObject)
  }
}
