import { BaseGateway } from '../base-gateway'

export type Config = {
  //
}

export class BPoint extends BaseGateway<Config> {
  protected get baseConfig(): Config {
    return {}
  }

  get name(): string {
    return 'BPoint'
  }

  get shortName(): string {
    return 'bpoint'
  }
}
