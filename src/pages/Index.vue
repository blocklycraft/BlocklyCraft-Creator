<template>
  <div style="height: 100%">
    <q-splitter v-model="splitterModel" :limits="[20, 20]" style="height: 100%" :dark="dark">
      <template v-slot:before>
        <div style="height: 100%;">
          <ProjectArea />
        </div>
      </template>
      <template v-slot:after style="overflow: hidden">
        <div style="height: 100%;overflow: hidden">
          <BlocklyEditor style="overflow: hidden"></BlocklyEditor>
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<style>
</style>

<script>
import ProjectArea from '../components/ProjectArea'
import BlocklyEditor from '../components/BlocklyEditor'
export default {
  name: 'PageIndex',
  components: { BlocklyEditor, ProjectArea },
  data () {
    return {
      splitterModel: 20,
      dark: false
    }
  },
  methods: {
    changeDark (mode) {
      this.dark = mode
    }
  },
  mounted () {
    this.$eventHub.$on('dark-change', () => {
      this.changeDark(this.$BlockCraft.dark)
    })
  },
  beforeMount () {
    this.dark = this.$BlockCraft.dark
  }
}
</script>
