import { IBaseCharge } from '@atomixdesign/nodepay-core/build/types'
import { BPOINTCurrency } from './currencies'

export enum BPOINTActionType {
  payment = 'payment',
}

export enum BPOINTTransactionType {
  callcentre = 'callcentre',
  cardpresent = 'cardpresent',
  ecommerce = 'ecommerce',
  internet = 'internet',
  ivr = 'ivr',
  mailorder = 'mailorder',
  telephoneorder = 'telephoneorder',
}

/** @internal */
export interface IBPOINTInternalCharge {
  Action?: BPOINTActionType
  Amount: number // TODO: Consider bigInt. For now, MAX_SAFE_INTEGER appears sufficient.
  Crn1: string
  Currency?: BPOINTCurrency
  SubType?: 'single' | 'recurring'
  TestMode?: boolean
  Type?: BPOINTTransactionType
  EmailAddress?: string
  MerchantReference?: string
}

export class BPOINTCharge implements IBaseCharge {
  constructor(
    public readonly orderNumber: string,
    public readonly amountInCents: number,
    public readonly merchantReference?: string,
    public readonly emailAddress?: string,
    public readonly testMode?: boolean,
  ) {
    this.testMode = testMode === undefined ? true : Boolean(testMode)
  }
}
