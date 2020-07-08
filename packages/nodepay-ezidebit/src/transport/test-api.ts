import { APIResponse, formatResponse } from './api-response'
import { OnceOffChargeDTO, PaymentScheduleDTO, PaymentDTO } from './dtos'

export const MockResponse = {
  Data: { resultText: 'OK' },
  Error: 0,
  ErrorMessage: '',
}

export class testAPI {
  constructor() {}

  async placeCharge(_charge: OnceOffChargeDTO): Promise<APIResponse> {
    return formatResponse(MockResponse)
  }

  async placeDirectCharge(_payment: PaymentDTO): Promise<APIResponse> {
    return formatResponse(MockResponse)
  }

  async schedulePayment(_paymentSchedule: PaymentScheduleDTO): Promise<APIResponse> {
    return formatResponse(MockResponse)
  }
}
