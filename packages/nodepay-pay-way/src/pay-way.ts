import { Container } from 'typedi'
import { validateOrReject } from 'class-validator'
import { BaseGateway } from '@atomixdesign/nodepay-core'
import {
  DirectDebit,
  OnceOffPayment,
  RecurringPayment,
} from '@atomixdesign/nodepay-core/features'
import { IPaywayConfig, PaywayPaymentFrequency } from './types'
import { PaywayAPI, IPaywayAPIResponse } from './transport'
import {
  ChargeDTO,
  PaymentScheduleDTO,
  CreditCardDTO,
} from './transport/dtos'
import { ICreditCard } from '@atomixdesign/nodepay-core/types'

export class Payway extends BaseGateway<IPaywayConfig> implements
  DirectDebit,
  OnceOffPayment,
  RecurringPayment {
  private api: PaywayAPI

  protected get baseConfig(): IPaywayConfig {
    return {
      secretKey: '',
      publishableKey: '',
      apiRoot: '',
      responseType: 'json'
    }
  }

  constructor(config?: Partial<IPaywayConfig>) {
    super(config)
    Container.set('payway.config', config)
    this.api = Container.get('payway.api')
  }

  get name(): string {
    return 'Westpac PayWay'
  }

  get shortName(): string {
    return 'pay-way'
  }

  async charge(
    orderNumber: string,
    amountInCents: number,
    _creditCard?: ICreditCard,
    metadata?: Record<string, any>,
  ): Promise<IPaywayAPIResponse> {
    const chargeObject = new ChargeDTO({
      customerNumber: String(metadata?.customerNumber),
      principalAmount: amountInCents / 100,
      orderNumber,
      customerIpAddress: metadata?.customerIpAddress,
      merchantId: metadata?.merchantId,
    })
    let singleUserTokenId = String(metadata?.singleUserTokenId)
    let payload: IPaywayAPIResponse

    try {
      await validateOrReject(chargeObject)

      if (singleUserTokenId === undefined) {
        const creditCardObject = new CreditCardDTO(_creditCard!)
        await validateOrReject(creditCardObject)
        const ccTokenResponse = await this.api.getCCtoken(creditCardObject)
        singleUserTokenId = ccTokenResponse.data.singleUserTokenId
      }
      payload = await this.api.placeCharge(singleUserTokenId, chargeObject)
    } catch(error) {
      return Promise.reject(error)
    }
    return Promise.resolve(payload)
  }

  async chargeRecurring(
    customerNumber: string,
    frequency: PaywayPaymentFrequency,
    nextPaymentDate: string,
    regularPrincipalAmount: number,
    nextPrincipalAmount?: number,
    numberOfPaymentsRemaining?: number,
    finalPrincipalAmount?: number,
  ): Promise<IPaywayAPIResponse> {
    const scheduleObject = new PaymentScheduleDTO({
      frequency,
      nextPaymentDate,
      regularPrincipalAmount,
      nextPrincipalAmount,
      numberOfPaymentsRemaining,
      finalPrincipalAmount,
    })

    let payload: IPaywayAPIResponse

    try {
      await validateOrReject(scheduleObject)
      payload = await this.api.schedulePayment(customerNumber, scheduleObject)
    } catch(error) {
      return Promise.reject(error)
    }
    return Promise.resolve(payload)
  }

  async directDebit(
    customerId: string,
    paymentReference: string,
    amountInCents: number,
    metadata: Record<string, any>,
  ): Promise<IPaywayAPIResponse> {
    const chargeObject = new ChargeDTO({
      customerNumber: customerId,
      orderNumber: paymentReference,
      principalAmount: amountInCents,
      customerIpAddress: metadata?.customerIpAddress,
      merchantId: metadata?.merchantId,
      // bankAccountId,
    })

    let payload: IPaywayAPIResponse

    try {
      await validateOrReject(chargeObject)
      payload = await this.api.placeDirectCharge(chargeObject)
    } catch(error) {
      return Promise.reject(error)
    }
    return Promise.resolve(payload)
  }

}
