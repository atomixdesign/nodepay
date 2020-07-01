import {
  createClientAsync,
  Client as SoapClient,
} from 'soap'
import { Config } from '../config'

export class API {
  constructor(private config: Config) {}

  async describe(): Promise<unknown> {
    const client: SoapClient = await createClientAsync(`${this.config.apiRoot}?wsdl`)
    return client.describe()
  }
}
