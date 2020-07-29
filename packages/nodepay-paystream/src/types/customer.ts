import { ICreditCard } from '@atomixdesign/nodepay-core/types'

export interface IPaystreamInternalAddress {
  address: string
  city: string
  state: string
  postcode: string
  country: string
}

export interface IPaystreamCustomer {
  firstName: string
  lastName: string
  reference: string
  emailAddress: string
  ipAddress: string
  creditCard?: ICreditCard
  address?: IPaystreamInternalAddress
}
