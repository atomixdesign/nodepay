export interface INetworkFactory<T extends unknown> {
  create(): T
}
