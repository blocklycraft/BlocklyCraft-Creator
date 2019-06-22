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
                  <q-item clickable v-close-popup @click="new_pro_dl_show = true">
                    <q-item-section>{{ $t('menu.new') }}</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="open_porject">
                    <q-item-section>{{ $t('menu.open') }}</q-item-section>
                  </q-item>

                  <q-separator />
                  <q-item clickable v-close-popup @click="setting_dl_show = true">
                    <q-item-section>{{ $t('menu.setting') }}</q-item-section>
                  </q-item>

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

        <q-page-container style="height: auto">
          <q-page style="height: auto">
            <Index style="height: auto"></Index>
          </q-page>
        </q-page-container>
      </q-layout>

      <!-- DIALOGS -->
      <q-dialog v-model="about_dl_show">
        <q-card style="min-width: 500px">
          <q-card-section>
            <div class="text-h6">{{ $t('app.aboutme') }}</div>
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

      <q-dialog v-model="new_pro_dl_show" persistent>
        <q-card style="min-width: 500px">
          <q-card-section>
            <div class="text-h6">{{ $t('project.create') }}</div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input v-model="create_pro_dl.path"
                       :label="$t('project.path')"
                       dense
              >
                <template v-slot:after>
                  <q-btn round dense flat icon="explore" />
                </template>
              </q-input>
              <q-input v-model="create_pro_dl.name" :label="$t('project.name')" dense></q-input>
            </q-form>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat :label="$t('dialog.cancel')" color="primary" v-close-popup />
            <q-btn flat :label="$t('dialog.create')" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="setting_dl_show" persistent>
        <q-card style="min-width: 500px">
          <q-card-section>
            <div class="text-h6">{{ $t('menu.setting') }}</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-select  map-options emit-value outlined v-model="setting_lang_sel_model" :options="langs" :label="$t('app.lang')" @input="setlocal"/>


          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat :label="$t('dialog.close')" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <vue-snotify></vue-snotify>


    </div>
</template>

<script>
  import Index from '../pages/Index'
  function setCookie(name,value)
  {
    let Days = 30;
    let exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
  }
  export default {
        name: "layouts",
      components: {Index},
      methods:{
          setlocal(lang){
            this.$i18n.locale = lang;
            setCookie('language',lang);
          },
          openProject (filePaths){
          if(filePaths!==undefined && filePaths.length>0){
            let path = filePaths[0];
            this.BlockCraft.project.opened = true;
            this.BlockCraft.project.path= path;
            this.$emit('project-open');
            this.$snotify.info("项目打开事件")
          }

        },
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
          },
          open_porject (){
            const { dialog } = require('electron').remote
            dialog.showOpenDialog({
              title:this.$i18n.t('project.open'),
              properties:['openDirectory'],

            },
              this.openProject
            );
          }
      },
      data (){
          return {
            about_dl_show: false,
            new_pro_dl_show: false,
            setting_dl_show: false,
            setting_lang_sel_model: this.$q.lang.getLocale(),
            app_version: '0.0.1-indev',
            electron_version: process.versions.electron,
            chrome_version : process.versions.chrome,
            node_version: process.versions.node,
            create_pro_dl:{
              path: '',
              name: ''
            },
            langs:[
              {
                label: '简体中文',
                value: 'zh-cn',
              },
              {
                label: 'English',
                value: 'en-us',
              }
            ]
          }
      }

    }
</script>

<style scoped>

</style>
