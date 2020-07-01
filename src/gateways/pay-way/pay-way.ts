import { Container } from 'typedi'
import { validateOrReject } from 'class-validator'
import { BaseGateway } from '../base-gateway'
import { DirectDebit, OnceOffPayment, RecurringPayment } from '@atomixdesign/nodepay/features'
import { Config } from './config'
import { API } from './transport/api'
import {
  ChargeDTO,
  PaymentScheduleDTO,
} from './dtos'
import { PaymentFrequency } from './payment-frequency'
import { APIResponse } from '../../network/response'

export class PayWay extends BaseGateway<Config> implements DirectDebit, OnceOffPayment, RecurringPayment {
  private api: API

  protected get baseConfig(): Config {
    return {
      secretKey: '',
      publishableKey: '',
      apiRoot: '',
      responseType: 'json'
    }
  }

  constructor(config?: Partial<Config>) {
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
    singleUserTokenId: string,
    customerNumber: string,
    principalAmount: number,
    orderNumber?: string | undefined,
    customerIpAddress?: string | undefined,
    merchantId?: string | undefined,
    bankAccountId?: string | undefined,
  ): Promise<APIResponse> {
    const chargeObject = new ChargeDTO({
      customerNumber,
      principalAmount,
      orderNumber,
      customerIpAddress,
      merchantId,
      bankAccountId,
    })

    let payload: APIResponse

    try {
      await validateOrReject(chargeObject)
      payload = await this.api.placeCharge(singleUserTokenId, chargeObject)
    } catch(error) {
      return Promise.reject(error)
    }
    return Promise.resolve(payload)
  }

  async chargeRecurring(
    customerNumber: string,
    frequency: PaymentFrequency,
    nextPaymentDate: string,
    regularPrincipalAmount: number,
    nextPrincipalAmount?: number,
    numberOfPaymentsRemaining?: number,
    finalPrincipalAmount?: number,
  ): Promise<APIResponse> {
    const scheduleObject = new PaymentScheduleDTO({
      frequency,
      nextPaymentDate,
      regularPrincipalAmount,
      nextPrincipalAmount,
      numberOfPaymentsRemaining,
      finalPrincipalAmount,
    })

    let payload: APIResponse

    try {
      await validateOrReject(scheduleObject)
      payload = await this.api.schedulePayment(customerNumber, scheduleObject)
    } catch(error) {
      return Promise.reject(error)
    }
    return Promise.resolve(payload)
  }

  async directDebit(
    customerNumber: string,
    principalAmount: number,
    orderNumber?: string | undefined,
    customerIpAddress?: string | undefined,
    merchantId?: string | undefined,
    bankAccountId?: string | undefined,
  ): Promise<APIResponse> {
    const chargeObject = new ChargeDTO({
      customerNumber,
      principalAmount,
      orderNumber,
      customerIpAddress,
      merchantId,
      bankAccountId,
    })

    let payload: APIResponse

    try {
      await validateOrReject(chargeObject)
      payload = await this.api.placeDirectCharge(chargeObject)
    } catch(error) {
      return Promise.reject(error)
    }
    return Promise.resolve(payload)
  }

}
