export type SceneDirectorPaylod = any
export interface SceneDirectorCommand {
  id?: string
  name: string
  messageType: SceneDirectorEventBusMessages
  payload?: SceneDirectorPaylod
}

export interface SceneDirectorCommandFinishedInfo {
  commandId?: string
  payload?: SceneDirectorPaylod
}

import { BusFactory, IAsyncMessageBus, IMessageBus } from '../bus/BusFactory'
import { SceneDirectorEventBusMessages, SceneEventBusMessages } from '../bus/events'

export class BaseSceneDirector {
  asyncBus: IAsyncMessageBus
  bus: IMessageBus

  constructor() {
    this.bus = BusFactory.getBus()
    this.asyncBus = BusFactory.getAsyncBus()
  }

  async asyncCommand(eventBusMessageType: SceneDirectorEventBusMessages, payload?: any) {
    const sceneDirectorCommand: SceneDirectorCommand = {
      name: 'n/a',
      messageType: eventBusMessageType,
      payload: payload,
    }
    console.log('SceneDirector is sending command', sceneDirectorCommand)
    const info = await this.asyncBus.$emit(sceneDirectorCommand)
    console.log('SceneDirector has received response', info)
    return info
  }

  getUniqueName() {
    return (Math.random() * 1000000000).toString()
  }
}
