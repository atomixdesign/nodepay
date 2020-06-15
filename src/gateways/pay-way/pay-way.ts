import { BaseGateway } from '../base-gateway'

export type Config = {
  //
}

export class PayWay extends BaseGateway<Config> {
  protected get baseConfig(): Config {
    return {}
  }

  get name(): string {
    return 'Westpac PayWay'
  }

  get shortName(): string {
    return 'pay-way'
  }
}
