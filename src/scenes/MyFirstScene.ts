import {
  Engine,
  Scene,
  FreeCamera,
  Vector3,
  HemisphericLight,
  Mesh,
} from "@babylonjs/core";

import { AsyncBus } from "../bus/AsyncBus";
import { IMessageBus } from "../bus/BusFactory";

import {
  SceneEventBusMessages,
  SceneDirectorEventBusMessages,
} from "../bus/events";

import { SceneDirectorCommand } from "../director/BaseSceneDirector";

import { reviver } from "../utils/json";

export class MyFirstScene {
  private _scene?: Scene;

  constructor(private _eventBus: IMessageBus) {
    //
    this._registerBusEvents();
  }

  private _registerBusEvents = (): void => {
    const messagesToActions = new Map<string, Function>();
    messagesToActions.set(
      SceneDirectorEventBusMessages.ClearMarbles,
      this.clearMarbles
    );
    messagesToActions.set(
      SceneDirectorEventBusMessages.AddMarble,
      this.addMarble
    );

    bus.$on(
      SceneDirectorEventBusMessages.SceneDirectorCommand,
      (sceneDirectorCommandJson: string) => {
        const sceneDirectorCommand = <SceneDirectorCommand>(
          JSON.parse(sceneDirectorCommandJson, reviver)
        );
        const action = messagesToActions.get(sceneDirectorCommand.messageType);
        if (action) {
          action(sceneDirectorCommand);
        }
      }
    );
  };

  clearMarbles() {
    if (this._scene) {
      this._scene.meshes.forEach((m) => {
        if (m.name === "marble") {
          m.dispose();
        }
      });
    }
  }

  addMarble() {
    if (this._scene) {
      Mesh.CreateSphere("marble", 4, 1, this._scene);
    }
  }

  createScene(canvas) {
    const engine = new Engine(canvas);
    const scene = new Scene(engine);
    this._scene = scene;

    const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    new HemisphericLight("light", Vector3.Up(), scene);

    engine.runRenderLoop(() => {
      scene.render();
    });

    return { engine, scene };
  }

  // helper method
  commandFinished(sceneDirectorCommand: SceneDirectorCommand, payload?: any) {
    AsyncBus.commandFinished(this._eventBus, sceneDirectorCommand, payload);
  }
}
