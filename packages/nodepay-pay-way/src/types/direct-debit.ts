import { IDirectDebit } from '@atomixdesign/nodepay-core/types'

export interface IPaywayDirectDebit extends IDirectDebit {
  customerIpAddress?: string
  merchantId?: string
}
