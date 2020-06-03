import { BaseGateway } from '../base-gateway'
import { DirectDebit, OnceOffPayment, RecurringPayment } from '../../features'

export type Config = {
  apiKey: string
}

export class TestGateway extends BaseGateway<Config> implements RecurringPayment, DirectDebit, OnceOffPayment {
  protected get baseConfig(): Config {
    return {
      apiKey: 'default-api-key',
    }
  }

  get name(): string {
    return 'Test payment gateway'
  }

  get shortName(): string {
    return 'test'
  }

  charge(): string {
    return 'once-off'
  }

  chargeRecurring(): string {
    return 'recurring'
  }

  directDebit(): string {
    return this.config.apiKey
  }
}
