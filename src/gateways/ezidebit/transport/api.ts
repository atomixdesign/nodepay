import { Service, Inject, Container } from 'typedi'
import {
  Client as SoapClient,
} from 'soap'
import { Config } from '../config'
import { SoapClientFactory } from '@atomixdesign/nodepay/network/soap-client-factory'

@Service('ezidebit.api')
export class API {
  private soapClient: SoapClient | undefined

  constructor(
    @Inject('soap.client') private soapClientFactory: SoapClientFactory
  ) {}

  private async ensureClient(): Promise<void> {
    if (this.soapClient !== undefined) return Promise.resolve()
    const config: Config = Container.get('ezidebit.config')
    try {
      this.soapClient = await this.soapClientFactory!.createAsync(config)
    }
    catch(error) {
      console.error(error)
    }
  }

  async describe(): Promise<unknown> {
    await this.ensureClient()
    return this.soapClient!.describe()
  }
}
