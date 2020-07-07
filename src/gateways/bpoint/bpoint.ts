import { Container } from 'typedi'
import { BaseGateway } from '../base-gateway'
import { DirectDebit, OnceOffPayment, RecurringPayment } from '@atomixdesign/nodepay/features'
import { Config } from './types'
import { API, APIResponse } from './transport'
/* import {
  ChargeDTO,
  PaymentScheduleDTO,
} from './transport/dtos' */

export class BPOINT extends BaseGateway<Config> implements DirectDebit, OnceOffPayment, RecurringPayment {
  private api: API

  protected get baseConfig(): Config {
    return {
      username: '',
      merchantId: '',
      password: '',
      apiRoot: '',
    }
  }

  constructor(config?: Partial<Config>) {
    super(config)
    Container.set('bpoint.config', config)
    this.api = Container.get('bpoint.api')
  }

  get name(): string {
    return 'BPOINT'
  }

  get shortName(): string {
    return 'bpoint'
  }

  async charge(): Promise<APIResponse> {
    const response = {
      status: 200,
      statusText: 'OK',
      data: {},
    }
    return Promise.resolve(response)
  }

  async chargeRecurring(): Promise<APIResponse> {
    const response = {
      status: 200,
      statusText: 'OK',
      data: {},
    }
    return Promise.resolve(response)
  }

  async directDebit(): Promise<APIResponse> {
    const response = {
      status: 200,
      statusText: 'OK',
      data: {},
    }
    return Promise.resolve(response)
  }

}
