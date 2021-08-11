export enum SceneDirectorEventBusMessages {
  SceneDirectorCommand = 'command',
  SceneDirectorCommandFinished = 'commandFinished',

  HideInspector = 'hideInspector',
  ShowInspector = 'showInspector',
  ClearMarbles = 'clearMarbles',
  AddMarble = 'addMarble',
}

export enum SceneEventBusMessages {
  SceneDirectorCommandFinished = 'commandFinished',

  MarbleSelected = 'marbleSelected',
}
