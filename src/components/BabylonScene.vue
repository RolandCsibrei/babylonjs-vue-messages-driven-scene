<template>
  <div>
    <canvas ref="bjsCanvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { MyFirstScene } from "../scenes/MyFirstScene";

export default {
  name: "BabylonScene",
  data() {
    return {
      marbleName: "",
      myScene: MyFirstScene,
    };
  },

  methods: {},
  mounted() {
    const bus = BusFactory.getBus();

    const bjsCanvas = this.$refs.bjsCanvas;
    if (bjsCanvas) {
      const myFirstScene = new MyFirstScene();
      myFirstScene.createScene(bjsCanvas);
      myFirstScene.registerBusEvents();
    }
  },
  unmounted() {
    //
    this.myFirstScene.unregisterEvents();
  },
};
</script>
