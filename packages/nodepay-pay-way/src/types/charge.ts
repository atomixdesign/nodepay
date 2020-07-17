export interface IPaywayBaseCharge {
  customerNumber: string
  orderNumber?: string
  principalAmount: number
  customerIpAddress?: string
  merchantId?: string
  bankAccountId?: string
}
