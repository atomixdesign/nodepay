import { APIResponse } from './api-response'
import { ChargeDTO } from './dtos'

export const MockResponse = {
  status: 200,
  statusText: 'OK',
  data: 'randomTest'
}

export class testAPI {
  constructor() {}

  async placeCharge(_charge: ChargeDTO): Promise<APIResponse> {
    return Promise.resolve(MockResponse)
  }

  async schedulePayment(_paymentSchedule: ChargeDTO): Promise<APIResponse> {
    return Promise.resolve(MockResponse)
  }
}
