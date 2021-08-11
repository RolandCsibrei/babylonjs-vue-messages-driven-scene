import { IMessageBus } from './BusFactory'
import mitt, { Emitter } from 'mitt'
export class MittBus implements IMessageBus {
  private _bus: any

  constructor() {
    this._bus = mitt()
  }
  $on(event: string, callback: any) {
    this._bus.on(event, callback)
  }
  $emit(name: string, msg: any): void {
    this._bus.emit(name, msg)
  }
  $off(event: string | string[], callback?: any): void {
    this._bus.off(event, callback)
  }
}
