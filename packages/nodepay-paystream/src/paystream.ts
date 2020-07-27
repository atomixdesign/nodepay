// import { Container } from 'typedi'
// import { validateOrReject } from 'class-validator'
import { BaseGateway } from '@atomixdesign/nodepay-core'
import {
  OnceOffPayment,
  RecurringPayment,
} from '@atomixdesign/nodepay-core/features'
import { IPaystreamConfig } from './types'
import { IBaseCharge, IPaymentSchedule } from '@atomixdesign/nodepay-core/types'
import { IPaystreamAPIResponse } from './transport'


export class Paystream extends BaseGateway<IPaystreamConfig> implements
  OnceOffPayment,
  RecurringPayment
{
  protected get baseConfig(): IPaystreamConfig {
    return {
      username: '',
      apiKey: '',
      apiRoot: '',
    }
  }

  get name(): string {
    return 'Paystream'
  }

  get shortName(): string {
    return 'paystream'
  }

  async charge(
    _onceOffCharge: IBaseCharge //IPaywayCharge
  ): Promise<IPaystreamAPIResponse | undefined> {
    return
  }

  async chargeRecurring(
    _paymentSchedule: IPaymentSchedule //IPaywayCharge
  ): Promise<IPaystreamAPIResponse | undefined> {
    return
  }
}
