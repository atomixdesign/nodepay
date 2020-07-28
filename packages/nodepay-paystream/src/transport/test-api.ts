import { IPaystreamAPIResponse } from './api-response'
import { ChargeDTO /*, PaymentScheduleDTO */ } from './dtos'

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

  async placeCharge(_charge: ChargeDTO): Promise<IPaystreamAPIResponse> {
    return Promise.resolve(MockResponse)
  }

  async schedulePayment(/* _paymentSchedule: PaymentScheduleDTO */): Promise<IPaystreamAPIResponse> {
    return Promise.resolve(MockResponse)
  }
}
