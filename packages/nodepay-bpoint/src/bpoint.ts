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
import { IConfig, BPOINTActionType, BPOINTTransactionType } from './types'
import { BPOINTAPI, APIResponse } from './transport'
import {
  ChargeDTO,
  CreditCardDTO,
  BankAccountDTO,
  CustomerDTO,
} from './transport/dtos'

export class BPOINT extends BaseGateway<IConfig> implements
  OnceOffPayment,
  RecurringPayment,
  CustomerDetails {
  private api: BPOINTAPI

  protected get baseConfig(): IConfig {
    return {
      username: '',
      merchantId: '',
      password: '',
      apiRoot: '',
    }
  }

  constructor(config?: Partial<IConfig>) {
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
    metadata?: Record<string, any>,
    subType: 'single' | 'recurring' = 'single'
  ): Promise<APIResponse> {
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
    metadata?: Record<string, any>
  ): Promise<APIResponse> {
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
    metadata?: Record<string, any>
  ): Promise<APIResponse> {
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
  ): Promise<APIResponse> {
    console.log(customerDetails, creditCard, bankAccount)

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

  async directDebit(): Promise<APIResponse> {
    return Promise.reject('Not implemented')
  }

}
