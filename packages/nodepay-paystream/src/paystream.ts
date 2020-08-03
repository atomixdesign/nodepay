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
    this.api = Container.get('paystream.api')
  }

  get name(): string {
    return 'Paystream'
  }

  get shortName(): string {
    return 'paystream'
  }

  async addCustomer(
    customerDetails: PaystreamCustomer,
    creditCard?: PaystreamCreditCard,
    address?: PaystreamAddress,
  ): Promise<IPaystreamAPIResponse> {
    const customerObject = new CustomerDTO(
      customerDetails,
      creditCard,
      address,
    )
    await validateOrReject(customerObject)
    return await this.api.addCustomer(customerObject)
  }

  async updateCustomer(
    reference: string,
    customerDetails: PaystreamCustomer,
    creditCard?: PaystreamCreditCard,
    address?: PaystreamAddress,
  ): Promise<IPaystreamAPIResponse> {
    const customerObject = new CustomerDTO(
      customerDetails,
      undefined,
      address,
    )

    // TODO: Verify expiry format issue on update. Update probably expecting full ISO date as string.
    if (creditCard !== undefined) console.warn('Credit card information for a customer cannot be updated with Paystream')

    await validateOrReject(customerObject)
    return await this.api.updateCustomer(reference, customerObject)
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
    return await this.api.placeCharge(chargeObject)
  }

  async chargeRecurring(
    subscription: PaystreamSubscription,
  ): Promise<IPaystreamAPIResponse> {
    const subscriptionObject = new SubscriptionDTO(subscription)
    await validateOrReject(subscriptionObject)
    return await this.api.addSubscription(subscriptionObject)
  }
}
