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
  PaystreamSubscription,
  PaystreamCreditCard,
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
      {
        firstName: customerDetails.firstName,
        lastName: customerDetails.lastName,
        reference: customerDetails.reference,
        emailAddress: customerDetails.emailAddress,
        ipAddress: customerDetails.ipAddress,
      },
      creditCard,
      {
        address: `${customerDetails.address1}${customerDetails.address2 ? ' ' + customerDetails.address2 : ''}`.trim(),
        city: customerDetails.city,
        state: customerDetails.state,
        postcode: customerDetails.postCode,
        country: customerDetails.country,
      }
    )

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    console.log(require('util').inspect(customerObject, { depth: 6 }))

    await validateOrReject(customerObject, { skipMissingProperties: true })
    return this.api.addCustomer(customerObject)
  }

  async updateCustomer(
    reference: string,
    customerDetails: PaystreamCustomerDetails,
  ): Promise<IPaystreamAPIResponse> {
    const customerObject = new CustomerDTO(
      {
        firstName: customerDetails.firstName,
        lastName: customerDetails.lastName,
        reference: customerDetails.reference,
        emailAddress: customerDetails.emailAddress,
        ipAddress: customerDetails.ipAddress,
      },
      undefined,
      {
        address: `${customerDetails.address1}${customerDetails.address2 ? ' ' + customerDetails.address2 : ''}`.trim(),
        city: customerDetails.city,
        state: customerDetails.state,
        postcode: customerDetails.postCode,
        country: customerDetails.country,
      }
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
