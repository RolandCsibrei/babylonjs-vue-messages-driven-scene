export type SceneDirectorPaylod = any;
export interface SceneDirectorCommand {
  id?: string;
  name: string;
  messageType: SceneDirectorEventBusMessages;
  payload?: SceneDirectorPaylod;
}

export interface SceneDirectorCommandFinishedInfo {
  commandId?: string;
  payload?: SceneDirectorPaylod;
}

import { BusFactory, IAsyncMessageBus, IMessageBus } from "../bus/BusFactory";
import {
  SceneDirectorEventBusMessages,
  SceneEventBusMessages,
} from "../bus/events";

export class BaseSceneDirector {
  asyncBus: IAsyncMessageBus;
  bus: IMessageBus;

  constructor() {
    this.bus = BusFactory.getBus();
    this.asyncBus = BusFactory.getAsyncBus();
    this.registerEvents();
  }

  // register your events here
  private registerEvents() {
    this.asyncBus.$on(SceneEventBusMessages.MarbleSelected, (name: string) => {
      console.log("Marble selected", name);
    });
  }

  // unregister your events here
  public unregisterEvents() {
    this.asyncBus.$off(SceneEventBusMessages.MarbleSelected);
  }

  async asyncCommand(
    eventBusMessageType: SceneDirectorEventBusMessages,
    payload?: any
  ) {
    const SceneDirectorCommand: SceneDirectorCommand = {
      name: "n/a",
      messageType: eventBusMessageType,
      payload: payload,
    };
    const info = await this.asyncBus.$emit(SceneDirectorCommand);
    return info;
  }

  getUniqueName() {
    return (Math.random() * 1000000000).toString();
  }
}
