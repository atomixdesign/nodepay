import { ICreditCard } from '@atomixdesign/nodepay-core/types'

export interface IEzidebitBaseCreditCard {
  CreditCardNumber: string
  CreditCardExpiryMonth: string
  CreditCardExpiryYear: string
  NameOnCreditCard: string
}

export class EzidebitCreditCard implements ICreditCard {
  constructor(
    public cardNumber: string,
    public expiryDateMonth: string,
    public expiryDateYear: string,
    public CCV: string,
    public cardHolderName: string,
  ) {}
}

export interface IEzidebitInternalCreditCard extends IEzidebitBaseCreditCard {
  CreditCardCCV: string
}

export interface IEzidebitNewCreditCard extends IEzidebitBaseCreditCard {
  EziDebitCustomerID: string
  Reactivate: string
  YourSystemReference: string
  Username: string
}
