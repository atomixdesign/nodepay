import { IBaseCharge } from '@atomixdesign/nodepay-core/types'

/** @internal */
export interface IPaywayInternalCharge {
  customerId: string
  orderNumber?: string
  principalAmount: number
  customerIpAddress?: string
  merchantId?: string
  bankAccountId?: string
}

export interface IPaywayCharge extends IBaseCharge {
  customerId?: string
  customerIpAddress?: string
  merchantId?: string
  singleUseTokenId?: string
}
