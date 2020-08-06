import { Container } from 'typedi'
import { validateOrReject } from 'class-validator'
import { BaseGateway } from '@atomixdesign/nodepay-core'
import {
  DirectDebit,
  OnceOffPayment,
  RecurringPayment,
  CustomerDetails,
} from '@atomixdesign/nodepay-core/features'
import {
  EzidebitConfig,
  EzidebitDayOfWeek,
  EzidebitCharge,
  EzidebitPaymentSchedule,
  EzidebitDirectDebit,
  EzidebitCustomer,
  IEzidebitInternalCustomer,
  EzidebitCreditCard,
  EzidebitCustomerDetails,
  IEzidebitInternalCustomerDetails,
  IEzidebitNewCreditCard,
  EzidebitBankAccount,
  IEzidebitNewBankAccount,
} from './types'
import { EzidebitAPI as Transport, IEzidebitAPIResponse } from './transport'
import {
  OnceOffChargeDTO,
  PaymentDTO,
  PaymentScheduleDTO,
  CustomerDTO,
  CustomerDetailsDTO,
  CreditCardDTO,
  BankAccountDTO,
} from './transport/dtos'

export class Ezidebit extends BaseGateway<EzidebitConfig> implements
  DirectDebit,
  OnceOffPayment,
  RecurringPayment,
  CustomerDetails
{
  private api: Transport

  protected get baseConfig(): EzidebitConfig {
    return {
      clientId: '',
      digitalKey: '',
      publicKey: '',
      apiRoot: '',
      nonPCIApiRoot: '',
    }
  }

  constructor(config?: Partial<EzidebitConfig>) {
    super(config)
    Container.set('ezidebit.config', config)
    this.api = Container.get('ezidebit.api')
  }

  get name(): string {
    return 'Ezidebit'
  }

  get shortName(): string {
    return 'ezidebit'
  }

  async addCustomer(
    customer: EzidebitCustomer,
    creditCard?: EzidebitCreditCard,
    bankAccount?: EzidebitBankAccount,
  ): Promise<IEzidebitAPIResponse> {
    const customerObject: { [index:string] : any } = {
      YourSystemReference: customer.customerId,
      YourGeneralReference: customer.generalReference,
      LastName: customer.lastName,
      FirstName: customer.firstName,
      AddressLine1: customer.address1,
      AddressLine2: customer.address2,
      AddressSuburb: customer.suburb,
      AddressState: customer.region,
      AddressPostCode: customer.postCode,
      EmailAddress: customer.emailAddress,
      MobilePhoneNumber: customer.phoneNumber,
      ContractStartDate: customer.contractStartDate,
      SmsPaymentReminder: customer.smsPaymentReminder ?? 'YES',
      SmsFailedNotification: customer.smsFailedNotification ?? 'YES',
      SmsExpiredCard: customer.smsExpiredCard ?? 'YES',
    }

    await validateOrReject(new CustomerDTO(customerObject as IEzidebitInternalCustomer))
    for(const key of Object.keys(customerObject)) {
      if (customerObject[key] === undefined) {
        customerObject[key] = ''
      }
    }
    const result = await this.api.addCustomer(
      new CustomerDTO(customerObject as IEzidebitInternalCustomer)
    )

    // TODO: Decouple
    try {
      if (creditCard !== undefined) {
        const creditCardObject = {
          EziDebitCustomerID: '',
          YourSystemReference: customer.customerId,
          CreditCardNumber: creditCard.cardNumber,
          CreditCardExpiryMonth: creditCard.expiryDateMonth,
          CreditCardExpiryYear: creditCard.expiryDateYear,
          NameOnCreditCard: creditCard.cardHolderName,
        }
        const creditCardDTO: CreditCardDTO = new CreditCardDTO(creditCardObject as IEzidebitNewCreditCard)
        await validateOrReject(creditCardDTO)

        await this.api.addCustomerCreditCard(creditCardDTO)
      }

      if (bankAccount !== undefined) {
        const bankAccountObject = {
          EziDebitCustomerID: '',
          YourSystemReference: customer.customerId,
          BankAccountName: bankAccount.accountName,
          BankAccountBSB: bankAccount.BSBNumber,
          BankAccountNumber: bankAccount.accountNumber,
        }
        const bankAccountDTO: BankAccountDTO = new BankAccountDTO(bankAccountObject as IEzidebitNewBankAccount)
        await validateOrReject(bankAccountDTO)

        await this.api.addCustomerBankAccount(bankAccountDTO)
      }
    } catch (error) {
      console.error(error)
    }

    return result
  }

  async updateCustomer(
    reference: string,
    customerDetails: EzidebitCustomerDetails,
    creditCard?: EzidebitCreditCard,
    bankAccount?: EzidebitBankAccount,
  ): Promise<IEzidebitAPIResponse> {
    const detailsObject: { [index:string] : any } = {
      YourSystemReference: reference,
      NewYourSystemReference: reference,
      YourGeneralReference: customerDetails.generalReference,
      LastName: customerDetails.lastName,
      FirstName: customerDetails.firstName,
      AddressLine1: customerDetails.address1,
      AddressLine2: customerDetails.address2,
      AddressSuburb: customerDetails.suburb,
      AddressState: customerDetails.region,
      AddressPostCode: customerDetails.postCode,
      EmailAddress: customerDetails.emailAddress,
      MobilePhoneNumber: customerDetails.phoneNumber,
      SmsPaymentReminder: customerDetails.smsPaymentReminder,
      SmsFailedNotification: customerDetails.smsFailedNotification,
      SmsExpiredCard: customerDetails.smsExpiredCard,
      Username: customerDetails.username,
    }

    await validateOrReject(new CustomerDetailsDTO(detailsObject as IEzidebitInternalCustomerDetails))
    for(const key of Object.keys(detailsObject)) {
      if (detailsObject[key] === undefined) {
        detailsObject[key] = ''
      }
    }

    const result = await this.api.updateCustomer(
      new CustomerDetailsDTO(detailsObject as IEzidebitInternalCustomerDetails)
    )

    // TODO: Decouple
    try {
      if (creditCard !== undefined) {
        const creditCardObject = {
          EziDebitCustomerID: '',
          YourSystemReference: reference,
          CreditCardNumber: creditCard.cardNumber,
          CreditCardExpiryMonth: creditCard.expiryDateMonth,
          CreditCardExpiryYear: creditCard.expiryDateYear,
          NameOnCreditCard: creditCard.cardHolderName,
        }
        const creditCardDTO: CreditCardDTO = new CreditCardDTO(creditCardObject as IEzidebitNewCreditCard)
        await validateOrReject(creditCardDTO)

        await this.api.addCustomerCreditCard(creditCardDTO)
      }

      if (bankAccount !== undefined) {
        const bankAccountObject = {
          EziDebitCustomerID: '',
          YourSystemReference: reference,
          BankAccountName: bankAccount.accountName,
          BankAccountBSB: bankAccount.BSBNumber,
          BankAccountNumber: bankAccount.accountNumber,
        }
        const bankAccountDTO: BankAccountDTO = new BankAccountDTO(bankAccountObject as IEzidebitNewBankAccount)
        await validateOrReject(bankAccountDTO)

        await this.api.addCustomerBankAccount(bankAccountDTO)
      }
    } catch (error) {
      console.error(error)
    }

    return result
  }

  async directDebit(
    directDebitCharge: EzidebitDirectDebit,
  ): Promise<IEzidebitAPIResponse> {
    const paymentObject = {
      EziDebitCustomerID: directDebitCharge.ezidebitCustomerId ?? '',
      YourSystemReference: directDebitCharge.customerId,
      DebitDate: directDebitCharge.debitDate ?? '',
      PaymentAmountInCents: directDebitCharge.amountInCents,
      PaymentReference: directDebitCharge.paymentReference,
      Username: directDebitCharge.username ?? '',
    }

    await validateOrReject(new PaymentDTO(paymentObject))
    return await this.api.placeDirectCharge(paymentObject)
  }

  async charge(
    onceOffCharge: EzidebitCharge,
    creditCard: EzidebitCreditCard,
  ): Promise<IEzidebitAPIResponse> {
    const chargeObject = {
      CreditCardNumber: creditCard.cardNumber,
      CreditCardExpiryMonth: creditCard.expiryDateMonth,
      CreditCardExpiryYear: creditCard.expiryDateYear,
      CreditCardCCV: creditCard.CCV,
      NameOnCreditCard: creditCard.cardHolderName,
      PaymentAmountInCents: onceOffCharge.amountInCents,
      CustomerName: onceOffCharge.customerName ?? '',
      PaymentReference: onceOffCharge.orderNumber,
    }

    await validateOrReject(new OnceOffChargeDTO(chargeObject))
    return await this.api.placeCharge(chargeObject)
  }

  async chargeRecurring(
    paymentSchedule: EzidebitPaymentSchedule
  ): Promise<IEzidebitAPIResponse> {
    const scheduleObject = {
      EziDebitCustomerID: paymentSchedule.ezidebitCustomerId ?? '',
      YourSystemReference: paymentSchedule.customerId,
      ScheduleStartDate: paymentSchedule.startDate,
      SchedulePeriodType: paymentSchedule.frequency,
      DayOfWeek: paymentSchedule.dayOfWeek ?? EzidebitDayOfWeek.MON,
      DayOfMonth: paymentSchedule.dayOfMonth,
      FirstWeekOfMonth: paymentSchedule.firstWeekOfMonth ?? '',
      SecondWeekOfMonth: paymentSchedule.secondWeekOfMonth ?? '',
      ThirdWeekOfMonth: paymentSchedule.thirdWeekOfMonth ?? '',
      FourthWeekOfMonth: paymentSchedule.fourthWeekOfMonth ?? '',
      PaymentAmountInCents: paymentSchedule.amountInCents,
      LimitToNumberOfPayments: paymentSchedule.maxNumberPayments,
      LimitToTotalAmountInCents: paymentSchedule.maxTotalAmount,
      KeepManualPayments: paymentSchedule.keepManualPayments ?? 'YES',
      Username: paymentSchedule.username ?? '',
    }

    await validateOrReject(new PaymentScheduleDTO(scheduleObject))
    return await this.api.schedulePayment(scheduleObject)
  }
}
