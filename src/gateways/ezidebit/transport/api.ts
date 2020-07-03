import { Service, Inject } from 'typedi'
import {
  Client as SoapClient,
} from 'soap'
import { Config } from '../config'
import { SoapClientFactory } from '@atomixdesign/nodepay/network/soap-client-factory'
import { OnceOffChargeDTO } from '../dtos/once-off-charge'
import { APIResponse, IEzidebitResponse } from './api-response'
import { CustomerDTO, CreditCardDTO, PaymentDTO, PaymentScheduleDTO } from '../dtos'

@Service('ezidebit.api')
export class API {
  private soapClient: SoapClient | undefined
  private nonPCISoapClient: SoapClient | undefined

  constructor(
    @Inject('ezidebit.config') private config: Config,
    @Inject('soap.client') private soapClientFactory: SoapClientFactory
  ) { }

  private async ensureClient(): Promise<void> {
    if (this.soapClient !== undefined) return Promise.resolve()
    try {
      this.soapClient = await this.soapClientFactory!.createAsync(this.config)
      this.nonPCISoapClient = await this.soapClientFactory!.createAsync({
        ...this.config,
        ...{ apiRoot: this.config.nonPCIApiRoot }
      })
    }
    catch (error) {
      return Promise.reject(error)
    }
  }

  private formatResponse(payload: IEzidebitResponse): APIResponse{
    const dataHash = typeof payload.Data === 'string' ? payload.Data : payload.Data.toString()

    return {
      status: payload.ErrorMessage !== undefined ? payload.Error : 200,
      statusText: payload.ErrorMessage !== undefined ? payload.ErrorMessage : dataHash,
      internalErrorCode: payload.Error,
      data: payload.Data,
    }
  }

  async describe(pci = true): Promise<unknown> {
    await this.ensureClient()
    return pci ? this.soapClient!.describe() : this.nonPCISoapClient!.describe()
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

    return this.formatResponse(result[0].AddCustomerResult)
  }

  async addCustomerCC(
    creditCard: CreditCardDTO,
  ): Promise<APIResponse> {
    await this.ensureClient()
    let result
    try {
      result = await this.soapClient!.EditCustomerCreditCardAsync({
        ...{
          DigitalKey: this.config.digitalKey,
        },
        ...creditCard,
      })
    } catch (error) {
      return Promise.reject(error)
    }

    return this.formatResponse(result[0].EditCustomerCreditCardResult)
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

    return this.formatResponse(result[0].ProcessRealtimeCreditCardPaymentResult)
  }

  async placeDirectCharge(
    payment: PaymentDTO,
  ): Promise<APIResponse> {
    await this.ensureClient()
    let result
    try {
      result = await this.nonPCISoapClient!.AddPaymentAsync({
        ...{ DigitalKey: this.config.digitalKey },
        ...payment,
      })
    } catch (error) {
      return Promise.reject(error)
    }

    return this.formatResponse(result[0].AddPaymentResult)
  }

  async schedulePayment(schedule: PaymentScheduleDTO): Promise<APIResponse> {
    await this.ensureClient()
    let result
    try {
      result = await this.nonPCISoapClient!.CreateScheduleAsync({
        ...{
          DigitalKey: this.config.digitalKey,
        },
        ...schedule,
      })
    } catch (error) {
      return Promise.reject(error)
    }

    return this.formatResponse(result[0].CreateScheduleResult)
  }
}
