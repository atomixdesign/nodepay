export interface IEzidebitBaseCreditCard {
  CreditCardNumber: string
  CreditCardExpiryMonth: string
  CreditCardExpiryYear: string
  NameOnCreditCard: string
}

export interface IEzidebitCreditCard extends IEzidebitBaseCreditCard {
  CreditCardCCV: string
}

export interface IEzidebitNewCreditCard extends IEzidebitBaseCreditCard {
  EziDebitCustomerID: string
  Reactivate: string
  YourSystemReference: string
  Username: string
}
