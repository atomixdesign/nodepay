import { IsOptional, IsNumberString, MaxLength, IsNotEmpty, IsNumber } from 'class-validator'
import { ErrorFactory, ErrorType } from '@atomixdesign/nodepay-core/build/validation'
import { IEzidebitDirectDebitPayment } from '../../types'

/** @internal */
export class PaymentDTO {
  constructor(payment: IEzidebitDirectDebitPayment) {
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
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'EziDebitCustomerID')
  })
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'EziDebitCustomerID')
  })
  EziDebitCustomerID: string | undefined;

  // * YourSystemReference
  @IsOptional()
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'YourSystemReference')
  })
  YourSystemReference: string | undefined;

  // * DebitDate
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'DebitDate')
  })
  @MaxLength(10, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'DebitDate')
  })
  DebitDate: string;

  // * PaymentAmountInCents
  @IsNumber(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'PaymentAmountInCents')
  })
  PaymentAmountInCents: number;

  // * PaymentReference
  @IsOptional()
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'PaymentReference')
  })
  PaymentReference: string | undefined;

  // * Username
  @IsOptional()
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'Username')
  })
  Username: string | undefined;
}
