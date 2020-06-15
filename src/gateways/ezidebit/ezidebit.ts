import { BaseGateway } from '../base-gateway'

export type Config = {
  //
}

export class Ezidebit extends BaseGateway<Config> {
  protected get baseConfig(): Config {
    return {}
  }

  get name(): string {
    return 'Ezidebit'
  }

  get shortName(): string {
    return 'ezidebit'
  }
}
