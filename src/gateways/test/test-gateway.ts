import { BaseGateway } from '../base-gateway'
import { DirectDebit, OnceOffPayment, RecurringPayment } from '../../features'

export class TestGateway extends BaseGateway implements RecurringPayment, DirectDebit, OnceOffPayment {
  get name(): string {
    return 'Test payment gateway'
  }

  get shortName(): string {
    return 'test'
  }

  charge(): string {
    return 'once-off'
  }

  chargeRecurring(): string {
    return 'recurring'
  }

  directDebit(): string {
    return 'direct-debit'
  }
}
