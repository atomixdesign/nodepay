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
} from './types'
import { PaywayAPI, IPaywayAPIResponse } from './transport'
import {
  ChargeDTO,
  PaymentScheduleDTO,
  CreditCardDTO,
  CustomerDTO,
  AddressDTO,
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
      secretKey: '',
      publishableKey: '',
      apiRoot: '',
      responseType: 'json'
    }
  }

  constructor(config?: Partial<PaywayConfig>) {
    super(config)
    Container.set('payway.config', config)
    this.api = Container.get('payway.api')
  }

  get name(): string {
    return 'Westpac PayWay'
  }

  get shortName(): string {
    return 'pay-way'
  }

  async addCustomer(
    customerDetails: PaywayCustomer,
  ): Promise<IPaywayAPIResponse> {
    const customerObject = new CustomerDTO({
      ...customerDetails,
    })

    await validateOrReject(customerObject)
    return await this.api.addCustomer(customerObject)
  }

  async updateCustomer(
    reference: string,
    customerDetails: PaywayAddress,
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
    return await this.api.updateCustomerDetails(reference, addressObject)
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
    return await this.api.placeCharge(singleUseTokenId!, chargeObject)
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
    return await this.api.schedulePayment(paymentSchedule.customerId, scheduleObject)
  }

  async directDebit(
    directDebitOrder: PaywayDirectDebit,
  ): Promise<IPaywayAPIResponse> {
    const chargeObject = new ChargeDTO({
      customerId: directDebitOrder.customerId,
      orderNumber: directDebitOrder.paymentReference,
      principalAmount: directDebitOrder.amountInCents / 100,
      customerIpAddress: directDebitOrder?.customerIpAddress,
      merchantId: directDebitOrder?.merchantId,
      // bankAccountId,
    })

    await validateOrReject(chargeObject)
    return await this.api.placeDirectCharge(chargeObject)
  }
}
