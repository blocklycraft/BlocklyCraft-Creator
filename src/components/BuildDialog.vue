<template>
  <q-card class="bg-background" :dark="dark">
    <q-card-section>
      <div class="text-h6">正在构建插件</div>
    </q-card-section>
    <q-card-section>
        <span>{{action}}</span>
      <q-linear-progress indeterminate />
    </q-card-section>
  </q-card>
</template>
<script>

export default {
  name: 'BuildDialog',
  props: [
    'action'
  ],
  data () {
    return {
      dark: false
    }
  },
  beforeMount () {
    this.dark = this.$BlockCraft.dark
    this.$eventHub.$on('dark-change', this.changeDark)
  },

  methods: {
    changeDark () {
      this.dark = this.$BlockCraft.dark
    }
  }
}
</script>
<style scoped>

</style>
