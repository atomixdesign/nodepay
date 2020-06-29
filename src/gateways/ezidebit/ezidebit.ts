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
      testAPI: '',
      liveAPI: '',
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
