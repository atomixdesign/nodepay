export interface IBaseAccount {
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

export interface ICustomer extends IBaseAccount {
  ContractStartDate: string
  AddressLine1?: string
  AddressLine2?: string
  AddressSuburb?: string
  AddressState?: string
  AddressPostCode?: string
}
