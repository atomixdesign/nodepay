import { APIResponse } from '../../../network/response'
import { ChargeDTO, PaymentScheduleDTO } from '../dtos'

export const MockResponse = {
  response: {
    status: 200,
    statusText: 'OK',
  },
  value: 'randomTest'
}

export class testAPI {
  constructor() {}

  async placeCharge(_singleUseTokenId: string, _charge: ChargeDTO): Promise<APIResponse> {
    return Promise.resolve(MockResponse)
  }

  async placeDirectCharge(_charge: ChargeDTO): Promise<APIResponse> {
    return Promise.resolve(MockResponse)
  }

  async schedulePayment(_customerNumber: string, _paymentSchedule: PaymentScheduleDTO): Promise<APIResponse> {
    return Promise.resolve(MockResponse)
  }
}
