<template>
  <div>
    <label>{{ fps }}</label>
    <label v-if="bjsRotationVector"
      >Rotation Y: {{ bjsRotationVector.y }}</label
    >
    {{ bjsPositionVector }}
    <button @click="moveCube">Move Cube</button>
    <BabylonScene
      @fps="fpsReceived"
      @angle="angleReceived"
      @bjsPositionVector="bjsPositionVectorReceived"
      @bjsRotationVector="bjsRotationVectorReceived"
      :position="cubePosition"
      :positionTheRightWay="cubePositionTheRightWay"
    />
  </div>
</template>

<script>
// import { Vector3 } from "@babylonjs/core";
import BabylonScene from "./components/BabylonScene.vue";

export default {
  name: "App",
  components: {
    BabylonScene,
  },
  data() {
    return {
      cubePosition: {},
      cubePositionTheRightWay: {},

      offset: 0,
      x: 0,
      y: 0,
      z: 0,

      fps: 0,
      angle: 0,
      bjsPositionVector: null,
      bjsRotationVector: null,
    };
  },
  watch: {
    bjsRotationVector: {
      handler: function(val) {
        console.log(val);
      },
      deep: true,
    },
  },
  methods: {
    fpsReceived(fps) {
      this.fps = fps;
    },
    angleReceived(angle) {
      this.angle = angle;
    },
    bjsPositionVectorReceived(bjsPositionVector) {
      this.bjsPositionVector = bjsPositionVector;
    },
    bjsRotationVectorReceived(bjsRotationVector) {
      this.bjsRotationVector = bjsRotationVector;
    },
    moveCube() {
      this.getNextPosition();

      this.moveCubeSharedVector();
      this.moveCubeSharedScene();
      this.moveCubeTheRightWay();
    },

    moveCubeSharedScene() {
      this.cubePosition = { x: -2, y: this.y, z: this.z };
    },
    moveCubeSharedVector() {
      if (this.bjsPositionVector) {
        // this.bjsPositionVector = new Vector3(0, this.y, this.z);
        this.bjsPositionVector.y = this.y;
      }
    },

    moveCubeTheRightWay() {
      this.cubePositionTheRightWay = { x: 2, y: this.y, z: this.z };
    },
    getNextPosition() {
      this.offset += 0.5;
      this.x = 0;
      this.y = 0 + this.offset;
      this.z = 0;
    },
  },
};
</script>

<style>
body {
  padding: 10px;
}

label {
  display: block;
}
</style>
