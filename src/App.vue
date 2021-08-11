<template>
  <div style="width: 100%; height: 40px">
    <input type="text" v-model="name" />
    <button @click="addMarble">Add marble</button>
    <button @click="clearMarbles">Remove marbles</button>
    <br />
    SelectedMarbleName: {{ selectedMarbleName }}
  </div>
  <BabylonJsScene />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BabylonJsScene from './components/BabylonJsSceneComponent.vue'
import { MySceneDirector } from './director/MySceneDirector'

export default defineComponent({
  name: 'App',
  components: {
    BabylonJsScene,
  },
  setup() {
    const sceneDirector = new MySceneDirector()

    const name = ref('')
    const selectedMarbleName = sceneDirector.useSelectedMarbleName()

    const addMarble = () => {
      sceneDirector.addMarble(name.value)
    }
    const clearMarbles = () => {
      sceneDirector.clearMarbles()
    }

    return {
      name,
      addMarble,
      clearMarbles,
      selectedMarbleName,
    }
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
