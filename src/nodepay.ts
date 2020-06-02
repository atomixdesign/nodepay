import { checkerSetters, Gateway, GatewayArrayOrMapOrRecord, GatewayMap } from './utils'

export class Nodepay {
  public readonly gateways: GatewayMap

  constructor(gateways: GatewayArrayOrMapOrRecord = null) {
    this.gateways = this.buildGatewayMap(gateways)
  }

  private buildGatewayMap(gateways: GatewayArrayOrMapOrRecord): GatewayMap {
    for (let [checker, setter] of checkerSetters) {
      if (checker(gateways)) {
        return setter(gateways)
      }
    }

    return new Map<string, Gateway>()
  }
}
