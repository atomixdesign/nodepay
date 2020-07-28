import { Container } from 'typedi'
import { validateOrReject } from 'class-validator'
import cryptoRandomString from 'crypto-random-string'
import { BaseGateway } from '@atomixdesign/nodepay-core'
import {
  OnceOffPayment,
  RecurringPayment,
  CustomerDetails,
} from '@atomixdesign/nodepay-core/features'
import {
  ICreditCard, IBankAccount,
} from '@atomixdesign/nodepay-core/types'
import {
  IBPOINTConfig,
  IBPOINTCustomer,
  IBPOINTCharge,
  BPOINTActionType,
  BPOINTTransactionType,
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
    charge: IBPOINTCharge,
    subType: 'single' | 'recurring' = 'single'
  ): Promise<IBPOINTAPIResponse> {
    let payload

    const chargeObject = {
      Action: BPOINTActionType.payment,
      Amount: charge.amountInCents, // TODO: Amount is scaled depending on currency. Setup scaling table for currencies.
      CardDetails: new CreditCardDTO(charge.creditCard),
      Crn1: `${charge?.merchantReference ?? ''}${cryptoRandomString({ length: 10 })}`,
      EmailAddress: charge?.emailAddress,
      MerchantReference: charge?.merchantReference,
      TestMode: Boolean(charge?.testMode),
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

  async addCustomer(
    customerDetails: IBPOINTCustomer,
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

  async charge(
    onceOffCharge: IBPOINTCharge
  ): Promise<IBPOINTAPIResponse> {
    return this.internalCharge(onceOffCharge, 'single')
  }

  async chargeRecurring(
    recurringCharge: IBPOINTCharge
  ): Promise<IBPOINTAPIResponse> {
    return this.internalCharge(recurringCharge, 'recurring')
  }

  async directDebit(): Promise<IBPOINTAPIResponse> {
    return Promise.reject('Not implemented')
  }

}
