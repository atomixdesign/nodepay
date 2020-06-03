export abstract class BaseGateway<T extends Record<string, unknown> = Record<string, unknown>> {
  abstract get shortName(): string
  abstract get name(): string

  protected abstract get baseConfig(): T
  public readonly config: T

  constructor(config?: T) {
    this.config = this.buildConfig(config)
  }

  private buildConfig(config?: T): T {
    return {
      ...this.baseConfig,
      ...config
    }
  }
}
