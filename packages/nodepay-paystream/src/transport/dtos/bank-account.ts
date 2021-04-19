import {
  IsNotEmpty,
} from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/validation'
import { PaystreamBankAccount } from '../../types'

import debug from 'debug'
const log = debug('nodepay:paystream')

/** @internal */
export class BankAccountDTO {
  constructor(bankAccount: PaystreamBankAccount) {
    log(`building ${this.constructor.name}`)
    log({ bankAccount })
    this.paymentMethod = 'bankAccount'
    this.bsb = bankAccount.BSBNumber
    this.account_number = bankAccount.accountNumber
    this.account_name = bankAccount.accountName
  }

  // * paymentMethod
  paymentMethod: string;

  // * bsb
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'bsb')
  })
  bsb: string;

  // * account_number
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'account_number')
  })
  account_number: string;

  // * account_name
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'account_name')
  })
  account_name: string;

  account_type = 'AU';
}
