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
      >
        <q-tab name="info" label="项目" />
        <q-tab name="blocks" label="积木" />

      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="pro_tab">
        <q-tab-panel name="info">
          <div class="text-h6">项目信息页面</div>
          这里将会放置有关项目信息的内容
        </q-tab-panel>

        <q-tab-panel name="blocks">
          <div class="text-h6">项目积木板</div>
          这里将会放置此项目的所有积木板
        </q-tab-panel>

      </q-tab-panels>
    </div>
</template>

<script>
    export default {
        name: "ProjectArea",
      data (){
          return {
            pro_tab: 'info'
          };
      }
    }
</script>

<style scoped>

</style>
