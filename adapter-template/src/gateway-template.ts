import { Container } from 'typedi'
import { BaseGateway } from '@atomixdesign/nodepay-core/gateways'
import { DirectDebit, OnceOffPayment, RecurringPayment } from '@atomixdesign/nodepay-core/features'
import { Config } from './types'
import { API, APIResponse } from './transport'

export class SampleGateway extends BaseGateway<Config> implements DirectDebit, OnceOffPayment, RecurringPayment {
  private api: API

  protected get baseConfig(): Config {
    return {
      secretKey: '',
      apiRoot: '',
    }
  }

  constructor(config?: Partial<Config>) {
    super(config)
    Container.set('<gateway>.config', config)
    this.api = Container.get('<gateway>.api')
  }

  get name(): string {
    return 'Gateway Template'
  }

  get shortName(): string {
    return 'gateway template'
  }

  async charge(charge: object): Promise<APIResponse> {}

  async chargeRecurring(schedule: object): Promise<APIResponse> {}

  async directDebit(directCharge: object): Promise<APIResponse> {}
}
