import { Container } from 'typedi'
import { validateOrReject } from 'class-validator'
import cryptoRandomString from 'crypto-random-string'
import { BaseGateway } from '@atomixdesign/nodepay-core'
import {
  OnceOffPayment,
  RecurringPayment,
  CustomerDetails,
} from '@atomixdesign/nodepay-core/build/features'
import {
  IBankAccount,
} from '@atomixdesign/nodepay-core/build/types'
import { IBaseResponse } from '@atomixdesign/nodepay-core/build/network'
import {
  BPOINTConfig,
  BPOINTCustomer,
  BPOINTCharge,
  BPOINTActionType,
  BPOINTTransactionType,
  BPOINTCreditCard,
} from './types'
import { BPOINTAPI } from './transport'
import {
  ChargeDTO,
  CustomerDTO,
} from './transport/dtos'

export class BPOINT extends BaseGateway<BPOINTConfig> implements
  OnceOffPayment,
  RecurringPayment,
  CustomerDetails {
  private api: BPOINTAPI

  protected get baseConfig(): BPOINTConfig {
    return {
      username: '',
      merchantId: '',
      password: '',
      apiRoot: '',
    }
  }

  constructor(config?: Partial<BPOINTConfig>) {
    super(config)
    Container.set('bpoint.config', config)
    this.api = Container.get('bpoint.api')
  }

  get name(): string {
    return 'BPOINT'
  }

  get shortName(): string {
    return 'bpoint'
  }

  private async _processCharge(
    charge: BPOINTCharge,
    creditCard: BPOINTCreditCard,
    subType: 'single' | 'recurring' = 'single'
  ): Promise<IBaseResponse> {
    const chargeObject = {
      Action: BPOINTActionType.payment,
      // TODO: Amount is scaled depending on currency. Setup scaling table for currencies.
      Amount: charge.amountInCents,
      Crn1: `${charge?.merchantReference ?? ''}${cryptoRandomString({ length: 32 })}`,
      EmailAddress: charge?.emailAddress,
      MerchantReference: charge?.merchantReference,
      TestMode: Boolean(charge?.testMode),
      SubType: subType,
      type: BPOINTTransactionType.internet,
    }

    const chargeDTO = new ChargeDTO(chargeObject, creditCard)
    await validateOrReject(chargeDTO)
    return await this.api.placeCharge(chargeDTO)
  }

  async addCustomer(
    customerDetails: BPOINTCustomer,
    creditCard?: BPOINTCreditCard,
    bankAccount?: IBankAccount,
  ): Promise<IBaseResponse> {
    const customer = {
      // TODO: Track idempotency tokens
      Crn1: `${cryptoRandomString({ length: 32 })}`,
      EmailAddress: customerDetails.emailAddress,
      FirstName: customerDetails.firstName,
      LastName: customerDetails.lastName,
      AddressLine1: customerDetails.address1,
      AddressLine2: customerDetails.address2,
      PostCode: customerDetails.postCode,
      State: customerDetails.region,
      HomePhoneNumber: customerDetails.phoneNumber,
    }

    const customerDTO = new CustomerDTO(
      customer,
      creditCard,
      bankAccount,
    )
    await validateOrReject(customerDTO)
    return await this.api.addCustomer(customerDTO)
  }

  async updateCustomer(
    reference: string,
    customerDetails: BPOINTCustomer,
    creditCard?: BPOINTCreditCard,
    bankAccount?: IBankAccount,
  ): Promise<IBaseResponse> {
    const customer = {
      // TODO: Track idempotency tokens
      Crn1: `${cryptoRandomString({ length: 32 })}`,
      EmailAddress: customerDetails.emailAddress,
      FirstName: customerDetails.firstName,
      LastName: customerDetails.lastName,
      AddressLine1: customerDetails.address1,
      AddressLine2: customerDetails.address2,
      PostCode: customerDetails.postCode,
      State: customerDetails.region,
      HomePhoneNumber: customerDetails.phoneNumber,
    }

    const customerDTO = new CustomerDTO(
      customer,
      creditCard,
      bankAccount,
    )
    await validateOrReject(customerDTO)
    return await this.api.updateCustomer(reference, customerDTO)
  }

  async charge(
    onceOffCharge: BPOINTCharge,
    creditCard: BPOINTCreditCard,
  ): Promise<IBaseResponse> {
    return this._processCharge(
      onceOffCharge,
      creditCard,
      'single',
    )
  }

  async chargeRecurring(
    recurringCharge: BPOINTCharge,
    creditCard: BPOINTCreditCard,
  ): Promise<IBaseResponse> {
    return this._processCharge(
      recurringCharge,
      creditCard,
      'recurring',
    )
  }
}
