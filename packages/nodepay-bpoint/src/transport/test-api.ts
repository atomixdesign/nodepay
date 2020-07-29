import { IBaseResponse } from '@atomixdesign/nodepay-core/network'
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

  async placeCharge(_charge: ChargeDTO): Promise<IBaseResponse> {
    return Promise.resolve(MockResponse)
  }

  async schedulePayment(_paymentSchedule: ChargeDTO): Promise<IBaseResponse> {
    return Promise.resolve(MockResponse)
  }
}
