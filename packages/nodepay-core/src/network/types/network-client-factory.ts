/** @internal */
export abstract class NetworkClientFactory<T extends unknown> {
  protected abstract create(): T
}

/** @internal */
export abstract class NetworkClientAsyncFactory<T extends unknown> {
  protected abstract createAsync(): Promise<T>
}
