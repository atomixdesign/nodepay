// handles configurable retry
import axios, { AxiosResponse } from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { Config } from '../config'

export class API {
  private config: Config
  private idempotencyKey: string

  constructor(config: Config) {
    this.config = config
    this.idempotencyKey = uuidv4()
  }

  authenticate(): Promise<AxiosResponse> {
    // Perform authentication query
    return axios.get(this.config.apiRoot, {
      auth: {
        username: this.config.apiKey,
        password: ''
      }
    })
  }

  verifyKey(): boolean {
    // Verify key validity
    return false
  }

  getCCtoken(): string {
    return ''
  }

  getBankAccountToken(): string {
    return ''
  }

  addCustomer(customerNumber?: string): string | undefined {
    return customerNumber
  }

  placeCharge(/* singleUseTokenId?: string, charge: ChargeDTO */): boolean {
    return false
  }

  schedulePayment(/* customerNumber: string, schedule: PaymentScheduleDTO */): boolean {
    return false
  }
}
