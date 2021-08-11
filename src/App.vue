<template>
  <div style="width: 100%; height: 40px">
    <input type="text" v-model="name" />
    <button @click="addMarble">Add marble</button>
    <button @click="clearMarbles">Remove marbles</button>
    <button @click="getMeshNames">Console.log scene mesh names</button>
    <br />
    SelectedMarbleName: {{ selectedMarbleNameLabel }}
  </div>
  <BabylonJsScene />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
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

    const selectedMarbleNameLabel = computed(() => {
      return selectedMarbleName.value !== '' ? selectedMarbleName.value : 'Click on a marble'
    })

    const selectedMarbleName = sceneDirector.useSelectedMarbleName()

    const addMarble = async () => {
      void sceneDirector.addMarble(name.value)
    }
    const clearMarbles = async () => {
      void sceneDirector.clearMarbles()
    }
    const getMeshNames = async () => {
      const names = await sceneDirector.getMeshNames()
      console.log('Mesh names:', names)
    }

    return {
      name,
      addMarble,
      clearMarbles,
      getMeshNames,
      selectedMarbleName,
      selectedMarbleNameLabel,
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
