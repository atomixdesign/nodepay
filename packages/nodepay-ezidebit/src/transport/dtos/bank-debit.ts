import { BaseDebitDTO } from './base-debit'

import {
  IsNotEmpty,
} from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/validation/errors'
import { IBankAccountDebit } from '../../types'

export class BankDebitDTO extends BaseDebitDTO {
  constructor(bankAccountDebit: IBankAccountDebit) {
    super(bankAccountDebit)
    this.BankAccountName = bankAccountDebit.BankAccountName
    this.BankAccountBSB = bankAccountDebit.BankAccountBSB
    this.BankAccountNumber = bankAccountDebit.BankAccountNumber
  }
  // * BankAccountName
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'BankAccountName')
  })
  BankAccountName: string;

  // * BankAccountBSB
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'BankAccountBSB')
  })
  BankAccountBSB: string;

  // * BankAccountNumber
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'BankAccountNumber')
  })
  BankAccountNumber: string;
}
