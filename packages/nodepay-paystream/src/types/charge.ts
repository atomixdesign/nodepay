import { IBaseCharge } from '@atomixdesign/nodepay-core/types'

export interface IPaystreamInternalCharge extends IBaseCharge {
  cardToken?: string
  customerIp: string
}
