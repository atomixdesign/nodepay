import { IBaseCharge } from '@atomixdesign/nodepay-core/types'
import { BPOINTCurrency } from './currencies'
import { CreditCardDTO } from '../transport/dtos'

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
  CardDetails: CreditCardDTO
  Crn1: string
  Currency?: BPOINTCurrency
  SubType?: 'single' | 'recurring'
  TestMode?: boolean
  Type?: BPOINTTransactionType
  EmailAddress?: string
  MerchantReference?: string
}

export class BPOINTCharge implements IBaseCharge {
  orderNumber: string
  amountInCents: number
  merchantReference?: string
  emailAddress?: string
  testMode?: boolean

  constructor(
    orderNumber: string,
    amountInCents: number,
    merchantReference?: string,
    emailAddress?: string,
    testMode = true,
  ) {
    this.orderNumber = orderNumber
    this.amountInCents = amountInCents
    this.merchantReference = merchantReference
    this.emailAddress = emailAddress
    this.testMode = testMode
  }
}
