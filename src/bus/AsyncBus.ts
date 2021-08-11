import { IAsyncMessageBus, IMessageBus } from "./BusFactory";
import { SceneDirectorEventBusMessages } from "./events";
import { replacer, reviver } from "../utils/json";
import {
  SceneDirectorCommand,
  SceneDirectorCommandFinishedInfo,
} from "../director/BaseSceneDirector";

const isSceneDirectorCommandFinishedInfo = function (
  object: unknown
): object is SceneDirectorCommandFinishedInfo {
  return Object.prototype.hasOwnProperty.call(object, "commandId");
};
export class AsyncBus implements IAsyncMessageBus {
  private _bus: IMessageBus;

  constructor(bus: IMessageBus) {
    this._bus = bus;
  }

  public static commandFinished(
    bus: IMessageBus,
    sceneDirectorCommand: SceneDirectorCommand,
    payload?: any
  ) {
    const info: SceneDirectorCommandFinishedInfo = {
      commandId: sceneDirectorCommand.id,
      payload,
    };

    const json = JSON.stringify(info, replacer);
    // console.log('BuildingScene bus sent', json)
    bus.$emit(SceneDirectorEventBusMessages.SceneDirectorCommandFinished, json);
  }

  getUniqueName = () => {
    return Math.random().toString(36).substr(2, 6);
  };

  $emit(
    sceneDirectorCommand: SceneDirectorCommand
  ): Promise<SceneDirectorCommandFinishedInfo> {
    const actionId = this.getUniqueName();
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(actionId + "|" + sceneDirectorCommand.name);
      }, 1000 * 60 * 10);

      const callback = (
        id: string,
        SceneDirectorCommandFinishedInfo: SceneDirectorCommandFinishedInfo
      ) => {
        // console.log(
        //   'Action finished callback',
        //   actionId,
        //   SceneDirectorCommandFinishedInfo.payload
        // )

        // console.log(
        //   'Action finished',
        //   actionId,
        //   SceneDirectorCommandFinishedInfo.payload
        // )

        clearTimeout(timeout);
        this._bus.$off(
          SceneDirectorEventBusMessages.SceneDirectorCommandFinished,
          callback
        );
        // console.log('Asyncbus $off', id, actionId)
        resolve(SceneDirectorCommandFinishedInfo);
      };

      // console.log('Asyncbus registering $on', actionId)

      this._bus.$on(
        SceneDirectorEventBusMessages.SceneDirectorCommandFinished,
        (SceneDirectorCommandFinishedInfoJson: string) => {
          // const id = info.commandId ?? ''
          // // already emitted that the command has finished? yes -> do not send again and return
          // if (AsyncBus.finishedCommandHistory.includes(id)) {
          //   console.log('Cached', id)
          //   // return
          // }

          // AsyncBus.finishedCommandHistory.push(id)

          const info = <SceneDirectorCommandFinishedInfo>(
            JSON.parse(SceneDirectorCommandFinishedInfoJson, reviver)
          );
          const commandId = isSceneDirectorCommandFinishedInfo(info)
            ? info.commandId
            : info;

          if (commandId === actionId) {
            // console.log('AsyncBus received JSON', SceneDirectorCommandFinishedInfoJson)
            // console.log('AsyncBus received obj ', info)
            const id = this.getUniqueName();
            callback(id, info);
          }
        }
      );

      sceneDirectorCommand.id = actionId;
      const json = JSON.stringify(sceneDirectorCommand, replacer);
      // console.log('AsyncBus sent', json)
      this._bus.$emit(SceneDirectorEventBusMessages.SceneDirectorCommand, json);
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  $on(event: string | string[], callback: Function) {
    this._bus.$on(event, callback);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  $off(event: string | string[], callback?: Function) {
    this._bus.$off(event, callback);
  }
}
