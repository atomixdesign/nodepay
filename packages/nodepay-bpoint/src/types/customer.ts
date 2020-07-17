import { CreditCardDTO, BankAccountDTO } from '../transport/dtos'

export interface IBPOINTCustomer {
  CardDetails: CreditCardDTO
  BankAccountDetails?: BankAccountDTO
  Crn1: string
  EmailAddress: string
}
