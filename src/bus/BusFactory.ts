import {
  SceneDirectorCommand,
  SceneDirectorCommandFinishedInfo,
} from "../director/BaseSceneDirector";
import { AsyncBus } from "./AsyncBus";
import { VueBus } from "./VueBus";

export interface IMessageBus {
  $emit(name: string, msg: any): void;
  $on(event: string | string[], callback: Function): void;
  $off(event: string | string[], callback?: Function): void;
}

export interface IAsyncMessageBus {
  $on(event: string | string[], callback: Function): void;
  $off(event?: string | string[], callback?: Function): void;
  $emit(
    sceneDirectorCommand: SceneDirectorCommand
  ): Promise<SceneDirectorCommandFinishedInfo>;
}

export class BusFactory {
  private static _bus: IMessageBus | null = null;
  private static _asyncBus: IAsyncMessageBus | null = null;

  public static getBus() {
    if (BusFactory._bus === null) {
      BusFactory._bus = new VueBus();
    }
    return BusFactory._bus;
  }

  public static getAsyncBus() {
    if (BusFactory._asyncBus === null) {
      BusFactory._asyncBus = new AsyncBus(BusFactory.getBus());
    }
    return BusFactory._asyncBus;
  }
}
