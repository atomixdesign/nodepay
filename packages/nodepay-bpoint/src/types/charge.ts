import { ICreditCard } from './credit-card'
import { Currency } from './currencies'

export enum ActionType {
  payment = 'payment',
}

export enum TransactionType {
  callcentre = 'callcentre',
  cardpresent = 'cardpresent',
  ecommerce = 'ecommerce',
  internet = 'internet',
  ivr = 'ivr',
  mailorder = 'mailorder',
  telephoneorder = 'telephoneorder',
}

export interface IBaseCharge {
  Action?: ActionType
  Amount: number // TODO: consider bigInt. For now, MAX_SAFE_INTEGER appears sufficient.
  CardDetails: ICreditCard
  Crn1: string
  Currency?: Currency
  SubType?: 'single' | 'recurring'
  TestMode?: boolean
  Type?: TransactionType
  EmailAddress?: string
  MerchantReference?: string
}
