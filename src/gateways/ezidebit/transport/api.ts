import {
  createClientAsync,
  Client as SoapClient,
} from 'soap'
import { Config } from '../config'
import { BaseAPI } from '../../../network/base-api'

export class API extends BaseAPI {
  private config: Config

  constructor(config: Config) {
    super()
    this.config = config
  }

  async describe(): Promise<unknown> {
    const client: SoapClient = await createClientAsync(`${this.config.apiRoot}?wsdl`)
    return client.describe()
  }
}
