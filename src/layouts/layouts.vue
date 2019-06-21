<template>
    <div style="box-sizing:border-box;border-bottom:1px solid #027BE3;border-right:1px solid #027BE3;border-left:1px solid #027BE3;">
      <q-layout view="lHh lpr lFf" container  class="" style="height: 100%;">
        <q-header elevated>
          <q-bar class="q-electron-drag">
            <q-icon name="mode_edit" />
            <div>BlockCraft</div>

            <q-space />

            <q-btn dense flat icon="minimize" @click="minimize" />
            <q-btn dense flat icon="crop_square" @click="maximize" />
            <q-btn dense flat icon="close" @click="closeApp" />
          </q-bar>

          <div class="q-pa-sm q-pl-md row items-center">
            <div class="cursor-pointer non-selectable">
              {{ $t('menu.file') }}
              <q-menu>
                <q-list dense style="min-width: 100px">
                  <q-item clickable v-close-popup>
                    <q-item-section>{{ $t('menu.new') }}</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section>{{ $t('menu.open') }}</q-item-section>
                  </q-item>

                  <q-separator />

                  <q-item clickable v-close-popup @click="closeApp">
                    <q-item-section>{{ $t('menu.quit') }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </div>

            <div class="q-ml-md cursor-pointer non-selectable">
              Edit
              <q-menu auto-close>
                <q-list dense style="min-width: 100px">
                  <q-item clickable>
                    <q-item-section>Cut</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section>Copy</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section>Paste</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable>
                    <q-item-section>Select All</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </div>
          </div>
        </q-header>

        <q-page-container >
          <q-page >
            <router-view style="height: 100%"></router-view>
          </q-page>
        </q-page-container>
      </q-layout>

    </div>
</template>

<script>
    export default {
        name: "layouts",
        methods:{
          minimize (){
            this.$q.electron.remote.BrowserWindow.getFocusedWindow().minimize()

          },
          maximize (){
            const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow()

            if (win.isMaximized()) {
              win.unmaximize()
            }
            else {
              win.maximize()
            }

          },
          closeApp (){
            this.$q.electron.remote.BrowserWindow.getFocusedWindow().close()
          }
      }
    }
</script>

<style scoped>

</style>
