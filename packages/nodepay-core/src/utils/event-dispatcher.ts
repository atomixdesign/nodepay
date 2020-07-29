type LoggerEvent = 'request' | 'response' | 'error'

interface IEventCallback {
  ( event: unknown ) : void
}

export interface IDispatcher {
  on(
    eventName: LoggerEvent,
    callback: IEventCallback,
  ): void
  off(
    mapKey: symbol,
  ): boolean
  trigger(
    eventName: LoggerEvent,
    payload: unknown,
  ): void
}

export class EventDispatcher implements IDispatcher {
  private callbacks: Record<LoggerEvent, Map<symbol, IEventCallback>>

  constructor() {
    this.callbacks = {
      'request': new Map(),
      'response': new Map(),
      'error': new Map(),
    }
  }

  on(eventName: LoggerEvent, callback: IEventCallback): symbol {
    const mapKey = Symbol(eventName)
    this.callbacks[eventName].set(mapKey, callback)
    return mapKey
  }

  off(mapKey: symbol): boolean {
    for(const [, callbacks] of Object.entries(this.callbacks)) {
      if (callbacks.has(mapKey)) {
        callbacks.delete(mapKey)
        return true
      }
    }
    return false
  }

  trigger(eventName: LoggerEvent, payload?: unknown) : void {
    const callbackFunctions = this.callbacks[eventName]
    for(const [, callback] of callbackFunctions) {
      callback.call(this, payload)
    }
  }
}
