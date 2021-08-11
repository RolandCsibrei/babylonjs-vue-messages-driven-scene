import { SceneDirectorCommand, SceneDirectorCommandFinishedInfo } from '../director/BaseSceneDirector'
import { AsyncBus } from './AsyncBus'
import { MittBus } from './MittBus'

export type SceneDirectorCallback = (
  id: string,
  sceneDirectorCommandFinishedInfo: SceneDirectorCommandFinishedInfo,
) => void

export interface IMessageBus {
  $emit(name: string, msg: any): void
  $on(event: string | string[], callback: SceneDirectorCallback): void
  $off(event: string | string[], callback?: SceneDirectorCallback): void
}

export interface IAsyncMessageBus {
  $on(event: string | string[], callback: SceneDirectorCallback): void
  $off(event?: string | string[], callback?: SceneDirectorCallback): void
  $emit(sceneDirectorCommand: SceneDirectorCommand): Promise<SceneDirectorCommandFinishedInfo>
}

export class BusFactory {
  private static _bus: IMessageBus | null = null
  private static _asyncBus: IAsyncMessageBus | null = null

  public static getBus() {
    if (BusFactory._bus === null) {
      BusFactory._bus = new MittBus()
    }
    return BusFactory._bus
  }

  public static getAsyncBus() {
    if (BusFactory._asyncBus === null) {
      BusFactory._asyncBus = new AsyncBus(BusFactory.getBus())
    }
    return BusFactory._asyncBus
  }
}
