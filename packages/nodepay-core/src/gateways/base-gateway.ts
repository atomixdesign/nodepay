import { SettingsManager } from '../settings'

export abstract class BaseGateway<T extends Record<string, unknown> = Record<string, unknown>, P = Partial<T>> {
  abstract get shortName(): string
  abstract get name(): string

  protected abstract get baseConfig(): T
  public readonly config: T

  public settingsManager: SettingsManager = new SettingsManager()

  constructor(config?: P) {
    this.config = this.buildConfig(config)
  }

  private buildConfig(config?: P): T {
    return this.afterConfig({
      ...this.baseConfig,
      ...this.beforeConfig(config),
    })
  }

  protected beforeConfig(config?: P): P | undefined {
    return config
  }

  protected afterConfig(config: T): T {
    return config
  }
}
