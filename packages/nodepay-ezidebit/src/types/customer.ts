import { ICustomerDetails } from '@atomixdesign/nodepay-core/build/types'

/** @internal */
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
export interface IEzidebitCustomerAddress {
  AddressLine1?: string
  AddressLine2?: string
  AddressSuburb?: string
  AddressState?: string
  AddressPostCode?: string
}

/** @internal */
export interface IEzidebitInternalCustomer extends IEzidebitBaseAccount, IEzidebitCustomerAddress {
  ContractStartDate: string
}

/** @internal */
export interface IEzidebitInternalCustomerDetails extends IEzidebitBaseAccount, IEzidebitCustomerAddress {
  NewYourSystemReference: string
}

/** @internal */
export interface IEzidebitCustomerBase extends ICustomerDetails {
  customerId?: string
  generalReference?: string
  suburb?: string
  smsPaymentReminder?: 'YES' | 'NO'
  smsFailedNotification?: 'YES' | 'NO'
  smsExpiredCard?: 'YES' | 'NO'
  username?: string
}

export class EzidebitCustomer implements IEzidebitCustomerBase {
  constructor(
    public readonly customerId: string,
    public readonly contractStartDate: string,
    public readonly lastName: string,
    public readonly smsPaymentReminder?: 'YES' | 'NO',
    public readonly smsFailedNotification?: 'YES' | 'NO',
    public readonly smsExpiredCard?: 'YES' | 'NO',
    public readonly generalReference?: string,
    public readonly firstName?: string,
    public readonly address1?: string,
    public readonly address2?: string,
    public readonly suburb?: string,
    public readonly postCode?: string,
    public readonly region?: string,
    public readonly emailAddress?: string,
    public readonly phoneNumber?: string,
    public readonly username?: string,
  ) {}
}

export class EzidebitCustomerDetails implements IEzidebitCustomerBase {
  constructor(
    public readonly generalReference: string,
    public readonly lastName: string,
    public readonly firstName: string,
    public readonly address1: string,
    public readonly address2: string,
    public readonly suburb: string,
    public readonly postCode: string,
    public readonly region: string,
    public readonly emailAddress: string,
    public readonly phoneNumber: string,
    public readonly smsPaymentReminder: 'YES' | 'NO',
    public readonly smsFailedNotification: 'YES' | 'NO',
    public readonly smsExpiredCard: 'YES' | 'NO',
    public readonly username: string,
  ) {}
}
