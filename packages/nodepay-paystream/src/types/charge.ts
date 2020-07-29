import { IBaseCharge } from '@atomixdesign/nodepay-core/types'

export interface IPaystreamCharge extends IBaseCharge {
  cardToken?: string
  customerIp: string
}
