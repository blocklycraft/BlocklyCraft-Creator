<template>
  <q-page style="height: 100%">
    <q-splitter
      v-model="splitterModel"
      :limits="[20, 30]"
      style="height: 100%"
    >
      <template v-slot:before>
        <q-page><ProjectArea /></q-page>
      </template>
      <template v-slot:after>
        <q-page>
          <BlocklyEditor></BlocklyEditor>
        </q-page>
      </template>

    </q-splitter>
  </q-page>
</template>

<style>
</style>

<script>
  import ProjectArea from '../components/ProjectArea'
  import BlocklyEditor from "../components/BlocklyEditor";
  export default {
  name: 'PageIndex',
  components: {BlocklyEditor, ProjectArea},
  data () {
    return {
      splitterModel: 20
    }
  }
}
</script>
