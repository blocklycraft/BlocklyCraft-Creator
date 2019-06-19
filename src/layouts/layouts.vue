<template>
    <div>
      <q-layout view="lHh lpr lFf" container style="height: 100%" class="shadow-2">
        <q-header elevated>
          <q-bar class="q-electron-drag">
            <q-icon name="mode_edit" />
            <div>{{ $t('app_name') }}</div>

            <q-space />

            <q-btn dense flat icon="minimize" @click="minimize" />
            <q-btn dense flat icon="crop_square" @click="maximize" />
            <q-btn dense flat icon="close" @click="closeApp" />
          </q-bar>

          <div class="q-pa-sm q-pl-md row items-center">
            <div class="cursor-pointer non-selectable">
              File
              <q-menu>
                <q-list dense style="min-width: 100px">
                  <q-item clickable v-close-popup>
                    <q-item-section>Open...</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section>New</q-item-section>
                  </q-item>

                  <q-separator />

                  <q-item clickable>
                    <q-item-section>Preferences</q-item-section>
                    <q-item-section side>
                      <q-icon name="keyboard_arrow_right" />
                    </q-item-section>

                    <q-menu anchor="top right" self="top left">
                      <q-list>
                        <q-item
                          v-for="n in 3"
                          :key="n"
                          dense
                          clickable
                        >
                          <q-item-section>Submenu Label</q-item-section>
                          <q-item-section side>
                            <q-icon name="keyboard_arrow_right" />
                          </q-item-section>
                          <q-menu auto-close anchor="top right" self="top left">
                            <q-list>
                              <q-item
                                v-for="n in 3"
                                :key="n"
                                dense
                                clickable
                              >
                                <q-item-section>3rd level Label</q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-item>

                  <q-separator />

                  <q-item clickable v-close-popup @click="closeApp">
                    <q-item-section>Quit</q-item-section>
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

        <q-page-container>
          <q-page>
            <router-view></router-view>
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
