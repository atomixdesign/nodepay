import { ICreditCard } from '@atomixdesign/nodepay-core/types'

export class PaywayCreditCard implements ICreditCard {
  constructor(
    public cardNumber: string,
    public expiryDateMonth: string,
    public expiryDateYear: string,
    public CCV: string,
    public cardHolderName: string,
  ) {}
}
