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
  FatzebraPaymentPlan,
  FatzebraCreditCard,
  FatzebraCustomerDetails,
  FatzebraBankAccount,
} from './types'
import { IFatzebraAPIResponse } from './transport'
import {
  BankAccountDTO,
  ChargeDTO,
  CustomerDTO,
  PaymentPlanDTO,
} from './transport/dtos'
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

  constructor(config: FatzebraConfig) {
    super(config)
    this.api = new FatzebraAPI(config)
  }

  get name(): string {
    return 'Fatzebra'
  }

  get shortName(): string {
    return 'fatzebra'
  }

  async createBankAccount(
    bankAccount: FatzebraBankAccount,
  ): Promise<IFatzebraAPIResponse | BankAccountDTO | FatzebraConfig> {

    const formattedBankAccount = new BankAccountDTO(bankAccount)
    
    await validateOrReject(formattedBankAccount)

    switch(this?.settingsManager?.runMode as string) {
    case 'dry':
      return this.config
    case 'verbose':
      return formattedBankAccount
    case 'wet':
    default:
      return this.api.getBankAccountToken(formattedBankAccount)
    }
  }

  async addCustomer(
    customerDetails: FatzebraCustomerDetails,
    creditCard?: FatzebraCreditCard | string,
    bankAccount?: FatzebraBankAccount,
  ): Promise<IFatzebraAPIResponse | CustomerDTO | FatzebraConfig> {
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
      bankAccount,
      {
        address,
        city: customerDetails.city,
        state: customerDetails.state,
        postcode: customerDetails.postCode,
        country: customerDetails.country,
      }
    )

    await validateOrReject(customerObject)

    switch(this?.settingsManager?.runMode as string) {
    case 'dry':
      return this.config
    case 'verbose':
      return customerObject
    case 'wet':
    default:
      return this.api.addCustomer(customerObject)
    }
  }

  async updateCustomer(
    reference: string,
    customerDetails: FatzebraCustomerDetails,
    creditCard?: FatzebraCreditCard | string,
    bankAccount?: FatzebraBankAccount,
  ): Promise<IFatzebraAPIResponse | CustomerDTO | FatzebraConfig> {
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
      bankAccount,
      {
        address,
        city: customerDetails.city,
        state: customerDetails.state,
        postcode: customerDetails.postCode,
        country: customerDetails.country,
      }
    )

    await validateOrReject(customerObject)
    switch(this?.settingsManager?.runMode as string) {
    case 'dry':
      return this.config
    case 'verbose':
      return customerObject
    case 'wet':
    default:
      return this.api.updateCustomer(reference, customerObject)
    }
  }

  async charge(
    onceOffCharge: FatzebraCharge,
    creditCard?: FatzebraCreditCard,
  ): Promise<IFatzebraAPIResponse | ChargeDTO | FatzebraConfig> {
    const chargeObject = new ChargeDTO(
      onceOffCharge,
      creditCard,
    )
    await validateOrReject(chargeObject)
    switch(this?.settingsManager?.runMode as string) {
    case 'dry':
      return this.config
    case 'verbose':
      return chargeObject
    case 'wet':
    default:
      return this.api.placeCharge(chargeObject)
    }
  }

  async chargeRecurring(
    subscription: FatzebraPaymentPlan,
  ): Promise<IFatzebraAPIResponse | PaymentPlanDTO | FatzebraConfig> {
    const customerProfile = await this.api.getCustomer(subscription.customerId)

    if (customerProfile?.data?.card_token) {
      subscription.paymentMethod = 'Credit Card'
    } else if (customerProfile?.data?.bank_account) {
      subscription.paymentMethod = 'Direct Debit'
    }

    const subscriptionObject = new PaymentPlanDTO(subscription)

    await validateOrReject(subscriptionObject)
    switch(this?.settingsManager?.runMode as string) {
    case 'dry':
      return this.config
    case 'verbose':
      return subscriptionObject
    case 'wet':
    default:
      return this.api.addPaymentPlan(subscriptionObject)
    }
  }
}
