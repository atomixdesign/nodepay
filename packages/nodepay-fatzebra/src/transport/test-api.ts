import { IFatzebraAPIResponse } from './api-response'
import { CustomerDTO, ChargeDTO, SubscriptionDTO, } from './dtos'

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

  async addSubscription(_subscription: SubscriptionDTO): Promise<IFatzebraAPIResponse> {
    return Promise.resolve(MockResponse)
  }
}
