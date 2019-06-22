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
              {{ $t('menu.help') }}
              <q-menu auto-close>
                <q-list dense style="min-width: 100px">
                  <q-item clickable @click="about_dl_show = true">
                    <q-item-section>   {{ $t('menu.about') }}</q-item-section>
                  </q-item>
                  <q-item clickable @click="openUrl('https://github.com/blocklycraft/BlocklyCraft-Creator')">
                    <q-item-section>   {{ $t('menu.github') }}</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section @click="openUrl('https://github.com/blocklycraft/BlocklyCraft-Creator/wiki')">   {{ $t('menu.doc') }}</q-item-section>
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

      <!-- DIALOGS -->
      <q-dialog v-model="about_dl_show">
        <q-card style="min-width: 500px">
          <q-card-section>
            <div class="text-h6">关于 - BlockCraft</div>
          </q-card-section>

          <q-card-section>
            BlockCraft: {{ app_version }}
            <br />
            Electron: {{ electron_version }}
            <br />
            Chrome: {{ chrome_version }}
            <br />
            Node.js: {{ node_version }}
            <br />
            Author:<a @click="openUrl('https://www.mahua-a.top')" href="#">@hempflower</a>
            <br />
            Github:<a @click="openUrl('https://github.com/blocklycraft/BlocklyCraft-Creator')" href="#">https://github.com/blocklycraft/BlocklyCraft-Creator</a>

          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>


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
          },
          openUrl (url){
            let exec = require('child_process').exec;
            exec('start '+url);
          }
      },
      data (){
          return {
            about_dl_show: false,
            app_version: '0.0.1-indev',
            electron_version: process.versions.electron,
            chrome_version : process.versions.chrome,
            node_version: process.versions.node
          }
      }

    }
</script>

<style scoped>

</style>
