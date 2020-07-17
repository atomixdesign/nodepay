import { Container } from 'typedi'
import { validateOrReject } from 'class-validator'
import { BaseGateway } from '@atomixdesign/nodepay-core/gateways/base-gateway'
import { DirectDebit, OnceOffPayment, RecurringPayment } from '@atomixdesign/nodepay-core/features'
import { IEzidebitConfig, EzidebitPaymentFrequency, EzidebitDayOfWeek } from './types'
import { EzidebitAPI as Transport, IEzidebitAPIResponse } from './transport'
import { OnceOffChargeDTO, PaymentDTO, PaymentScheduleDTO } from './transport/dtos'
import { ICreditCard } from '@atomixdesign/nodepay-core/types'
import { IEzidebitDirectDebitMetadata, IEzidebitChargeMetadata } from './types/metadata'

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
    orderNumber: string,
    amountInCents: number,
    creditCard: ICreditCard,
    metadata?: IEzidebitChargeMetadata,
  ): Promise<IEzidebitAPIResponse> {
    const chargeObject = {
      CreditCardNumber: creditCard.cardNumber,
      CreditCardExpiryMonth: creditCard.expiryDateMonth,
      CreditCardExpiryYear: creditCard.expiryDateYear,
      CreditCardCCV: creditCard.CCV,
      NameOnCreditCard: creditCard.cardHolderName,
      PaymentAmountInCents: amountInCents,
      CustomerName: metadata?.customerName || '',
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
    customerId: string,
    paymentReference: string,
    amountInCents: number,
    metadata: IEzidebitDirectDebitMetadata = {
      ezidebitCustomerNumber: '',
      debitDate: '',
      userName: '',
    },
  ): Promise<IEzidebitAPIResponse> {
    const paymentObject = {
      EziDebitCustomerID: String(metadata.ezidebitCustomerNumber),
      YourSystemReference: customerId,
      DebitDate: String(metadata.debitDate),
      PaymentAmountInCents: amountInCents,
      PaymentReference: paymentReference,
      Username: String(metadata.userName),
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
