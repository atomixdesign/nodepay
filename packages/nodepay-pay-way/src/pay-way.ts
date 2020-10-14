import { Container } from 'typedi'
import { validateOrReject } from 'class-validator'
import { BaseGateway } from '@atomixdesign/nodepay-core'
import {
  DirectDebit,
  OnceOffPayment,
  RecurringPayment,
  CustomerDetails,
} from '@atomixdesign/nodepay-core/features'
import {
  PaywayConfig,
  PaywayCharge,
  PaywayDirectDebit,
  PaywayCustomer,
  PaywayPaymentSchedule,
  PaywayCreditCard,
  PaywayAddress,
  PaywayBankAccount,
} from './types'
import { PaywayAPI, IPaywayAPIResponse } from './transport'
import {
  ChargeDTO,
  PaymentScheduleDTO,
  CreditCardDTO,
  CustomerDTO,
  AddressDTO,
  PaymentDetailsDTO,
  BankAccountDTO,
} from './transport/dtos'


export class Payway extends BaseGateway<PaywayConfig> implements
  DirectDebit,
  OnceOffPayment,
  RecurringPayment,
  CustomerDetails
{
  private api: PaywayAPI

  protected get baseConfig(): PaywayConfig {
    return {
      bankAccountId: '',
      merchantId: '',
      secretKey: '',
      publishableKey: '',
      apiRoot: '',
      responseType: 'json'
    }
  }

  constructor(config?: Partial<PaywayConfig>) {
    super(config)
    Container.set('payway.config', config)
    this.api = Container.get(PaywayAPI)
  }

  get name(): string {
    return 'Westpac PayWay'
  }

  get shortName(): string {
    return 'pay-way'
  }

  async addCustomer(
    customerDetails: PaywayCustomer,
    creditCard?: PaywayCreditCard,
    bankAccount?: PaywayBankAccount,
  ): Promise<IPaywayAPIResponse> {
    let singleUseTokenId: string | undefined

    try {
      if (creditCard !== undefined) {
        const creditCardObject = new CreditCardDTO({
          ...creditCard,
        })

        await validateOrReject(creditCardObject)
        const ccResponse = await this.api.getCCtoken(creditCardObject)
        singleUseTokenId = ccResponse?.data?.singleUseTokenId
      } else if (bankAccount !== undefined) {
        const bankAccountObject = new BankAccountDTO({
          ...bankAccount,
        })

        await validateOrReject(bankAccountObject)
        const bankAccountResponse = await this.api.getBankAccountToken(bankAccountObject)
        singleUseTokenId = bankAccountResponse?.data?.singleUseTokenId
      }
    } catch (error) {
      throw new Error(error)
    }

    const customerObject = new CustomerDTO({
      ...customerDetails,
      singleUseTokenId: singleUseTokenId ?? customerDetails.singleUseTokenId,
    })

    await validateOrReject(customerObject)
    return this.api.addCustomer(customerObject)
  }

  async updateCustomer(
    reference: string,
    customerDetails: PaywayAddress,
    creditCard?: PaywayCreditCard,
    bankAccount?: PaywayBankAccount,
  ): Promise<IPaywayAPIResponse> {
    const addressObject = new AddressDTO({
      firstName: customerDetails.firstName,
      lastName: customerDetails.lastName,
      emailAddress: customerDetails.emailAddress,
      sendEmailReceipts: customerDetails.sendEmailReceipts ?? false,
      phoneNumber: customerDetails.phoneNumber,
      address1: customerDetails.address1,
      address2: customerDetails.address2,
      city: customerDetails.city,
      region: customerDetails.region,
      postCode: customerDetails.postCode,
    })

    await validateOrReject(addressObject)
    const result = await this.api.updateCustomerDetails(reference, addressObject)

    try {
      if (creditCard !== undefined) {
        const creditCardObject = new CreditCardDTO({
          ...creditCard,
        })

        await validateOrReject(creditCardObject)
        const ccResponse = await this.api.getCCtoken(creditCardObject)
        const token = ccResponse?.data?.singleUseTokenId

        const paymentDetailsObject = new PaymentDetailsDTO({
          singleUseTokenId: token,
          merchantId: this.config.merchantId,
        })
        await validateOrReject(paymentDetailsObject)

        await this.api.updateCustomerPayment(
          reference,
          paymentDetailsObject,
        )
      }

      if (bankAccount !== undefined) {
        const bankAccountObject = new BankAccountDTO({
          ...bankAccount,
        })

        await validateOrReject(bankAccountObject)
        const bankAccountResponse = await this.api.getBankAccountToken(bankAccountObject)
        const token = bankAccountResponse?.data?.singleUseTokenId

        const paymentDetailsObject = new PaymentDetailsDTO({
          singleUseTokenId: token,
          bankAccountId: this.config.bankAccountId,
        })
        await validateOrReject(paymentDetailsObject)

        await this.api.updateCustomerPayment(
          reference,
          paymentDetailsObject,
        )
      }

    } catch (error) {
      console.error(error)
    }

    return result
  }

  async directDebit(
    directDebitCharge: PaywayDirectDebit,
  ): Promise<IPaywayAPIResponse> {
    const chargeObject = new ChargeDTO({
      customerId: directDebitCharge.customerId,
      orderNumber: directDebitCharge.paymentReference,
      principalAmount: directDebitCharge.amountInCents / 100,
      customerIpAddress: directDebitCharge?.customerIpAddress,
      merchantId: directDebitCharge?.merchantId,
      // bankAccountId,
    })

    await validateOrReject(chargeObject)
    return this.api.placeDirectCharge(chargeObject)
  }

  async charge(
    onceOffCharge: PaywayCharge,
    creditCard?: PaywayCreditCard,
  ): Promise<IPaywayAPIResponse> {
    const chargeObject = new ChargeDTO({
      customerId: onceOffCharge?.customerId ?? '',
      principalAmount: onceOffCharge.amountInCents / 100,
      orderNumber: onceOffCharge.orderNumber,
      customerIpAddress: onceOffCharge?.customerIpAddress,
      merchantId: onceOffCharge?.merchantId,
    })
    let singleUseTokenId = onceOffCharge?.singleUseTokenId

    await validateOrReject(chargeObject)

    if (singleUseTokenId === undefined) {
      const creditCardObject = new CreditCardDTO(creditCard!)
      await validateOrReject(creditCardObject)
      const ccTokenResponse = await this.api.getCCtoken(creditCardObject)
      singleUseTokenId = ccTokenResponse.data.singleUseTokenId
    }
    return this.api.placeCharge(singleUseTokenId!, chargeObject)
  }

  async chargeRecurring(
    paymentSchedule: PaywayPaymentSchedule,
  ): Promise<IPaywayAPIResponse> {
    const scheduleObject = new PaymentScheduleDTO({
      frequency: paymentSchedule.frequency,
      nextPaymentDate: paymentSchedule?.nextPaymentDate ?? paymentSchedule.startDate,
      regularPrincipalAmount: paymentSchedule.amountInCents / 100,
      nextPrincipalAmount: paymentSchedule.nextPrincipalAmount ?
        paymentSchedule.nextPrincipalAmount / 100 : undefined,
      numberOfPaymentsRemaining: paymentSchedule.numberOfPaymentsRemaining,
      finalPrincipalAmount: paymentSchedule.finalPrincipalAmount,
    })

    await validateOrReject(scheduleObject)
    return this.api.schedulePayment(paymentSchedule.customerId, scheduleObject)
  }
}
