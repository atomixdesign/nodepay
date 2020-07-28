import { ICustomerDetails } from '@atomixdesign/nodepay-core/types'

export interface IEzidebitBaseAccount {
  YourSystemReference: string
  YourGeneralReference?: string
  LastName: string
  SmsPaymentReminder: string
  SmsFailedNotification: string
  SmsExpiredCard: string
  FirstName?: string
  EmailAddress?: string
  MobilePhoneNumber?: string
  Username?: string
}

/** @internal */
export interface IEzidebitInternalCustomer extends IEzidebitBaseAccount {
  ContractStartDate: string
  AddressLine1?: string
  AddressLine2?: string
  AddressSuburb?: string
  AddressState?: string
  AddressPostCode?: string
}

export interface IEzidebitCustomer extends ICustomerDetails {
  customerId?: string
  generalReference?: string
  contractStartDate: string
  suburb?: string
  smsPaymentReminder?: 'YES' | 'NO'
  smsFailedNotification?: 'YES' | 'NO'
  smsExpiredCard?: 'YES' | 'NO'
  username?: string
}
