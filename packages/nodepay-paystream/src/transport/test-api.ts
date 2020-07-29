import { IPaystreamAPIResponse } from './api-response'
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

  async addCustomer(_customer: CustomerDTO): Promise<IPaystreamAPIResponse> {
    return Promise.resolve(MockResponse)
  }

  async placeCharge(_charge: ChargeDTO): Promise<IPaystreamAPIResponse> {
    return Promise.resolve(MockResponse)
  }

  async addSubscription(_subscription: SubscriptionDTO): Promise<IPaystreamAPIResponse> {
    return Promise.resolve(MockResponse)
  }
}
