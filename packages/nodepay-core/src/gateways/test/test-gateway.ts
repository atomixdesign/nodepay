import { BaseGateway } from '../base-gateway'
import { DirectDebit, OnceOffPayment, RecurringPayment } from '../../features'

/** @internal */
export type Config = {
  apiKey: string
  backwards: string
}

/** @internal */
export class TestGateway extends BaseGateway<Config> implements DirectDebit, OnceOffPayment, RecurringPayment {
  protected get baseConfig(): Config {
    return {
      apiKey: 'default-api-key',
      backwards: 'hello world',
    }
  }

  protected beforeConfig(config?: Partial<Config>): Partial<Config> | undefined {
    if (config?.apiKey === '') {
      config = {
        apiKey: 'empty-api-key',
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

  async charge(): Promise<Record<string, string>> {
    return Promise.resolve({ 'result' : 'once-off' })
  }

  async chargeRecurring(): Promise<Record<string, string>> {
    return Promise.resolve({ 'result' : 'recurring' })
  }

  async directDebit(): Promise<Record<string, string>> {
    return Promise.resolve({ 'result' : 'direct-debit' })
  }

  async createBankAccount(): Promise<Record<string, string>> {
    return Promise.resolve({ 'result' : 'direct-debit' })
  }
}
