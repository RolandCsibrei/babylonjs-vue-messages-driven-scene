import {
  Engine,
  Scene,
  FreeCamera,
  Vector3,
  HemisphericLight,
  Mesh,
  IPointerEvent,
  PickingInfo,
  ArcRotateCamera,
  StandardMaterial,
  Color3,
} from '@babylonjs/core'

import { AsyncBus } from '../bus/AsyncBus'
import { IMessageBus } from '../bus/BusFactory'

import { SceneEventBusMessages, SceneDirectorEventBusMessages } from '../bus/events'

import { SceneDirectorCommand } from '../director/BaseSceneDirector'

import { reviver } from '../utils/json'

export class MarbleScene {
  private _scene?: Scene

  constructor(private _eventBus: IMessageBus) {}

  public registerBusEvents() {
    const messagesToActions = this.getMessagesToActionsMapping()

    this._eventBus.$on(SceneDirectorEventBusMessages.SceneDirectorCommand, (sceneDirectorCommandJson: string) => {
      const sceneDirectorCommand = <SceneDirectorCommand>JSON.parse(sceneDirectorCommandJson, reviver)
      const action = messagesToActions.get(sceneDirectorCommand.messageType)
      if (action) {
        action.call(this, sceneDirectorCommand)
      }
    })
  }

  public unregisterBusEvents() {
    this._eventBus.$off(SceneDirectorEventBusMessages.SceneDirectorCommand)
  }

  getMessagesToActionsMapping() {
    const messagesToActions = new Map<string, (payload: any) => void>()
    messagesToActions.set(SceneDirectorEventBusMessages.ClearMarbles, this.clearMarbles)
    messagesToActions.set(SceneDirectorEventBusMessages.AddMarble, this.addMarble)
    return messagesToActions
  }

  clearMarbles(sceneDirectorCommand: SceneDirectorCommand) {
    if (this._scene) {
      this._scene.meshes.forEach((m) => {
        if (m.name.startsWith('marble')) {
          m.dispose()
        }
      })
    }

    this.commandFinished(sceneDirectorCommand)
  }

  addMarble(sceneDirectorCommand: SceneDirectorCommand) {
    const name = <string>sceneDirectorCommand.payload
    if (this._scene) {
      const marbleFullName = `marble-${name}`
      const mesh = Mesh.CreateSphere(marbleFullName, 16, 2, this._scene)
      mesh.position.x = Math.random() * 6 - 3
      mesh.position.y = Math.random() * 6 - 3
      mesh.position.z = Math.random() * 6 - 3
      mesh.isPickable = true

      const material = new StandardMaterial(marbleFullName, this._scene)
      material.diffuseColor = new Color3(1, Math.random(), 0)

      mesh.material = material
    }
    this.commandFinished(sceneDirectorCommand)
  }

  createScene(canvas: HTMLCanvasElement) {
    const engine = new Engine(canvas)
    const scene = new Scene(engine)
    this._scene = scene

    const camera = new ArcRotateCamera('camera1', 1, 0.4, 20, new Vector3(0, 0, 0), scene)
    camera.setTarget(Vector3.Zero())
    camera.attachControl(canvas, true)

    new HemisphericLight('light', Vector3.Up(), scene)

    this._scene.onPointerDown = (evt: IPointerEvent, pickInfo: PickingInfo) => {
      this.emitCommand(SceneEventBusMessages.MarbleSelected, pickInfo?.pickedMesh?.name)
    }

    this._scene.onBeforeRenderObservable.add(() => {
      camera.alpha += 0.001
    })

    engine.runRenderLoop(() => {
      scene.render()
    })

    return { engine, scene }
  }

  // helper methods
  emitCommand(name: SceneEventBusMessages, payload?: any) {
    AsyncBus.emitCommand(this._eventBus, name, payload)
  }

  commandFinished(sceneDirectorCommand: SceneDirectorCommand, payload?: any) {
    AsyncBus.commandFinished(this._eventBus, sceneDirectorCommand, payload)
  }
}
