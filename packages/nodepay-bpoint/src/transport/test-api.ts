import { IBaseResponse } from '@atomixdesign/nodepay-core/build/network'
import { ChargeDTO, CustomerDTO } from './dtos'

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

  async addCustomer(_customer: CustomerDTO): Promise<IBaseResponse> {
    return Promise.resolve(MockResponse)
  }

  async updateCustomer(
    _reference: string,
    _customer: CustomerDTO,
  ): Promise<IBaseResponse> {
    return Promise.resolve(MockResponse)
  }

  async placeCharge(_charge: ChargeDTO): Promise<IBaseResponse> {
    return Promise.resolve(MockResponse)
  }

  async schedulePayment(_paymentSchedule: ChargeDTO): Promise<IBaseResponse> {
    return Promise.resolve(MockResponse)
  }
}
