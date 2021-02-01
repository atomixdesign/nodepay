import { BaseGateway } from '../gateways'

export type Gateway = BaseGateway

export type GatewayArray = Gateway[]

export type GatewayMap = Map<string, Gateway>

export type GatewayRecord = Record<string, Gateway>

export type GatewayArrayOrMapOrRecord = GatewayArray | GatewayMap | GatewayRecord | undefined

export type Checker = (gateways: GatewayArrayOrMapOrRecord) => boolean

export type Setter<T> = (gateways: T) => GatewayMap

export type GatewayMapCheckerSetter<T> = [Checker, Setter<T>]

export const isArray = (gateways: GatewayArrayOrMapOrRecord): boolean => {
  return Array.isArray(gateways)
}

export const gatewaysFromArray = (gateways: GatewayArray): GatewayMap => {
  const gatewayMap = new Map<string, Gateway>()

  for (const gateway of gateways) {
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

  for (const key of Object.keys(gateways)) {
    gatewayMap.set(key, gateways[key])
  }

  return gatewayMap
}

const arrayCheckerSetter: GatewayMapCheckerSetter<GatewayArray> = [isArray, gatewaysFromArray]
const mapCheckerSetter: GatewayMapCheckerSetter<GatewayMap> = [isMap, gatewaysFromMap]
const recordCheckerSetter: GatewayMapCheckerSetter<GatewayRecord> = [isRecord, gatewaysFromRecord]

export const checkerSetters = [arrayCheckerSetter, mapCheckerSetter, recordCheckerSetter]
