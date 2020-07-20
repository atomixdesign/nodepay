import { IDirectDebit } from '../types'

export interface DirectDebit {
  directDebit(
    directDebitCharge: IDirectDebit
  ): Promise<unknown>
}
