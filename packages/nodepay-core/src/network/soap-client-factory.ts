import { Service } from 'typedi'
import { Client, createClientAsync } from 'soap'
import { INetworkFactory } from './network-client-factory'
import { parseString } from 'xml2js'
import util from 'util'

const DEBUG = false // process.env.environment !== 'production'

@Service('soap.client')
export class SoapClientFactory implements INetworkFactory<Client> {
  private parseResponse(parsingError: Error, result: Record<string, unknown>) {
    if (parsingError) console.error(parsingError)
    /* eslint-disable unicorn/no-null */
    else console.log(util.inspect(result, false, null))
  }

  async createAsync(config?: Partial<Record<string, unknown>>): Promise<Client>{
    let soapClient: Client

    if (typeof config?.apiRoot === 'string') {
      soapClient = await createClientAsync(`${config.apiRoot}?singleWsdl`, {
        preserveWhitespace: true
      })
      if (DEBUG) {
        soapClient.on('request', (xml: string) => {
          console.dirxml(xml)
          // parseString(xml, this.parseResponse)
        })
        soapClient.on('response', (body) => {
          parseString(body, this.parseResponse)
        })
        soapClient.on('soapError', (soapError) => {
          parseString(soapError, this.parseResponse)
        })
      }
      return soapClient
    }
    return Promise.reject('Couldn\'t instantiate soap client')
  }
}
