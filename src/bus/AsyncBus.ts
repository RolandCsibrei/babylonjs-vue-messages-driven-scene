import { IAsyncMessageBus, IMessageBus, SceneDirectorCallback } from './BusFactory'
import { SceneDirectorEventBusMessages, SceneEventBusMessages } from './events'
import { replacer, reviver } from '../utils/json'
import { SceneDirectorCommand, SceneDirectorCommandFinishedInfo } from '../director/BaseSceneDirector'

const isSceneDirectorCommandFinishedInfo = function (object: unknown): object is SceneDirectorCommandFinishedInfo {
  return Object.prototype.hasOwnProperty.call(object, 'commandId')
}
export class AsyncBus implements IAsyncMessageBus {
  private _bus: IMessageBus

  constructor(bus: IMessageBus) {
    this._bus = bus
  }

  public static emitCommand(bus: IMessageBus, name: SceneEventBusMessages, payload?: any) {
    bus.$emit(name, payload)
  }

  public static commandFinished(bus: IMessageBus, sceneDirectorCommand: SceneDirectorCommand, payload?: any) {
    const info: SceneDirectorCommandFinishedInfo = {
      commandId: sceneDirectorCommand.id,
      payload,
    }

    const json = JSON.stringify(info, replacer)
    bus.$emit(SceneDirectorEventBusMessages.SceneDirectorCommandFinished, json)
  }

  getUniqueName = () => {
    return Math.random().toString(36).substr(2, 6)
  }

  commandFinished(sceneDirectorCommand: SceneDirectorCommand, payload?: any) {
    const info: SceneDirectorCommandFinishedInfo = {
      commandId: sceneDirectorCommand.id,
      payload,
    }

    const json = JSON.stringify(info, replacer)
    this._bus.$emit(SceneDirectorEventBusMessages.SceneDirectorCommandFinished, json)
  }

  $emit(sceneDirectorCommand: SceneDirectorCommand): Promise<SceneDirectorCommandFinishedInfo> {
    const actionId = this.getUniqueName()
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(actionId + '|' + sceneDirectorCommand.name)
      }, 1000 * 60 * 10)

      const callback = (id: string, SceneDirectorCommandFinishedInfo: SceneDirectorCommandFinishedInfo) => {
        console.log('AsyncBus Action finished callback', actionId, SceneDirectorCommandFinishedInfo.payload)

        clearTimeout(timeout)
        this._bus.$off(SceneDirectorEventBusMessages.SceneDirectorCommandFinished, callback)
        resolve(SceneDirectorCommandFinishedInfo)
      }

      console.log('AsyncBus registering $on', actionId)

      this._bus.$on(
        SceneDirectorEventBusMessages.SceneDirectorCommandFinished,
        (SceneDirectorCommandFinishedInfoJson: string) => {
          const info = <SceneDirectorCommandFinishedInfo>JSON.parse(SceneDirectorCommandFinishedInfoJson, reviver)
          const commandId = isSceneDirectorCommandFinishedInfo(info) ? info.commandId : info

          if (commandId === actionId) {
            console.log('AsyncBus received JSON', SceneDirectorCommandFinishedInfoJson)
            const id = this.getUniqueName()
            callback(id, info)
          }
        },
      )

      sceneDirectorCommand.id = actionId
      const json = JSON.stringify(sceneDirectorCommand, replacer)
      console.log('AsyncBus sent', json)
      this._bus.$emit(SceneDirectorEventBusMessages.SceneDirectorCommand, json)
    })
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  $on(event: string | string[], callback: SceneDirectorCallback) {
    this._bus.$on(event, callback)
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  $off(event: string | string[], callback?: SceneDirectorCallback) {
    this._bus.$off(event, callback)
  }
}
