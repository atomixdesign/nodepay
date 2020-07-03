import { IDirectDebitPayment } from '../types'
import { IsOptional, IsNumberString, MaxLength, IsNotEmpty, IsNumber } from 'class-validator'
import { Errors, ErrorType } from '@atomixdesign/nodepay/validation/errors'

export class PaymentDTO {
  constructor(payment: IDirectDebitPayment) {
    if (payment.YourSystemReference === undefined)
      this.EziDebitCustomerID = payment.EziDebitCustomerID
    if (payment.EziDebitCustomerID === undefined)
      this.YourSystemReference = payment.YourSystemReference
    this.DebitDate = payment.DebitDate
    this.PaymentAmountInCents = payment.PaymentAmountInCents
    this.PaymentReference = payment.PaymentReference
    this.Username = payment.Username
  }
  // * EziDebitCustomerID
  @IsOptional()
  @IsNumberString(undefined, {
    message: Errors.getErrorMessage(ErrorType.NotANumber, 'EziDebitCustomerID')
  })
  @MaxLength(50, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'EziDebitCustomerID')
  })
  EziDebitCustomerID: string | undefined;

  // * YourSystemReference
  @IsOptional()
  @MaxLength(50, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'YourSystemReference')
  })
  YourSystemReference: string | undefined;

  // * DebitDate
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'DebitDate')
  })
  @MaxLength(10, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'DebitDate')
  })
  DebitDate: string;

  // * PaymentAmountInCents
  @IsNumber(undefined, {
    message: Errors.getErrorMessage(ErrorType.NotANumber, 'PaymentAmountInCents')
  })
  PaymentAmountInCents: number;

  // * PaymentReference
  @IsOptional()
  @MaxLength(50, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'PaymentReference')
  })
  PaymentReference: string | undefined;

  // * Username
  @IsOptional()
  @MaxLength(50, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'Username')
  })
  Username: string | undefined;
}
