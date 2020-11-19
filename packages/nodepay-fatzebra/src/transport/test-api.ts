import { IFatzebraAPIResponse } from './api-response'
import { CustomerDTO, ChargeDTO, PaymentPlanDTO, } from './dtos'

/** @internal */
export const MockResponse = {
  status: 200,
  statusText: 'OK',
  data: {
    response: {},
    successful: true,
  },
  originalResponse: {}
}

/** @internal */
export class testAPI {
  constructor() {}

  async getCustomer(_customerId: string): Promise<IFatzebraAPIResponse> {
    return Promise.resolve(MockResponse)
  }

  async addCustomer(_customer: CustomerDTO): Promise<IFatzebraAPIResponse> {
    return Promise.resolve(MockResponse)
  }

  async updateCustomer(
    _reference: string,
    _customer: CustomerDTO,
  ): Promise<IFatzebraAPIResponse> {
    return Promise.resolve(MockResponse)
  }

  async placeCharge(_charge: ChargeDTO): Promise<IFatzebraAPIResponse> {
    return Promise.resolve(MockResponse)
  }

  async addPaymentPlan(_subscription: PaymentPlanDTO): Promise<IFatzebraAPIResponse> {
    return Promise.resolve(MockResponse)
  }
}
