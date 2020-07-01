import { BaseGateway } from '../base-gateway'
import { DirectDebit, OnceOffPayment, RecurringPayment } from '../../features'
import { API as Transport } from './transport/api'
import { Config } from './config'

export class Ezidebit extends BaseGateway<Config> implements DirectDebit, OnceOffPayment, RecurringPayment {
  private api: Transport

  protected get baseConfig(): Config {
    return {
      clientId: '',
      digitalKey: '',
      publicKey: '',
      apiRoot: '',
    }
  }

  constructor(config?: Partial<Config>) {
    super(config)
    this.api = new Transport(this.config)
  }

  get name(): string {
    return 'Ezidebit'
  }

  get shortName(): string {
    return 'ezidebit'
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
}
