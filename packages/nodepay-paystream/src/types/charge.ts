import { IBaseCharge, ICreditCard } from '@atomixdesign/nodepay-core/types'

/** @internal */
export interface IPaystreamInternalCharge extends IBaseCharge, ICreditCard {
  cardToken?: string
  customerIp: string
}
