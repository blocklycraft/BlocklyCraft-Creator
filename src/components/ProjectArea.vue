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
        <q-tab-panel style="padding: 0px" name="info">
          <q-list  separator>

            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>插件名称</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>测试插件</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>作者</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>hempflower</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>版本</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>0.0.1</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
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
