import { ICreditCard } from '@atomixdesign/nodepay-core/types'

export class PaywayCreditCard implements ICreditCard {
  constructor(
    public readonly cardNumber: string,
    public readonly expiryDateMonth: string,
    public readonly expiryDateYear: string,
    public readonly CCV: string,
    public readonly cardHolderName: string,
  ) {}
}
