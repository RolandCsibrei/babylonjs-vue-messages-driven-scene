import { ref } from 'vue'
import { SceneDirectorEventBusMessages, SceneEventBusMessages } from '../bus/events'
import { BaseSceneDirector } from './BaseSceneDirector'

export class MySceneDirector extends BaseSceneDirector {
  private _selectedMarbleName = ref('')

  constructor() {
    super()
    this.registerSceneEvents()
  }

  // register your events here
  // you might want to make this in a more configurable way (like in MarbleScene.getMessagesToActionsMapping())
  // and move these two methods to BaseSceneDirector
  // and call registerSceneEvents(messageToActionMappings)
  private registerSceneEvents() {
    this.asyncBus.$on(SceneEventBusMessages.MarbleSelected, (name: string) => {
      console.log('Marble selected', name)
      this._selectedMarbleName.value = name
    })
  }

  // unregister your events here
  public unregisterSceneEvents() {
    this.asyncBus.$off(SceneEventBusMessages.MarbleSelected)
  }

  //

  async getMeshNames() {
    const retvalue = await this.asyncCommand(SceneDirectorEventBusMessages.GetMeshNames, {})
    return retvalue
  }

  async clearMarbles() {
    void this.asyncCommand(SceneDirectorEventBusMessages.ClearMarbles, {})
  }

  async addMarble(name: string) {
    void this.asyncCommand(SceneDirectorEventBusMessages.AddMarble, name)
  }

  // Vue reactive stuff
  useSelectedMarbleName() {
    return this._selectedMarbleName
  }
}
