import { IsNotEmpty, Length, IsNumberString } from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/validation'
import { IBankAccount } from '@atomixdesign/nodepay-core/types'

import debug from 'debug'
const log = debug('nodepay:bpoint')

/** @internal */
export class BankAccountDTO {
  constructor(bankAccount: IBankAccount) {
    log(`building ${this.constructor.name}`)
    log({ bankAccount })
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
