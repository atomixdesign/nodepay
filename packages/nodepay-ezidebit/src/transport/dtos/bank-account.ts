import { IsNotEmpty, MaxLength, IsNumberString, IsIn } from 'class-validator'
import { ErrorFactory, ErrorType } from '@atomixdesign/nodepay-core/build/validation'
import { IEzidebitNewBankAccount } from '../../types'

/** @internal */
export class BankAccountDTO {
  constructor(bankAccount: IEzidebitNewBankAccount) {
    if (bankAccount.YourSystemReference === undefined)
      this.EziDebitCustomerID = bankAccount.EziDebitCustomerID
    if (bankAccount.EziDebitCustomerID === undefined)
      this.YourSystemReference = bankAccount.YourSystemReference
    this.BankAccountName = bankAccount.BankAccountName
    this.BankAccountBSB = bankAccount.BankAccountBSB
    this.BankAccountNumber = bankAccount.BankAccountNumber
    this.Reactivate = bankAccount.Reactivate ?? 'YES'
    this.Username = bankAccount.Username
  }
  // * EziDebitCustomerID
  @IsNumberString(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'EziDebitCustomerID')
  })
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'EziDebitCustomerID')
  })
  EziDebitCustomerID = '';

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

  // * Reactivate
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'Reactivate')
  })
  @IsIn(['YES', 'NO'], {
    message: ErrorFactory.getErrorMessage(ErrorType.NotInAllowedSet, 'Reactivate')
  })
  Reactivate: string

  // * YourSystemReference
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'YourSystemReference')
  })
  YourSystemReference = '';

  // * Username
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'Username')
  })
  Username = '';
}
