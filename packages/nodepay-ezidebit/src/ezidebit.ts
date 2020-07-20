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
  IEzidebitConfig,
  // EzidebitPaymentFrequency,
  EzidebitDayOfWeek,
  IEzidebitCharge,
  IEzidebitPaymentSchedule,
  IEzidebitDirectDebit,
  IEzidebitCustomer,
  IEzidebitInternalCustomer,
} from './types'
import { EzidebitAPI as Transport, IEzidebitAPIResponse } from './transport'
import { OnceOffChargeDTO, PaymentDTO, PaymentScheduleDTO, CustomerDTO } from './transport/dtos'
import { ICustomerDetails } from '@atomixdesign/nodepay-core/src/types'

export class Ezidebit extends BaseGateway<IEzidebitConfig> implements
  DirectDebit,
  OnceOffPayment,
  RecurringPayment,
  CustomerDetails
{
  private api: Transport

  protected get baseConfig(): IEzidebitConfig {
    return {
      clientId: '',
      digitalKey: '',
      publicKey: '',
      apiRoot: '',
      nonPCIApiRoot: '',
    }
  }

  constructor(config?: Partial<IEzidebitConfig>) {
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
    customer: IEzidebitCustomer,
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

    let payload

    try {
      await validateOrReject(new CustomerDTO(customerObject as IEzidebitInternalCustomer))
      for(const key of Object.keys(customerObject)) {
        if (customerObject[key] === undefined) {
          customerObject[key] = ''
        }
      }
      payload = await this.api.addCustomer(
        new CustomerDTO(customerObject as IEzidebitInternalCustomer)
      )
    } catch(error) {
      return Promise.reject(error)
    }
    return Promise.resolve(payload)
  }

  async charge(
    onceOffCharge: IEzidebitCharge,
  ): Promise<IEzidebitAPIResponse> {
    const chargeObject = {
      CreditCardNumber: onceOffCharge.creditCard.cardNumber,
      CreditCardExpiryMonth: onceOffCharge.creditCard.expiryDateMonth,
      CreditCardExpiryYear: onceOffCharge.creditCard.expiryDateYear,
      CreditCardCCV: onceOffCharge.creditCard.CCV,
      NameOnCreditCard: onceOffCharge.creditCard.cardHolderName,
      PaymentAmountInCents: onceOffCharge.amountInCents,
      CustomerName: onceOffCharge.customerName ?? '',
      PaymentReference: onceOffCharge.orderNumber,
    }

    let payload

    try {
      await validateOrReject(new OnceOffChargeDTO(chargeObject))
      payload = await this.api.placeCharge(chargeObject)
    } catch(error) {
      return Promise.reject(error)
    }
    return Promise.resolve(payload)
  }

  async chargeRecurring(
    paymentSchedule: IEzidebitPaymentSchedule
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

    let payload

    try {
      await validateOrReject(new PaymentScheduleDTO(scheduleObject))
      payload = await this.api.schedulePayment(scheduleObject)
    } catch(error) {
      return Promise.reject(error)
    }
    return Promise.resolve(payload)
  }

  async directDebit(
    directDebit: IEzidebitDirectDebit,
  ): Promise<IEzidebitAPIResponse> {
    const paymentObject = {
      EziDebitCustomerID: directDebit.ezidebitCustomerId ?? '',
      YourSystemReference: directDebit.customerId,
      DebitDate: directDebit.debitDate ?? '',
      PaymentAmountInCents: directDebit.amountInCents,
      PaymentReference: directDebit.paymentReference,
      Username: directDebit.username ?? '',
    }

    let payload

    try {
      await validateOrReject(new PaymentDTO(paymentObject))
      payload = await this.api.placeDirectCharge(paymentObject)
    } catch(error) {
      return Promise.reject(error)
    }
    return Promise.resolve(payload)
  }
}
