import {
  IsNotEmpty,
} from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/build/validation'
import { PaywayBankAccount } from '../../types'

import debug from 'debug'

const log = debug('nodepay:pay-way')

/** @internal */
export class BankAccountDTO {
  constructor(bankAccount: PaywayBankAccount) {
    log(`building ${this.constructor.name}`)
    log({ bankAccount })
    this.paymentMethod = 'bankAccount'
    this.bsb = bankAccount.BSBNumber
    this.accountNumber = bankAccount.accountNumber
    this.accountName = bankAccount.accountName
  }

  // * paymentMethod
  paymentMethod: string;

  // * bsb
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'bsb'),
  })
  bsb: string;

  // * accountNumber
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'accountNumber'),
  })
  accountNumber: string;

  // * accountName
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'accountName'),
  })
  accountName: string;
}
