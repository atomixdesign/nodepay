import { APIResponse } from './api-response'

export const MockResponse = {
  status: 200,
  statusText: 'OK',
  data: 'randomTest'
}

export class testAPI {
  constructor() {}

  async placeCharge(_charge?: unknown): Promise<APIResponse> {
    return Promise.resolve(MockResponse)
  }

  async placeDirectCharge(_directCharge?: unknown): Promise<APIResponse> {
    return Promise.resolve(MockResponse)
  }

  async schedulePayment(_paymentSchedule?: unknown): Promise<APIResponse> {
    return Promise.resolve(MockResponse)
  }
}
