import { IBPOINTAPIResponse } from './api-response'
import { ChargeDTO } from './dtos'

/** @internal */
export const MockResponse = {
  status: 200,
  statusText: 'OK',
  data: 'randomTest',
  originalResponse: {},
}

/** @internal */
export class testAPI {
  constructor() {}

  async placeCharge(_charge: ChargeDTO): Promise<IBPOINTAPIResponse> {
    return Promise.resolve(MockResponse)
  }

  async schedulePayment(_paymentSchedule: ChargeDTO): Promise<IBPOINTAPIResponse> {
    return Promise.resolve(MockResponse)
  }
}
