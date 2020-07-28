import { IsNotEmpty, Length, IsNumberString } from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/validation/errors'
import { IBankAccount } from '@atomixdesign/nodepay-core/types'

export class BankAccountDTO {
  constructor(bankAccount: IBankAccount) {
    this.AccountName = bankAccount.accountName
    this.AccountNumber = bankAccount.accountNumber
    this.BSBNumber = bankAccount.BSBNumber
  }

  // * AccountName
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'AccountName')
  })
  AccountName: string;

  // * AccountNumber
  @Length(3, 9, {
    message: ErrorFactory.getErrorMessage(ErrorType.LengthOutOfBounds, 'AccountNumber')
  })
  AccountNumber: string;

  // * BSBNumber
  @Length(6, 6, {
    message: ErrorFactory.getErrorMessage(ErrorType.LengthOutOfBounds, 'BSBNumber')
  })
  @IsNumberString(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'BSBNumber')
  })
  BSBNumber: string;
}
