import { ICustomerDetails } from '@atomixdesign/nodepay-core/types'

export interface IPaywayCustomer extends ICustomerDetails {
  customerId: string
  singleUseTokenId: string
  merchantId?: string
  bankAccountId?: string
  sendEmailReceipts?: boolean
  city?: string
}
