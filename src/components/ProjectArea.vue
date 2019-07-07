<template>
  <div style="height: 100%">
    <q-tabs
      v-model="pro_tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
      disable
    >
      <q-tab name="info" :label="$t('project.project')" />
      <q-tab name="blocks" :label="$t('project.blocks')" />
    </q-tabs>

    <q-separator :dark="dark" />

    <q-tab-panels v-model="pro_tab" class="bg-background text-text">
      <q-tab-panel style="padding: 0px" name="info">
        <q-list separator :dark="dark">
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ $t('plugin.name') }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label caption>{{project_info.name}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ $t('plugin.author') }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label caption>{{project_info.author}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ $t('plugin.version') }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label caption>{{project_info.version}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>

      <q-tab-panel name="blocks">
        <div class="text-h6">项目积木板</div>这里将会放置此项目的所有积木板
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import projectManager from "../project/projectManager";
export default {
  name: "ProjectArea",
  data() {
    return {
      pro_tab: "info",
      project_info: {
        name: "",
        Author: "",
        version: ""
      },
      disable: false,
      dark: false
    };
  },
  beforeMount() {
    this.dark = this.$BlockCraft.dark;
    this.$eventHub.$on("project-open", this.openProject);
    this.$eventHub.$on("project-close", this.closeProject);
    this.$eventHub.$on("dark-change", this.changeDark);
  },
  mounted() {
    
  },
  methods: {
    openProject() {
      this.$logger.info("[ProjectArea]rec project-open");
      let info = projectManager.getProjectInfo();
      console.log (projectManager.getProjectInfo())
      this.project_info.name = info.name;
      this.project_info.version = info.version;
      this.project_info.Author = info.author ? info.author : "";
    },
    changeDark() {
      this.dark = this.$BlockCraft.dark;
    },
    closeProject() {
      this.$logger.info("[ProjectArea]rec project-close");
      this.project_info.name = "";
      this.project_info.Author = "";
      this.project_info.version = "";
    }
  }
};
</script>

<style scoped>
</style>
