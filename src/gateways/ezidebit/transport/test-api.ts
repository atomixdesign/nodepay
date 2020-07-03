import { APIResponse } from './api-response'
import { OnceOffChargeDTO, PaymentScheduleDTO, PaymentDTO } from '../dtos'

export const MockResponse = {
  Data: {},
  Error: {}
}

export class testAPI {
  constructor() {}

  async placeCharge(_charge: OnceOffChargeDTO): Promise<APIResponse> {
    return Promise.resolve(MockResponse)
  }

  async placeDirectCharge(_payment: PaymentDTO): Promise<APIResponse> {
    return Promise.resolve(MockResponse)
  }

  async schedulePayment(_paymentSchedule: PaymentScheduleDTO): Promise<APIResponse> {
    return Promise.resolve(MockResponse)
  }
}
