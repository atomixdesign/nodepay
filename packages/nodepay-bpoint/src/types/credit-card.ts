import { ICreditCard } from '@atomixdesign/nodepay-core/types'

export class BPOINTCreditCard implements ICreditCard {
  cardNumber: string
  expiryDateMonth: string
  expiryDateYear: string
  CCV: string
  cardHolderName: string

  constructor(
    cardNumber: string,
    expiryDateMonth: string,
    expiryDateYear: string,
    CCV: string,
    cardHolderName: string,
  ) {
    this.cardNumber = cardNumber
    this.expiryDateMonth = expiryDateMonth
    this.expiryDateYear = expiryDateYear
    this.CCV = CCV
    this.cardHolderName = cardHolderName
  }
}
