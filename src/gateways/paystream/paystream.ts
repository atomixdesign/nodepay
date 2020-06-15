import { BaseGateway } from '../base-gateway'

export type Config = {
  //
}

export class Paystream extends BaseGateway<Config> {
  protected get baseConfig(): Config {
    return {}
  }

  get name(): string {
    return 'Paystream'
  }

  get shortName(): string {
    return 'paystream'
  }
}
