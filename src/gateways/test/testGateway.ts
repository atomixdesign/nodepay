import { BaseGateway } from '../baseGateway'
import { DirectDebit, OnceOffPayment, RecurringPayment } from '../../features'

export class TestGateway extends BaseGateway implements RecurringPayment, DirectDebit, OnceOffPayment {
  get name(): string {
    return 'Test payment gateway'
  }

  get shortName(): string {
    return 'test'
  }

  charge(): any {
    return 'once-off'
  }

  chargeRecurring(): any {
    return 'recurring'
  }

  directDebit(): any {
    return 'direct-debit'
  }
}
