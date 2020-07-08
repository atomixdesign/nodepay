/** @internal */
export interface INetworkFactory<T extends unknown> {
  create?(): T
  createAsync?(): Promise<T>
}
