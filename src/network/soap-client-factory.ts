import { Service } from 'typedi'
import { Client, createClientAsync } from 'soap'
import { INetworkFactory } from './network-client-factory'

// const DEBUG = process.env.environment !== 'production'

@Service('soap.client')
export class SoapClientFactory implements INetworkFactory<Client> {
  async createAsync(config?: Partial<Record<string, unknown>>): Promise<Client>{
    if (typeof config?.apiRoot === 'string') {
      return createClientAsync(`${config.apiRoot}?wsdl`)
    }
    return Promise.reject('Couldn\'t instantiate soap client')
  }
}
