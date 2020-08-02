import { Service, Inject } from 'typedi'
import {
  Client as SoapClient,
} from 'soap'
import { EzidebitConfig } from '../types'
import { SoapClientFactory } from '@atomixdesign/nodepay-core/network'
import { IEzidebitAPIResponse, formatResponse } from './api-response'
import {
  CreditCardDTO,
  CustomerDTO,
  OnceOffChargeDTO,
  PaymentDTO,
  PaymentScheduleDTO,
} from './dtos'
import { EzidebitAPIError } from './api-error'

@Service('ezidebit.api')
export class EzidebitAPI {
  private soapClient: SoapClient | undefined
  private nonPCISoapClient: SoapClient | undefined

  constructor(
    @Inject('ezidebit.config') private config: EzidebitConfig,
    @Inject('soap.client') private soapClientFactory: SoapClientFactory
  ) { }

  private async ensureClient(): Promise<void> {
    if (
      this.soapClient !== undefined &&
      this.nonPCISoapClient !== undefined
    ) return

    this.soapClient = await this.soapClientFactory!.createAsync(this.config)
    this.nonPCISoapClient = await this.soapClientFactory!.createAsync({
      ...this.config,
      ...{ apiRoot: this.config.nonPCIApiRoot }
    })
  }

  async describe(pci = true): Promise<unknown> {
    await this.ensureClient()
    return pci ? this.soapClient!.describe() : this.nonPCISoapClient!.describe()
  }

  async addCustomer(customer: CustomerDTO): Promise<IEzidebitAPIResponse> {
    await this.ensureClient()

    const response = await this.nonPCISoapClient!.AddCustomerAsync({
      ...{ DigitalKey: this.config.digitalKey },
      ...customer,
    })
    if (response[0]?.AddCustomerResult?.ErrorMessage !== undefined) {
      return Promise.reject(new EzidebitAPIError(response[0].AddCustomerResult))
    }

    return formatResponse(response[0]?.AddCustomerResult)
  }

  async addCustomerCC(
    creditCard: CreditCardDTO,
  ): Promise<IEzidebitAPIResponse> {
    await this.ensureClient()

    const response = await this.soapClient!.EditCustomerCreditCardAsync({
      ...{
        DigitalKey: this.config.digitalKey,
      },
      ...creditCard,
    })
    if (response[0]?.EditCustomerCreditCardResult?.ErrorMessage !== undefined) {
      throw new EzidebitAPIError(response[0].EditCustomerCreditCardResult)
    }

    return formatResponse(response[0]?.EditCustomerCreditCardResult)
  }

  async placeCharge(charge: OnceOffChargeDTO): Promise<IEzidebitAPIResponse> {
    await this.ensureClient()

    const response = await this.soapClient!.ProcessRealtimeCreditCardPaymentAsync({
      ...{ DigitalKey: this.config.digitalKey },
      ...charge,
    })
    if (response[0]?.ProcessRealtimeCreditCardPaymentResult?.ErrorMessage !== undefined) {
      throw new EzidebitAPIError(response[0].ProcessRealtimeCreditCardPaymentResult)
    }

    return formatResponse(response[0]?.ProcessRealtimeCreditCardPaymentResult)
  }

  async placeDirectCharge(
    payment: PaymentDTO,
  ): Promise<IEzidebitAPIResponse> {
    await this.ensureClient()

    const response = await this.nonPCISoapClient!.AddPaymentAsync({
      ...{ DigitalKey: this.config.digitalKey },
      ...payment,
    })
    if (response[0]?.AddPaymentResult?.ErrorMessage !== undefined) {
      throw new EzidebitAPIError(response[0].AddPaymentResult)
    }

    return formatResponse(response[0].AddPaymentResult)
  }

  async schedulePayment(schedule: PaymentScheduleDTO): Promise<IEzidebitAPIResponse> {
    await this.ensureClient()

    const response = await this.nonPCISoapClient!.CreateScheduleAsync({
      ...{
        DigitalKey: this.config.digitalKey,
      },
      ...schedule,
    })
    if (response[0]?.CreateScheduleResult.ErrorMessage !== undefined) {
      throw new EzidebitAPIError(response[0]?.CreateScheduleResult)
    }

    return formatResponse(response[0].CreateScheduleResult)
  }
}
