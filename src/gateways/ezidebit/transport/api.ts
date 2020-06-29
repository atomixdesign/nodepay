import { Config } from '../config'
import { BaseAPI } from '../../../network/base-api'

export class API extends BaseAPI {
  private config: Config

  constructor(config: Config) {
    super()
    this.config = config
  }
}
