export interface IBaseCreditCard {
  CreditCardNumber: string
  CreditCardExpiryMonth: string
  CreditCardExpiryYear: string
  NameOnCreditCard: string
}

export interface ICreditCard extends IBaseCreditCard {
  CreditCardCCV: string
}
