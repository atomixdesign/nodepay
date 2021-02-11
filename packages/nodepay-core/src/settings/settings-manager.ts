import { Service } from 'typedi'

export type runMode = 'dry' | 'verbose' | 'wet'
@Service()
export class SettingsManager {
  private _runMode: runMode = 'wet'

  set runMode(runMode: runMode) {
    this._runMode = runMode
  }

  get runMode() : runMode {
    return this._runMode
  }
}
