<template>
  <q-card class="bg-background" :dark="dark">
    <q-card-section>
      <div @click="debug0" class="text-h6">正在构建插件</div>
    </q-card-section>
    <q-card-section>
        <span>正在编译插件....</span>
      <q-linear-progress indeterminate />
    </q-card-section>
  </q-card>
</template>
<script>


import projectManager from "../project/projectManager";
import logger from '../logger/logger';
export default {
  name: "BuildDialog",
  data() {
    return {
      dark: false
    };
  },
  beforeMount() {
    this.dark = this.$BlockCraft.dark;
    this.$eventHub.$on("dark-change", this.changeDark);
  },

  methods: {
    changeDark() {
      this.dark = this.$BlockCraft.dark;
    },
  }
};
</script>
<style scoped>

</style>
