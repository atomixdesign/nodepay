import { Service, Inject } from 'typedi'
import {
  Client as SoapClient,
} from 'soap'
import { Config } from '../config'
import { SoapClientFactory } from '@atomixdesign/nodepay/network/soap-client-factory'
import { OnceOffChargeDTO } from '../dtos/once-off-charge'
import { APIResponse } from '@atomixdesign/nodepay/network/response'
import { CustomerDTO, CreditCardDTO } from '../dtos'

@Service('ezidebit.api')
export class API {
  private soapClient: SoapClient | undefined
  private nonPCISoapClient: SoapClient | undefined

  constructor(
    @Inject('ezidebit.config') private config: Config,
    @Inject('soap.client') private soapClientFactory: SoapClientFactory
  ) {}

  private async ensureClient(): Promise<void> {
    if (this.soapClient !== undefined) return Promise.resolve()
    try {
      this.soapClient = await this.soapClientFactory!.createAsync(this.config)
      this.nonPCISoapClient = await this.soapClientFactory!.createAsync({
        ...this.config,
        ...{ apiRoot: this.config.nonPCIApiRoot }
      })
    }
    catch(error) {
      return Promise.reject(error)
    }
  }

  async describe(): Promise<unknown> {
    await this.ensureClient()
    return this.soapClient!.describe()
  }

  async placeCharge(charge: OnceOffChargeDTO): Promise<APIResponse> {
    await this.ensureClient()
    let result
    try {
      result = await this.soapClient!.ProcessRealtimeCreditCardPaymentAsync({
        ...{ DigitalKey: this.config.digitalKey },
        ...charge,
      })
    } catch (error) {
      return Promise.reject(error)
    }

    return result[0].ProcessRealtimeCreditCardPaymentResult
  }

  async addCustomer(customer: CustomerDTO): Promise<APIResponse> {
    await this.ensureClient()
    let result
    try {
      result = await this.nonPCISoapClient!.AddCustomerAsync({
        ...{ DigitalKey: this.config.digitalKey },
        ...customer,
      })
    } catch (error) {
      return Promise.reject(error)
    }

    return result[0].AddCustomerResult
  }

  async addCustomerCC(
    customerReference: string,
    creditCard: CreditCardDTO,
  ): Promise<APIResponse> {
    await this.ensureClient()
    let result
    try {
      result = await this.soapClient!.EditCustomerCreditCardAsync({
        ...{
          EziDebitCustomerID: customerReference,
          DigitalKey: this.config.digitalKey,
        },
        ...creditCard,
      })
    } catch (error) {
      return Promise.reject(error)
    }

    return result[0].EditCustomerCreditCardResult
  }


}
