import { Container } from 'typedi'
import { BaseGateway } from '../base-gateway'
import { DirectDebit, OnceOffPayment, RecurringPayment } from '../../features'
import { API as Transport } from './transport/api'
import { Config } from './config'
import { APIResponse } from './transport'
import { OnceOffChargeDTO, PaymentDTO, PaymentScheduleDTO } from './dtos'
import { validateOrReject } from 'class-validator'
import { PaymentFrequency, DayOfWeek } from './types'
import moment from 'moment'

export class Ezidebit extends BaseGateway<Config> implements DirectDebit, OnceOffPayment, RecurringPayment {
  private api: Transport

  protected get baseConfig(): Config {
    return {
      clientId: '',
      digitalKey: '',
      publicKey: '',
      apiRoot: '',
      nonPCIApiRoot: '',
    }
  }

  constructor(config?: Partial<Config>) {
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
    creditCardNumber: string,
    creditCardExpiryMonth: string,
    creditCardExpiryYear: string,
    creditCardCCV: string,
    nameOnCreditCard: string,
    principalAmount: number,
    customerName: string,
    orderNumber: string,
  ): Promise<APIResponse> {
    const chargeObject = {
      CreditCardNumber: creditCardNumber,
      CreditCardExpiryMonth: creditCardExpiryMonth,
      CreditCardExpiryYear: creditCardExpiryYear,
      CreditCardCCV: creditCardCCV,
      NameOnCreditCard: nameOnCreditCard,
      PaymentAmountInCents: principalAmount * 100,
      CustomerName: customerName,
      PaymentReference: orderNumber,
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
    frequency: PaymentFrequency,
    startDate: string,
    dayOfWeek: DayOfWeek,
    dayOfMonth = 0,
    regularPrincipalAmount: number,
    maxNumberPayments: number,
    maxTotalAmount: number,
    keepManualPayments = 'YES',
    userName = '',
  ): Promise<APIResponse> {
    const scheduleObject = {
      EziDebitCustomerID: gatewayCustomerNumber,
      YourSystemReference: ownCustomerNumber,
      ScheduleStartDate: moment(startDate).format('yyyy-MM-dd'),
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
    gatewayCustomerNumber = '',
    ownCustomerNumber = '',
    debitDate: string,
    principalAmount: number,
    orderNumber = '',
    userName = '',
  ): Promise<APIResponse> {
    const paymentObject = {
      EziDebitCustomerID: gatewayCustomerNumber,
      YourSystemReference: ownCustomerNumber,
      DebitDate: debitDate, // TODO: render debit date fluid via moment
      PaymentAmountInCents: principalAmount * 100,
      PaymentReference: orderNumber,
      Username: userName,
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
