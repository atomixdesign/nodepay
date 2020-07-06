import { Service, Inject } from 'typedi'
import {
  Client as SoapClient,
} from 'soap'
import { Config } from '../types'
import { SoapClientFactory } from '@atomixdesign/nodepay/network'
import { APIResponse, formatResponse } from './api-response'
import {
  CreditCardDTO,
  CustomerDTO,
  OnceOffChargeDTO,
  PaymentDTO,
  PaymentScheduleDTO, } from './dtos'

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

    return formatResponse(result[0].AddCustomerResult)
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

    return formatResponse(result[0].EditCustomerCreditCardResult)
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

    return formatResponse(result[0].ProcessRealtimeCreditCardPaymentResult)
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

    return formatResponse(result[0].AddPaymentResult)
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

    return formatResponse(result[0].CreateScheduleResult)
  }
}
