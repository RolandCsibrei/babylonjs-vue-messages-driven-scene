<template>
  <div>
    <canvas ref="bjsCanvas" width="500" height="500" />
  </div>
</template>

<script>
import { Vector3 } from "@babylonjs/core";
import {
  createScene,
  getPosition,
  getRotation,
  setPosition,
} from "../scenes/MyFirstScene";

export default {
  name: "BabylonScene",
  props: {
    position: {
      type: Object,
      default() {
        return { x: 0, y: 0, z: 0 };
      },
    },
    positionTheRightWay: {
      type: Object,
      default() {
        return { x: 0, y: 0, z: 0 };
      },
    },
  },

  data() {
    return {
      scene: null,
      engine: null,
      interval: null,
    };
  },

  watch: {
    position(val) {
      if (val) {
        const box = this.scene.getMeshByName("box-red");
        const position = new Vector3(val.x, val.y, val.z);
        if (box) {
          box.position = position;
        }
      }
    },
    positionTheRightWay(val) {
      if (val) {
        setPosition("box-green", val, this.scene);
      }
    },
  },
  methods: {
    setupFpsEmitter() {
      const interval = setInterval(() => {
        const fps = this.engine.getFps().toFixed();
        this.$emit("fps", fps);
      }, 1000);
      this.interval = interval;
    },
    emitPositionVector() {
      const bjsPositionVector = getPosition("box-yellow", this.scene);
      this.$emit("bjsPositionVector", bjsPositionVector);
    },
    emitRotationVector() {
      const bjsRotationVector = getRotation("box-green", this.scene);
      this.$emit("bjsRotationVector", bjsRotationVector);
    },
  },
  mounted() {
    const bjsCanvas = this.$refs.bjsCanvas;
    if (bjsCanvas) {
      const fpsCallback = (fps) => {
        this.$emit("fps1", fps);
      };
      const { engine, scene } = createScene(bjsCanvas, fpsCallback);
      this.engine = engine;
      this.scene = scene;

      this.emitPositionVector();
      this.emitRotationVector();

      this.setupFpsEmitter();
    }
  },
  unmounted() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
};
</script>
