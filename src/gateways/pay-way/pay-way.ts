import { Container } from 'typedi'
import { BaseGateway } from '../base-gateway'
import { DirectDebit, OnceOffPayment, RecurringPayment } from '@atomixdesign/nodepay/features'
import { API as PayWayTransport } from './transport/api'
import { Config } from './config'
// import { HttpClientFactory } from '@atomixdesign/nodepay/network/http-client-factory'

export class PayWay extends BaseGateway<Config> implements DirectDebit, OnceOffPayment, RecurringPayment {
  private api: PayWayTransport

  protected get baseConfig(): Config {
    return {
      secretKey: '',
      publishableKey: '',
      apiRoot: '',
      responseType: 'json'
    }
  }

  constructor(config?: Partial<Config>) {
    super(config)
    this.api = Container.get(PayWayTransport) // new Transport(this.config, Container.get(HttpClientFactory))
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
