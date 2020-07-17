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

export interface IBPOINTBaseCharge {
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
