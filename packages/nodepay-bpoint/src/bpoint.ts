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
import { IBaseResponse } from '@atomixdesign/nodepay-core/network'
import {
  BPOINTConfig,
  BPOINTCustomer,
  BPOINTCharge,
  BPOINTActionType,
  BPOINTTransactionType,
} from './types'
import { BPOINTAPI } from './transport'
import {
  ChargeDTO,
  CreditCardDTO,
  BankAccountDTO,
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
    creditCard: ICreditCard,
    subType: 'single' | 'recurring' = 'single'
  ): Promise<IBaseResponse> {
    const chargeObject = {
      Action: BPOINTActionType.payment,
      // TODO: Amount is scaled depending on currency. Setup scaling table for currencies.
      Amount: charge.amountInCents,
      CardDetails: new CreditCardDTO(creditCard),
      Crn1: `${charge?.merchantReference ?? ''}${cryptoRandomString({ length: 10 })}`,
      EmailAddress: charge?.emailAddress,
      MerchantReference: charge?.merchantReference,
      TestMode: Boolean(charge?.testMode),
      SubType: subType,
      type: BPOINTTransactionType.internet,
    }

    const chargeDTO = new ChargeDTO(chargeObject)
    await validateOrReject(chargeDTO)
    return await this.api.placeCharge(chargeDTO)
  }

  async addCustomer(
    customerDetails: BPOINTCustomer,
    creditCard: ICreditCard,
    bankAccount?: IBankAccount,
  ): Promise<IBaseResponse> {
    const customerObject = {
      CardDetails: new CreditCardDTO(creditCard),
      BankAccountDetails: bankAccount && new BankAccountDTO(bankAccount),
      Crn1: `${cryptoRandomString({ length: 10 })}`,
      EmailAddress: customerDetails.emailAddress,
    }

    const customerDTO = new CustomerDTO(customerObject)
    await validateOrReject(customerDTO)
    return await this.api.addCustomer(customerDTO)
  }

  async charge(
    onceOffCharge: BPOINTCharge,
    creditCard: ICreditCard,
  ): Promise<IBaseResponse> {
    return this._processCharge(
      onceOffCharge,
      creditCard,
      'single',
    )
  }

  async chargeRecurring(
    recurringCharge: BPOINTCharge,
    creditCard: ICreditCard,
  ): Promise<IBaseResponse> {
    return this._processCharge(
      recurringCharge,
      creditCard,
      'recurring',
    )
  }
}
