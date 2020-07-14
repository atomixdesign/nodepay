import { Container } from 'typedi'
import { BaseGateway } from '../base-gateway'
import { DirectDebit, OnceOffPayment, RecurringPayment } from '@atomixdesign/nodepay/features'
import { Config } from './types'
import { API, APIResponse } from './transport'
import {
  ChargeDTO,
} from './transport/dtos'
import cryptoRandomString from 'crypto-random-string'
import { validateOrReject } from 'class-validator'

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

  async charge(
    creditCardNumber: string,
    creditCardExpiryMonth: string,
    creditCardExpiryYear: string,
    creditCardCCV: string,
    nameOnCreditCard: string,
    principalAmount: number,
    _emailAddress?: string,
    _merchantReference?: string,
  ): Promise<APIResponse> {
    const chargeObject = {
      Amount: principalAmount,
      CardDetails: {
        CardHolderName : nameOnCreditCard,
        CardNumber : creditCardNumber,
        Cvn : creditCardCCV,
        ExpiryDate : `${creditCardExpiryMonth}${creditCardExpiryYear.slice(-2)}`
      },
      Crn1: `${_merchantReference}${cryptoRandomString({ length: 10 })}`,
      EmailAddress: _emailAddress,
      MerchantReference: _merchantReference,
    }

    let payload

    try {
      const chargeDTO = new ChargeDTO(chargeObject)
      await validateOrReject(chargeDTO)
      payload = await this.api.placeCharge(chargeDTO)
    } catch(error) {
      return Promise.reject(error)
    }
    return Promise.resolve(payload)
  }

  async chargeRecurring(
    creditCardNumber: string,
    creditCardExpiryMonth: string,
    creditCardExpiryYear: string,
    creditCardCCV: string,
    nameOnCreditCard: string,
    principalAmount: number,
    _emailAddress?: string,
    _merchantReference?: string,
  ): Promise<APIResponse> {
    const chargeObject = {
      Amount: principalAmount,
      CardDetails: {
        CardHolderName : nameOnCreditCard,
        CardNumber : creditCardNumber,
        Cvn : creditCardCCV,
        ExpiryDate : `${creditCardExpiryMonth}${creditCardExpiryYear.slice(-2)}`
      },
      Crn1: `${_merchantReference}${cryptoRandomString({ length: 10 })}`,
      EmailAddress: _emailAddress,
      MerchantReference: _merchantReference,
      SubType: 'recurring' as const,
    }

    let payload

    try {
      const chargeDTO = new ChargeDTO(chargeObject)
      await validateOrReject(chargeDTO)
      payload = await this.api.placeCharge(chargeDTO)
    } catch(error) {
      return Promise.reject(error)
    }
    return Promise.resolve(payload)
  }

  async directDebit(): Promise<APIResponse> {
    return Promise.reject('Not Implemented')
  }

}
