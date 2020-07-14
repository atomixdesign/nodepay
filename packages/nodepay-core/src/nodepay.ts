import { checkerSetters, Gateway, GatewayArrayOrMapOrRecord, GatewayMap } from './utils'

export class Nodepay {
  public readonly gateways: GatewayMap

  constructor(gateways?: GatewayArrayOrMapOrRecord) {
    this.gateways = this.buildGatewayMap(gateways)
  }

  private buildGatewayMap(gateways: GatewayArrayOrMapOrRecord): GatewayMap {
    for (const [checker, setter] of checkerSetters) {
      if (checker(gateways)) {
        // @ts-ignore
        return setter(gateways)
      }
    }

    return new Map<string, Gateway>()
  }
}
