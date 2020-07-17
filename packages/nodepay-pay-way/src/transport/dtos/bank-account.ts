import {
  IsNotEmpty,
} from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/validation/errors'
import { IBankAccount } from '@atomixdesign/nodepay-core/src/types'

export class BankAccountDTO {
  constructor(bankAccount: IBankAccount) {
    this.paymentMethod = 'bankAccount'
    this.bsb = bankAccount.BSBNumber
    this.accountNumber = bankAccount.accountNumber
    this.accountName = bankAccount.accountName
  }

  // * paymentMethod
  paymentMethod: string;

  // * bsb
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'bsb')
  })
  bsb: string;

  // * accountNumber
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'accountNumber')
  })
  accountNumber: string;

  // * accountName
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'accountName')
  })
  accountName: string;
}
