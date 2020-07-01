import { Service } from 'typedi'
import { Client, createClientAsync } from 'soap'
import { INetworkFactory } from './network-client-factory'

// const DEBUG = process.env.environment !== 'production'

@Service('soap.client')
export class SoapClientFactory implements INetworkFactory<Client> {
  async createAsync(config?: Partial<Record<string, unknown>>): Promise<Client>{
    let soapClient: Client

    if (typeof config?.apiRoot === 'string') {
      soapClient = createClientAsync(`${config.apiRoot}?singleWsdl`, {
        preserveWhitespace: true
      })
      soapClient.on('request', (xml: string) => {
        // eslint-disable-next-line unicorn/no-null
        console.dir(xml, { depth: null })
      })
      return soapClient
    }
    return Promise.reject('Couldn\'t instantiate soap client')
  }
}
