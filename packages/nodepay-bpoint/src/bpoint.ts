import { Container } from 'typedi'
import cryptoRandomString from 'crypto-random-string'
import { validateOrReject } from 'class-validator'
import { BaseGateway } from '@atomixdesign/nodepay-core'
import {
  OnceOffPayment,
  RecurringPayment,
  CustomerDetails,
} from '@atomixdesign/nodepay-core/features'
import {
  ICreditCard, ICustomer, IBankAccount,
} from '@atomixdesign/nodepay-core/types'
import {
  IBPOINTConfig,
  BPOINTActionType,
  BPOINTTransactionType,
  IBPOINTChargeMetadata,
} from './types'
import { BPOINTAPI, IBPOINTAPIResponse } from './transport'
import {
  ChargeDTO,
  CreditCardDTO,
  BankAccountDTO,
  CustomerDTO,
} from './transport/dtos'

export class BPOINT extends BaseGateway<IBPOINTConfig> implements
  OnceOffPayment,
  RecurringPayment,
  CustomerDetails {
  private api: BPOINTAPI

  protected get baseConfig(): IBPOINTConfig {
    return {
      username: '',
      merchantId: '',
      password: '',
      apiRoot: '',
    }
  }

  constructor(config?: Partial<IBPOINTConfig>) {
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

  private async internalCharge(
    orderNumber: string,
    amountInCents: number,
    creditCard: ICreditCard,
    metadata?: IBPOINTChargeMetadata,
    subType: 'single' | 'recurring' = 'single'
  ): Promise<IBPOINTAPIResponse> {
    let payload

    const chargeObject = {
      Action: BPOINTActionType.payment,
      Amount: amountInCents, // TODO: Amount is scaled depending on currency. Setup scaling table for currencies.
      CardDetails: new CreditCardDTO(creditCard),
      Crn1: `${metadata?.merchantReference || ''}${cryptoRandomString({ length: 10 })}`,
      EmailAddress: metadata?.emailAddress,
      MerchantReference: metadata?.merchantReference,
      TestMode: Boolean(metadata?.testMode),
      SubType: subType,
      type: BPOINTTransactionType.internet,
    }

    try {
      const chargeDTO = new ChargeDTO(chargeObject)
      await validateOrReject(chargeDTO)
      payload = await this.api.placeCharge(chargeDTO)
    } catch(error) {
      return Promise.reject(error)
    }
    return Promise.resolve(payload)
  }

  async charge(
    orderNumber: string,
    amountInCents: number,
    creditCard: ICreditCard,
    metadata?: IBPOINTChargeMetadata,
  ): Promise<IBPOINTAPIResponse> {
    return this.internalCharge(
      orderNumber,
      amountInCents,
      creditCard,
      metadata,
      'single'
    )
  }

  async chargeRecurring(
    orderNumber: string,
    amountInCents: number,
    creditCard: ICreditCard,
    metadata?: IBPOINTChargeMetadata,
  ): Promise<IBPOINTAPIResponse> {
    return this.internalCharge(
      orderNumber,
      amountInCents,
      creditCard,
      metadata,
      'recurring'
    )
  }

  async addCustomer(
    customerDetails: ICustomer,
    creditCard: ICreditCard,
    bankAccount?: IBankAccount,
  ): Promise<IBPOINTAPIResponse> {
    let payload

    const customerObject = {
      CardDetails: new CreditCardDTO(creditCard),
      BankAccountDetails: bankAccount && new BankAccountDTO(bankAccount),
      Crn1: `${cryptoRandomString({ length: 10 })}`,
      EmailAddress: customerDetails.emailAddress,
    }

    try {
      const customerDTO = new CustomerDTO(customerObject)
      await validateOrReject(customerDTO)
      payload = await this.api.addCustomer(customerDTO)
    } catch(error) {
      return Promise.reject(error)
    }
    return Promise.resolve(payload)
  }

  async directDebit(): Promise<IBPOINTAPIResponse> {
    return Promise.reject('Not implemented')
  }

}
