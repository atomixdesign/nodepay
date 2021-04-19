import { BaseDebitDTO } from './base-debit'

import {
  IsNotEmpty,
} from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/validation'
import { IEzidebitBankAccountDebit } from '../../types'

import debug from 'debug'
const log = debug('nodepay:ezidebit')

/** @internal */
export class BankDebitDTO extends BaseDebitDTO {
  constructor(bankAccountDebit: IEzidebitBankAccountDebit) {
    super(bankAccountDebit)
    log(`building ${this.constructor.name}`)
    log({ bankAccountDebit })
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
