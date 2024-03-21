import { IsNotEmpty, MaxLength, IsNumberString, IsIn } from 'class-validator'
import { ErrorFactory, ErrorType } from '@atomixdesign/nodepay-core/build/validation'
import { IEzidebitNewBankAccount } from '../../types'
import { IsOptionalIfEmpty } from './IsOptionalIfEmpty'

import debug from 'debug'

const log = debug('nodepay:ezidebit')

/** @internal */
export class BankAccountDTO {
  constructor(bankAccount: IEzidebitNewBankAccount) {
    log(`building ${this.constructor.name}`)
    log({ bankAccount })
    if (!bankAccount.YourSystemReference)
      this.EziDebitCustomerID = bankAccount.EziDebitCustomerID
    if (!bankAccount.EziDebitCustomerID)
      this.YourSystemReference = bankAccount.YourSystemReference
    this.BankAccountName = bankAccount.BankAccountName
    this.BankAccountBSB = bankAccount.BankAccountBSB
    this.BankAccountNumber = bankAccount.BankAccountNumber
    this.Reactivate = bankAccount.Reactivate ?? 'YES'
    this.Username = bankAccount.Username
  }
  // * EziDebitCustomerID
  @IsOptionalIfEmpty()
  @IsNumberString(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'EziDebitCustomerID'),
  })
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'EziDebitCustomerID'),
  })
  EziDebitCustomerID = '';

  // * BankAccountName
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'BankAccountName'),
  })
  BankAccountName: string;

  // * BankAccountBSB
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'BankAccountBSB'),
  })
  BankAccountBSB: string;

  // * BankAccountNumber
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'BankAccountNumber'),
  })
  BankAccountNumber: string;

  // * Reactivate
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'Reactivate'),
  })
  @IsIn(['YES', 'NO'], {
    message: ErrorFactory.getErrorMessage(ErrorType.NotInAllowedSet, 'Reactivate'),
  })
  Reactivate: string

  // * YourSystemReference
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'YourSystemReference'),
  })
  YourSystemReference = '';

  // * Username
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'Username'),
  })
  Username = '';
}
