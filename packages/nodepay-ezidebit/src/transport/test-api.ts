import { IEzidebitAPIResponse, formatResponse } from './api-response'
import { CustomerDTO, OnceOffChargeDTO, PaymentScheduleDTO, PaymentDTO } from './dtos'

/** @internal */
export const MockResponse = {
  Data: { resultText: 'OK' },
  Error: 0,
  ErrorMessage: '',
}

/** @internal */
export class testAPI {
  constructor() {}

  async addCustomer(_customer: CustomerDTO): Promise<IEzidebitAPIResponse> {
    return formatResponse(MockResponse)
  }

  async placeCharge(_charge: OnceOffChargeDTO): Promise<IEzidebitAPIResponse> {
    return formatResponse(MockResponse)
  }

  async placeDirectCharge(_payment: PaymentDTO): Promise<IEzidebitAPIResponse> {
    return formatResponse(MockResponse)
  }

  async schedulePayment(_paymentSchedule: PaymentScheduleDTO): Promise<IEzidebitAPIResponse> {
    return formatResponse(MockResponse)
  }
}
