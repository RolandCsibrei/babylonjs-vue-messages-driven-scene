<template>
  <div>
    <canvas ref="bjsCanvasRef" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { MyFirstScene } from "../scenes/MyFirstScene";

import { BusFactory } from "../bus/BusFactory";


import { defineComponent, onMounted, onUnmounted, ref } from "vue";

export default defineComponent({
  name: "BabylonJsScene",
  props: {
    msg: String,
  },

  setup() {
    const bus = BusFactory.getBus();
    const bjsCanvasRef = ref(null)
      const myFirstScene = new MyFirstScene();

    onMounted(() => {
   const bjsCanvas = bjsCanvasRef.value;
    if (bjsCanvas) {
      myFirstScene.createScene(bjsCanvas);
      if (bus) {  
      myFirstScene.registerBusEvents(bus);
    }
    }
 
    })

    onUnmounted(() => {
    myFirstScene.unregisterEvents();

    })
  },
});
</script>

</script>
