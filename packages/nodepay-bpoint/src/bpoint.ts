import { Container } from 'typedi'
import cryptoRandomString from 'crypto-random-string'
import { validateOrReject } from 'class-validator'
import { BaseGateway } from '@atomixdesign/nodepay-core/gateways'
import {
  DirectDebit,
  OnceOffPayment,
  RecurringPayment,
} from '@atomixdesign/nodepay-core/features'
import {
  ICreditCard,
} from '@atomixdesign/nodepay-core/types'
import { Config, ActionType, TransactionType } from './types'
import { API, APIResponse } from './transport'
import {
  ChargeDTO,
  CreditCardDTO,
} from './transport/dtos'

export class BPOINT extends BaseGateway<Config> implements DirectDebit, OnceOffPayment, RecurringPayment {
  private api: API

  protected get baseConfig(): Config {
    return {
      username: '',
      merchantId: '',
      password: '',
      apiRoot: '',
    }
  }

  constructor(config?: Partial<Config>) {
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
      Action: ActionType.payment,
      Amount: amountInCents, // TODO: Amount is scaled depending on currency. Setup scaling table for currencies.
      CardDetails: new CreditCardDTO(creditCard),
      Crn1: `${metadata?.merchantReference || ''}${cryptoRandomString({ length: 10 })}`,
      EmailAddress: metadata?.emailAddress,
      MerchantReference: metadata?.merchantReference,
      TestMode: Boolean(metadata?.testMode),
      SubType: subType,
      type: TransactionType.internet,
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

  async directDebit(): Promise<APIResponse> {
    return Promise.reject('Not Implemented')
  }

}
