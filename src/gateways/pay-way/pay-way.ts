import { BaseGateway } from '../base-gateway'
import { DirectDebit, OnceOffPayment, RecurringPayment } from '../../features'
import { API as Transport } from './transport/api'
import { Config } from './config'

export class PayWay extends BaseGateway<Config> implements DirectDebit, OnceOffPayment, RecurringPayment {
  private api: Transport

  protected get baseConfig(): Config {
    return {
      apiKey: '',
      apiRoot: 'https://api.payway.com.au/rest/v1',
    }
  }

  constructor(config?: Partial<Config>) {
    super(config)
    this.api = new Transport(this.config)
  }

  get name(): string {
    return 'Westpac PayWay'
  }

  get shortName(): string {
    return 'pay-way'
  }

  charge(): string {
    return 'once-off'
  }

  chargeRecurring(): string {
    return 'recurring'
  }

  directDebit(): string {
    return 'direct-debit'
  }
}
