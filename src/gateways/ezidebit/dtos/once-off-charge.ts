import {
  IsNotEmpty,
  IsNumberString,
  IsCreditCard,
  MaxLength,
  Length,
  IsNumber,
  IsOptional,
  IsIP,
} from 'class-validator'

import {
  ErrorType,
  Errors,
} from '@nodepay/validation/errors'

export class OnceOffChargeDTO {
  constructor({
    CreditCardNumber,
    CreditCardExpiryMonth,
    CreditCardExpiryYear,
    CreditCardCCV,
    NameOnCreditCard,
    PaymentAmountInCents,
    CustomerName,
    PaymentReference,
  } :
  {
    CreditCardNumber: string
    CreditCardExpiryMonth: number
    CreditCardExpiryYear: number
    CreditCardCCV: number
    NameOnCreditCard: string
    PaymentAmountInCents: number
    CustomerName?: string
    PaymentReference: string
  }) {
    this.CreditCardNumber = CreditCardNumber
    this.CreditCardExpiryMonth = CreditCardExpiryMonth
    this.CreditCardExpiryYear = CreditCardExpiryYear
    this.CreditCardCCV = CreditCardCCV
    this.NameOnCreditCard = NameOnCreditCard
    this.PaymentAmountInCents = PaymentAmountInCents
    this.CustomerName = CustomerName
    this.PaymentReference = PaymentReference
  }

  // * CreditCardNumber
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'CreditCardNumber')
  })
  @IsCreditCard({
    message: Errors.getErrorMessage(ErrorType.NotACreditCard, 'CreditCardNumber')
  })
  @MaxLength(16, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'CreditCardNumber')
  })
  CreditCardNumber: string;

  // * CreditCardExpiryMonth
  CreditCardExpiryMonth: number;

  // * CreditCardExpiryYear
  CreditCardExpiryYear: number;

  // * CreditCardCCV
  @Length(3, 4, {
    message: Errors.getErrorMessage(ErrorType.LengthOutOfBounds, 'CreditCardCCV')
  })
  @IsNumberString(undefined, {
    message: Errors.getErrorMessage(ErrorType.NumberRequired, 'CreditCardCCV')
  })
  CreditCardCCV: number;

  // * NameOnCreditCard
  NameOnCreditCard: string;

  // * PaymentAmountInCents
  PaymentAmountInCents: number;

  // * CustomerName
  CustomerName: string | undefined;

  // * PaymentReference
  PaymentReference: string;
}

/*
CreditCardExpiryMonth (Required)
Customer’s credit card expiry month

Numeric
(2 digits)

12
CreditCardExpiryYear (Required)
Customer’s credit card expiry year

Numeric
(4 digits)

2012
CreditCardCCV (Required)
The three or four digit Credit Card Security Number that is located on the signature panel (Visa/Mastercard) or front of the card.

Numeric
(4 digits)

454
NameOnCreditCard (Required)
The name as it appears on the customer’s credit card

String
(Max. 100 char)

J.P. Smith

PaymentAmountInCents (Required)
The amount to debit from your payer in cents. The system has a $2.00 minimum debit amount. If you would like to process smaller amounts please email partner@ezidebit.com.au

E.g. $20.00 = 2000

Numeric	2000
CustomerName
The name of your Customer

NB - This is included for reporting purposes.

String
(Max. 255 char)

Joe Smith

PaymentReference (Required)
Your unique identifier for the transaction

String
(Max 50 char)

512458557 */
