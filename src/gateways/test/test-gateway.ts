import { BaseGateway } from '../base-gateway'
import { DirectDebit, OnceOffPayment, RecurringPayment } from '../../features'

export type Config = {
  apiKey: string
  backwards: string
}

export class TestGateway extends BaseGateway<Config> implements RecurringPayment, DirectDebit, OnceOffPayment {
  protected get baseConfig(): Config {
    return {
      apiKey: 'default-api-key',
      backwards: 'hello world',
    }
  }

  protected beforeConfig(config?: Partial<Config>): Partial<Config> | undefined {
    if (config?.apiKey === '') {
      config = {
        apiKey: 'empty-api-key'
      }
    }

    return config
  }

  protected afterConfig({ backwards, ...config }: Config): Config {
    return {
      ...config,
      backwards: backwards.split('').reverse().join(''),
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
