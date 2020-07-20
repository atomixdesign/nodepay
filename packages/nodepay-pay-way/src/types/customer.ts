import { ICustomerDetails } from '@atomixdesign/nodepay-core/types'

export interface IPaywayCustomer extends ICustomerDetails {
  customerNumber: string
  singleUseTokenId: string
  merchantId?: string
  bankAccountId?: string
  sendEmailReceipts?: boolean
  city?: string
}
