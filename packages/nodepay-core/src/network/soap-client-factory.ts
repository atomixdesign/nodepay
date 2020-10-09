import { Service } from 'typedi'
import { Client, createClientAsync } from 'soap'
// import { parseString } from 'xml2js'
import { inspect } from 'util'
import { NetworkClientAsyncFactory } from './types/network-client-factory'

/** @internal */
const DEBUG = false

@Service('soap.client')
export class SoapClientFactory extends NetworkClientAsyncFactory<Client> {
  private parseResponse(parsingError: Error, result: Record<string, unknown>) {
    if (DEBUG) {
      if (parsingError) console.error(parsingError)
      /* eslint-disable unicorn/no-null */
      else console.log(inspect(result, false, null))
    }
  }

  async createAsync(config?: Partial<Record<string, unknown>>): Promise<Client>{
    let soapClient: Client

    if (typeof config?.apiRoot === 'string') {
      soapClient = await createClientAsync(`${config.apiRoot}?singleWsdl`, {
        preserveWhitespace: true
      })
      /* soapClient.on('request', (xml: string) => {
        // console.dirxml(xml)
        parseString(xml, this.parseResponse)
      })
      soapClient.on('response', (body) => {
        parseString(body, this.parseResponse)
      })
      soapClient.on('soapError', (soapError) => {
        parseString(soapError, this.parseResponse)
      }) */

      return soapClient
    }
    return Promise.reject('Couldn\'t instantiate soap client')
  }
}
