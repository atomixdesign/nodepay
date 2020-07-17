import { IEzidebitAPIResponse, formatResponse } from './api-response'
import { OnceOffChargeDTO, PaymentScheduleDTO, PaymentDTO } from './dtos'

/** @internal */
export const MockResponse = {
  Data: { resultText: 'OK' },
  Error: 0,
  ErrorMessage: '',
}

/** @internal */
export class testAPI {
  constructor() {}

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
