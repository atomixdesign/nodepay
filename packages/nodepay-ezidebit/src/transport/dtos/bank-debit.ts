import { BaseDebitDTO } from './base-debit'

import {
  IsNotEmpty,
} from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/build/validation'
import { IEzidebitBankAccountDebit } from '../../types'

/** @internal */
export class BankDebitDTO extends BaseDebitDTO {
  constructor(bankAccountDebit: IEzidebitBankAccountDebit) {
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
