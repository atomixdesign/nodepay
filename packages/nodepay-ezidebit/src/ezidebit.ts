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
} from './types'
import { EzidebitAPI as Transport, IEzidebitAPIResponse } from './transport'
import {
  OnceOffChargeDTO,
  PaymentDTO,
  PaymentScheduleDTO,
  CustomerDTO,
  CustomerDetailsDTO,
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
  ): Promise<IEzidebitAPIResponse> {
    const customerObject: { [index:string] : any } = {
      YourSystemReference: customer.customerId ?? '',
      YourGeneralReference: customer.generalReference,
      LastName: customer.lastName ?? '',
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
      Username: customer.username,
    }

    await validateOrReject(new CustomerDTO(customerObject as IEzidebitInternalCustomer))
    for(const key of Object.keys(customerObject)) {
      if (customerObject[key] === undefined) {
        customerObject[key] = ''
      }
    }
    return await this.api.addCustomer(
      new CustomerDTO(customerObject as IEzidebitInternalCustomer)
    )
  }

  async updateCustomer(
    reference: string,
    customerDetails: EzidebitCustomerDetails,
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
    return await this.api.updateCustomer(
      new CustomerDetailsDTO(detailsObject as IEzidebitInternalCustomerDetails)
    )
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

  async directDebit(
    directDebit: EzidebitDirectDebit,
  ): Promise<IEzidebitAPIResponse> {
    const paymentObject = {
      EziDebitCustomerID: directDebit.ezidebitCustomerId ?? '',
      YourSystemReference: directDebit.customerId,
      DebitDate: directDebit.debitDate ?? '',
      PaymentAmountInCents: directDebit.amountInCents,
      PaymentReference: directDebit.paymentReference,
      Username: directDebit.username ?? '',
    }

    await validateOrReject(new PaymentDTO(paymentObject))
    return await this.api.placeDirectCharge(paymentObject)
  }
}
