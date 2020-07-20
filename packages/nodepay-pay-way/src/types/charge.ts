import { IBaseCharge } from '@atomixdesign/nodepay-core/types'

/** @internal */
export interface IPaywayInternalCharge {
  customerNumber: string
  orderNumber?: string
  principalAmount: number
  customerIpAddress?: string
  merchantId?: string
  bankAccountId?: string
}

export interface IPaywayCharge extends IBaseCharge {
  customerNumber?: string
  customerIpAddress?: string
  merchantId?: string
  singleUseTokenId?: string
}
