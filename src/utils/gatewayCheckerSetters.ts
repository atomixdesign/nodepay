import { BaseGateway } from '../gateways'

export type Gateway = BaseGateway

export type GatewayArray = Gateway[]

export type GatewayMap = Map<string, Gateway>

export type GatewayRecord = Record<string, Gateway>

export type GatewayArrayOrMapOrRecord = GatewayArray | GatewayMap | GatewayRecord | null

export type GatewayMapCheckerSetter = [
  (gateways: GatewayArrayOrMapOrRecord) => boolean,
  (gateways: any) => GatewayMap,
]

export const isArray = (gateways: GatewayArrayOrMapOrRecord): boolean => {
  return Array.isArray(gateways)
}

export const gatewaysFromArray = (gateways: GatewayArray): GatewayMap => {
  const gatewayMap = new Map<string, Gateway>()

  for (let gateway of gateways) {
    gatewayMap.set(gateway.shortName, gateway)
  }

  return gatewayMap
}

export const isMap = (gateways: GatewayArrayOrMapOrRecord): boolean => {
  return gateways instanceof Map
}

export const gatewaysFromMap = (gateways: GatewayMap): GatewayMap => {
  return gateways
}

export const isRecord = (gateway: GatewayArrayOrMapOrRecord): boolean => {
  return gateway?.constructor.name === 'Object'
}

export const gatewaysFromRecord = (gateways: GatewayRecord): GatewayMap => {
  const gatewayMap = new Map<string, Gateway>()

  Object.keys(gateways).forEach((key) => {
    gatewayMap.set(key, gateways[key])
  })

  return gatewayMap
}

export const checkerSetters: GatewayMapCheckerSetter[] = [
  [isArray, gatewaysFromArray],
  [isMap, gatewaysFromMap],
  [isRecord, gatewaysFromRecord],
]
