<template>
  <canvas ref="bjsCanvasRef" width="500" height="500" />
</template>

<script lang="ts">
import { MarbleScene } from '../scenes/MarbleScene'
import { BusFactory } from '../bus/BusFactory'
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'

export default defineComponent({
  name: 'BabylonJsSceneComponent',
  props: {
    msg: String,
  },

  setup() {
    const bus = BusFactory.getBus()
    const bjsCanvasRef = ref(null)
    const myScene = new MarbleScene(bus)

    onMounted(() => {
      const bjsCanvas = bjsCanvasRef.value
      if (bjsCanvas) {
        myScene.createScene(bjsCanvas)
        myScene.registerBusEvents()
      }
    })

    onUnmounted(() => {
      myScene.unregisterBusEvents()
    })

    return {
      bjsCanvasRef,
    }
  },
})
</script>
