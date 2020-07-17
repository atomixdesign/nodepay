import { IPaywayAPIResponse } from './api-response'
import { ChargeDTO, PaymentScheduleDTO } from './dtos'

/** @internal */
export const MockResponse = {
  status: 200,
  statusText: 'OK',
  data: 'randomTest',
  originalResponse: {}
}

/** @internal */
export class testAPI {
  constructor() {}

  async placeCharge(_singleUseTokenId: string, _charge: ChargeDTO): Promise<IPaywayAPIResponse> {
    return Promise.resolve(MockResponse)
  }

  async placeDirectCharge(_charge: ChargeDTO): Promise<IPaywayAPIResponse> {
    return Promise.resolve(MockResponse)
  }

  async schedulePayment(_customerNumber: string, _paymentSchedule: PaymentScheduleDTO): Promise<IPaywayAPIResponse> {
    return Promise.resolve(MockResponse)
  }
}
