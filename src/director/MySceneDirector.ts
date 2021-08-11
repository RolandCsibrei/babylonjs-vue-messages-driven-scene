// TODO: a looot of stuff

import { SceneDirectorEventBusMessages } from "../bus/events";
import { BaseSceneDirector } from "./BaseSceneDirector";

export class MySceneDirector extends BaseSceneDirector {
  constructor(/* you can add your params here like */) {
    super();
  }

  clearMarbles() {
    this.bus.$emit(SceneDirectorEventBusMessages.ClearMarbles, "");
  }

  addMarble(name: string) {
    this.bus.$emit(SceneDirectorEventBusMessages.AddMarble, { name });
  }
}
