import { BaseGateway } from '../base-gateway'
import { DirectDebit, OnceOffPayment, RecurringPayment } from '../../features'

export type Config = {
  //
}

export class PayWay extends BaseGateway<Config> implements DirectDebit, OnceOffPayment, RecurringPayment {
  protected get baseConfig(): Config {
    return {}
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
