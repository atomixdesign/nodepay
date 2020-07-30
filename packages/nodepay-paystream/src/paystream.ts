import { Container } from 'typedi'
import { validateOrReject } from 'class-validator'
import { BaseGateway } from '@atomixdesign/nodepay-core'
import {
  OnceOffPayment,
  RecurringPayment,
  CustomerDetails,
} from '@atomixdesign/nodepay-core/features'
import { ICreditCard } from '@atomixdesign/nodepay-core/types'
import { IPaystreamConfig, PaystreamCharge, IPaystreamCustomer, IPaystreamSubscription, PaystreamCreditCard, IPaystreamInternalAddress } from './types'
import { IPaystreamAPIResponse } from './transport'
import { ChargeDTO, CustomerDTO, SubscriptionDTO } from './transport/dtos'
import { PaystreamAPI } from './transport/api'

export class Paystream extends BaseGateway<IPaystreamConfig> implements
  OnceOffPayment,
  RecurringPayment,
  CustomerDetails
{
  private api: PaystreamAPI

  protected get baseConfig(): IPaystreamConfig {
    return {
      username: '',
      apiKey: '',
      apiRoot: '',
    }
  }

  constructor(config?: Partial<IPaystreamConfig>) {
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
    customerDetails: IPaystreamCustomer,
  ): Promise<IPaystreamAPIResponse> {
    const customerObject = new CustomerDTO(customerDetails)
    await validateOrReject(customerObject)
    return await this.api.addCustomer(customerObject)
  }

  async charge(
    onceOffCharge: PaystreamCharge,
    creditCard?: ICreditCard,
  ): Promise<IPaystreamAPIResponse> {
    const chargeObject = new ChargeDTO({
      ...onceOffCharge,
      ...creditCard,
    })
    await validateOrReject(chargeObject)
    return await this.api.placeCharge(chargeObject)
  }

  async chargeRecurring(
    subscription: IPaystreamSubscription,
  ): Promise<IPaystreamAPIResponse> {
    const subscriptionObject = new SubscriptionDTO(subscription)
    await validateOrReject(subscriptionObject)
    return await this.api.addSubscription(subscriptionObject)
  }
}
