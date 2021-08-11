// TODO: a looot of stuff

import { ref } from 'vue'
import { SceneDirectorEventBusMessages, SceneEventBusMessages } from '../bus/events'
import { BaseSceneDirector } from './BaseSceneDirector'

export class MySceneDirector extends BaseSceneDirector {
  private _selectedMarbleName = ref('')

  constructor(/* you can add your params here like */) {
    super()

    this.registerSceneEvents()
  }

  // register your events here
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

  clearMarbles() {
    this.asyncCommand(SceneDirectorEventBusMessages.ClearMarbles, {})
  }

  addMarble(name: string) {
    this.asyncCommand(SceneDirectorEventBusMessages.AddMarble, name)
  }

  useSelectedMarbleName() {
    return this._selectedMarbleName
  }
}
