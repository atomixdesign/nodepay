import { Container } from 'typedi'
import { validateOrReject } from 'class-validator'
import { BaseGateway } from '@atomixdesign/nodepay-core'
import {
  OnceOffPayment,
  RecurringPayment,
  CustomerDetails,
} from '@atomixdesign/nodepay-core/features'
import {
  FatzebraConfig,
  FatzebraCharge,
  FatzebraSubscription,
  FatzebraCreditCard,
  FatzebraCustomerDetails,
  FatzebraPaymentPlan,
} from './types'
import { IFatzebraAPIResponse } from './transport'
import { ChargeDTO, CustomerDTO, PlanDTO, SubscriptionDTO } from './transport/dtos'
import { FatzebraAPI } from './transport/api'

export class Fatzebra extends BaseGateway<FatzebraConfig> implements
  OnceOffPayment,
  RecurringPayment,
  CustomerDetails
{
  private api: FatzebraAPI

  protected get baseConfig(): FatzebraConfig {
    return {
      username: '',
      apiKey: '',
      apiRoot: '',
    }
  }

  constructor(config?: Partial<FatzebraConfig>) {
    super(config)
    Container.set('fatzebra.config', config)
    this.api = Container.get(FatzebraAPI)
  }

  get name(): string {
    return 'Fatzebra'
  }

  get shortName(): string {
    return 'fatzebra'
  }

  async addCustomer(
    customerDetails: FatzebraCustomerDetails,
    creditCard?: FatzebraCreditCard,
  ): Promise<IFatzebraAPIResponse> {
    const address = customerDetails.address1 ?
      `${customerDetails.address1}
      ${customerDetails.address2 ? ' ' + customerDetails.address2 : ''}`.trim() : customerDetails.address1

    const customerObject = new CustomerDTO(
      {
        firstName: customerDetails.firstName,
        lastName: customerDetails.lastName,
        reference: customerDetails.reference ?? customerDetails.customerId,
        emailAddress: customerDetails.emailAddress,
        ipAddress: customerDetails.ipAddress,
      },
      creditCard,
      {
        address,
        city: customerDetails.city,
        state: customerDetails.state,
        postcode: customerDetails.postCode,
        country: customerDetails.country,
      }
    )

    await validateOrReject(customerObject)
    return this.api.addCustomer(customerObject)
  }

  async updateCustomer(
    reference: string,
    customerDetails: FatzebraCustomerDetails,
  ): Promise<IFatzebraAPIResponse> {
    const address = customerDetails.address1 ?
      `${customerDetails.address1}
      ${customerDetails.address2 ? ' ' + customerDetails.address2 : ''}`.trim() : customerDetails.address1

    const customerObject = new CustomerDTO(
      {
        firstName: customerDetails.firstName,
        lastName: customerDetails.lastName,
        reference: customerDetails.reference ?? customerDetails.customerId,
        emailAddress: customerDetails.emailAddress,
        ipAddress: customerDetails.ipAddress,
      },
      undefined,
      {
        address,
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
    onceOffCharge: FatzebraCharge,
    creditCard?: FatzebraCreditCard,
  ): Promise<IFatzebraAPIResponse> {
    const chargeObject = new ChargeDTO(
      onceOffCharge,
      creditCard,
    )
    await validateOrReject(chargeObject)
    return this.api.placeCharge(chargeObject)
  }

  async chargeRecurring(
    subscription: FatzebraSubscription,
  ): Promise<IFatzebraAPIResponse> {
    const subscriptionObject = new SubscriptionDTO(subscription)
    await validateOrReject(subscriptionObject)
    return this.api.addSubscription(subscriptionObject)
  }

  async listPlans(): Promise<IFatzebraAPIResponse> {
    return this.api.listPlans()
  }

  async createPlan(paymentPlan: FatzebraPaymentPlan): Promise<IFatzebraAPIResponse> {
    const planObject = new PlanDTO(paymentPlan)
    await validateOrReject(planObject)
    return this.api.addPlan(planObject)
  }
}
