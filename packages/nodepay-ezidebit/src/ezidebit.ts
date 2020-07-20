import { Container } from 'typedi'
import { validateOrReject } from 'class-validator'
import { BaseGateway } from '@atomixdesign/nodepay-core'
import { DirectDebit, OnceOffPayment, RecurringPayment } from '@atomixdesign/nodepay-core/features'
import { IEzidebitConfig, EzidebitPaymentFrequency, EzidebitDayOfWeek, IEzidebitCharge, IEzidebitDirectDebit } from './types'
import { EzidebitAPI as Transport, IEzidebitAPIResponse } from './transport'
import { OnceOffChargeDTO, PaymentDTO, PaymentScheduleDTO } from './transport/dtos'

export class Ezidebit extends BaseGateway<IEzidebitConfig> implements DirectDebit, OnceOffPayment, RecurringPayment {
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
    gatewayCustomerNumber = '',
    ownCustomerNumber = '',
    frequency: EzidebitPaymentFrequency,
    startDate: string,
    dayOfWeek = EzidebitDayOfWeek.MON,
    dayOfMonth = 0,
    regularPrincipalAmount: number,
    maxNumberPayments: number,
    maxTotalAmount: number,
    keepManualPayments = 'YES',
    userName = '',
  ): Promise<IEzidebitAPIResponse> {
    const scheduleObject = {
      EziDebitCustomerID: gatewayCustomerNumber,
      YourSystemReference: ownCustomerNumber,
      ScheduleStartDate: startDate,
      SchedulePeriodType: frequency,
      DayOfWeek: dayOfWeek,
      DayOfMonth: dayOfMonth,
      FirstWeekOfMonth: '',
      SecondWeekOfMonth: '',
      ThirdWeekOfMonth: '',
      FourthWeekOfMonth: '',
      PaymentAmountInCents: regularPrincipalAmount * 100,
      LimitToNumberOfPayments: maxNumberPayments,
      LimitToTotalAmountInCents: maxTotalAmount * 100,
      KeepManualPayments: keepManualPayments,
      Username: userName,
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
      EziDebitCustomerID: directDebit.ezidebitCustomerNumber ?? '',
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
