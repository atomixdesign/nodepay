import { ICreditCard } from '@atomixdesign/nodepay-core/types'

export interface IPaystreamInternalAddress {
  address: string
  city: string
  state: string
  postcode: string
  country: string
}

export interface IPaystreamInternalCustomer {
  firstName: string
  lastName: string
  reference: string
  email: string
  ipAddress: string
  creditCard: ICreditCard
  address: IPaystreamInternalAddress
}
