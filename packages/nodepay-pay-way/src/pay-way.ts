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
  IPaywayConfig,
  IPaywayCharge,
  IPaywayDirectDebit,
  IPaywayCustomer,
} from './types'
import { PaywayAPI, IPaywayAPIResponse } from './transport'
import {
  ChargeDTO,
  PaymentScheduleDTO,
  CreditCardDTO,
  CustomerDTO,
} from './transport/dtos'
import { IPaywayPaymentSchedule } from './types/payment-schedule'
import { ICreditCard } from '@atomixdesign/nodepay-core/src/types'

export class Payway extends BaseGateway<IPaywayConfig> implements
  DirectDebit,
  OnceOffPayment,
  RecurringPayment,
  CustomerDetails
{
  private api: PaywayAPI

  protected get baseConfig(): IPaywayConfig {
    return {
      secretKey: '',
      publishableKey: '',
      apiRoot: '',
      responseType: 'json'
    }
  }

  constructor(config?: Partial<IPaywayConfig>) {
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
    customerDetails: IPaywayCustomer,
  ): Promise<IPaywayAPIResponse> {
    const customerObject = new CustomerDTO({
      ...customerDetails,
    })

    await validateOrReject(customerObject)
    return await this.api.addCustomer(customerObject)
  }

  async charge(
    onceOffCharge: IPaywayCharge,
    creditCard?: ICreditCard,
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
    paymentSchedule: IPaywayPaymentSchedule,
  ): Promise<IPaywayAPIResponse> {
    const scheduleObject = new PaymentScheduleDTO({
      frequency: paymentSchedule.frequency,
      nextPaymentDate: paymentSchedule.startDate,
      regularPrincipalAmount: paymentSchedule.amountInCents / 100,
      nextPrincipalAmount: (paymentSchedule.nextPrincipalAmount ?? 0) / 100,
      numberOfPaymentsRemaining: paymentSchedule.numberOfPaymentsRemaining,
      finalPrincipalAmount: paymentSchedule.finalPrincipalAmount,
    })

    await validateOrReject(scheduleObject)
    return await this.api.schedulePayment(paymentSchedule.customerId, scheduleObject)
  }

  async directDebit(
    directDebit: IPaywayDirectDebit,
  ): Promise<IPaywayAPIResponse> {
    const chargeObject = new ChargeDTO({
      customerId: directDebit.customerId,
      orderNumber: directDebit.paymentReference,
      principalAmount: directDebit.amountInCents / 100,
      customerIpAddress: directDebit?.customerIpAddress,
      merchantId: directDebit?.merchantId,
      // bankAccountId,
    })

    await validateOrReject(chargeObject)
    return await this.api.placeDirectCharge(chargeObject)
  }
}
