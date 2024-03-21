import {
  IsDate,
  IsNotEmpty, IsOptional,
} from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/build/validation'
import { FatzebraDirectDebit } from '../../types'

import debug from 'debug'

const log = debug('nodepay:fatzebra')

/** @internal */
export class DirectDebitDTO {
  constructor(directDebit: FatzebraDirectDebit) {
    log(`building ${this.constructor.name}`)
    log({ directDebit })
    this.description = directDebit.description
    this.amount = directDebit.amount

    if (!directDebit.bankAccount) {
      this.bsb = directDebit.BSBNumber
      this.account_number = directDebit.accountNumber
      this.account_name = directDebit.accountName
    } else {
      this.bank_account = directDebit.bankAccount
    }

    this.date = directDebit.date
    this.reference = directDebit.reference
  }

  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'description'),
  })
  description: string;

  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'number'),
  })
  amount: number;

  // * bsb
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'bsb'),
  })
  bsb?: string;

  // * account_number
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'account_number'),
  })
  account_number?: string;

  // * account_name
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'account_name'),
  })
  account_name?: string;

  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'date'),
  })
  @IsDate()
  date?: string;

  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'reference'),
  })
  reference?: string;

  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'bankAccount'),
  })
  bank_account?: string;
}
