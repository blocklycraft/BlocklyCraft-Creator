<template>
  <div
    style="box-sizing:border-box;border-bottom:1px solid var(--q-color-secondary);border-right:1px solid var(--q-color-secondary);border-left:1px solid var(--q-color-secondary);"
    class="no-scroll text-accent"
  >
    <div class="no-scroll" view="lHh lpr lFf" container style="height: 100%;">
      <div>
        <q-bar class="q-electron-drag bg-secondary text-white">
          <q-icon name="mode_edit" />
          <div>{{title}}</div>

          <q-space />

          <q-btn dense flat icon="minimize" @click="minimize" />
          <q-btn dense flat icon="crop_square" @click="maximize" />
          <q-btn dense flat icon="close" @click="closeApp" />
        </q-bar>

        <div class="q-pa-sm row items-center bg-secondary text-white">
          <div class="q-ml-md cursor-pointer non-selectable">
            {{ $t('menu.file') }}
            <q-menu>
              <q-list dense style="min-width: 100px">
                <q-item clickable v-close-popup @click="projectDialog = true">
                  <q-item-section>{{ $t('menu.new') }}</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="open_project">
                  <q-item-section>{{ $t('menu.open') }}</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="close_project">
                  <q-item-section>{{ $t('menu.close') }}</q-item-section>
                </q-item>

                <q-separator />
                <q-item clickable v-close-popup @click="settingDialog = true">
                  <q-item-section>{{ $t('menu.setting') }}</q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="closeApp">
                  <q-item-section>{{ $t('menu.quit') }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>

          <div class="q-ml-md cursor-pointer non-selectable">{{ $t('menu.libraries') }}</div>

          <div class="q-ml-md cursor-pointer non-selectable">
            {{ $t('menu.help') }}
            <q-menu auto-close>
              <q-list dense style="min-width: 100px">
                <q-item clickable @click="aboutDialog = true">
                  <q-item-section>{{ $t('menu.about') }}</q-item-section>
                </q-item>
                <q-item
                  clickable
                  @click="openUrl('https://github.com/blocklycraft/BlocklyCraft-Creator')"
                >
                  <q-item-section>{{ $t('menu.github') }}</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section
                    @click="openUrl('https://github.com/blocklycraft/BlocklyCraft-Creator/wiki')"
                  >{{ $t('menu.doc') }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>
        </div>
      </div>
      <q-separator :dark="dark" />

      <div class="text-text bg-background" style="height: 100%">
        <!-- DIALOGS -->
        <q-dialog v-model="aboutDialog">
          <q-card class="bg-background" :dark="dark" style="min-width: 500px">
            <q-card-section>
              <div class="text-h6 text-accent">{{ $t('app.aboutme') }}</div>
            </q-card-section>

            <q-card-section>
              BlockCraft: {{ appVersion }}
              <br />
              Electron: {{ electronVersion }}
              <br />
              Chrome: {{ chromeVersion }}
              <br />
              Node.js: {{ nodeVersion }}
              <br />Author:
              <a @click="openUrl('https://www.mahua-a.top')" href="#">@hempflower</a>
              <br />Github:
              <a
                @click="openUrl('https://github.com/blocklycraft/BlocklyCraft-Creator')"
                href="#"
              >https://github.com/blocklycraft/BlocklyCraft-Creator</a>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="OK" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="projectDialog" persistent>
          <q-card class="bg-background" :dark="dark" style="min-width: 500px">
            <q-card-section>
              <div class="text-h6">{{ $t('project.create') }}</div>
            </q-card-section>
            <q-card-section>
              <q-form class="q-gutter-md">
                <q-input
                  v-model="createProjectData.path"
                  :label="$t('project.path')"
                  dense
                  :dark="dark"
                >
                  <template v-slot:after>
                    <q-btn round dense flat icon="explore" @click="selectPath" />
                  </template>
                </q-input>
                <q-input
                  :dark="dark"
                  v-model="createProjectData.name"
                  :label="$t('project.name')"
                  dense
                ></q-input>
                <q-input
                  :dark="dark"
                  v-model="createProjectData.package"
                  :label="$t('project.package')"
                  dense
                ></q-input>
              </q-form>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat :label="$t('dialog.cancel')" color="primary" v-close-popup />
              <q-btn flat :label="$t('dialog.create')" color="primary" @click="createProject" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="settingDialog" persistent>
          <q-card class="bg-background" :dark="dark" style="min-width: 500px;">
            <q-card-section>
              <div class="text-h6">{{ $t('menu.setting') }}</div>
            </q-card-section>
            <q-separator :dark="dark" />
            <q-card-section>
              <div class="q-gutter-md">
                <q-select
                  :dark="dark"
                  map-options
                  emit-value
                  outlined
                  v-model="languageSetting"
                  :options="langs"
                  :label="$t('app.lang')"
                  @input="setlocal"
                />
                <q-toggle
                  :dark="dark"
                  @input="setDark"
                  :label="$t('app.dark')"
                  v-model="themeSetting"
                >
                  <q-tooltip>{{$t('tip.dark_restart')}}</q-tooltip>
                </q-toggle>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat :label="$t('dialog.close')" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="getstartDialog" persistent>
          <q-card class="bg-background" :dark="dark" style="min-width: 500px;">
            <q-card-section>
              <div class="text-h6">{{$t('start.title')}}</div>
            </q-card-section>
            <q-separator :dark="dark" />
            <q-card-section>
              <div class="q-gutter-md">
                <div>{{$t('start.msg')}}</div>
              </div>
            </q-card-section>
            <q-card-actions vertical>
              <q-btn no-caps flat @click="projectDialog = true" :label="$t('start.create')" />
              <q-btn no-caps flat @click="open_project" :label="$t('start.open')" />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <Index style="height: calc(100% - 69px)"></Index>
      </div>
    </div>
    <vue-snotify></vue-snotify>
  </div>
</template>

<script>
import Index from '../pages/Index'
import themeLight from '../theme/light'
import themeDark from '../theme/dark'
import projectManager from '../project/projectManager'
const settings = require('electron-settings')

export default {
  name: 'layouts',
  components: { Index },
  methods: {
    setlocal (lang) {
      const settings = require('electron-settings')
      this.$i18n.locale = lang
      settings.set('language', lang)
    },
    openProject (filePath) {
      if (filePath !== undefined) {
        const path = filePath
        this.$eventHub.$emit('project-close')
        const result = projectManager.openProject(path)
        this.$logger.info('Open project result:' + result)
        if (result !== 'SUCCESS') {
          this.$eventHub.$emit('project-close')
          this.$snotify.error('未能打开改项目')
          return
        }
        this.$eventHub.$emit('project-open')

        this.getstartDialog = false
      }
    },
    setDark (dark) {
      if (dark) {
        this.$BlockCraft.applyTheme(themeDark)
        this.$BlockCraft.dark = true
        this.dark = true
      } else {
        this.$BlockCraft.applyTheme(themeLight)
        this.$BlockCraft.dark = false
        this.dark = false
      }
      settings.set('dark', dark)
      this.$eventHub.$emit('dark-change')
    },
    minimize () {
      this.$q.electron.remote.BrowserWindow.getFocusedWindow().minimize()
    },
    maximize () {
      const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow()

      if (win.isMaximized()) {
        win.unmaximize()
      } else {
        win.maximize()
      }
    },
    closeApp () {
      this.$q.electron.remote.BrowserWindow.getFocusedWindow().close()
    },
    openUrl (url) {
      const exec = require('child_process').exec
      exec('start ' + url)
    },
    open_project () {
      if (this.busy) {
        return
      }
      const { dialog } = require('electron').remote
      const path = dialog.showOpenDialog({
        title: this.$i18n.t('project.open'),
        properties: ['openDirectory']
      })
      if (path === undefined) {
        return
      }
      if (path.length === 0) {
        return
      }
      this.openProject(path[0])
    },
    close_project () {
      if (this.busy) {
        return
      }
      this.$eventHub.$emit('project-close')
      projectManager.unloadProject()
      this.$logger.info('[BlockCraft]Project unloaded!')
      this.getstartDialog = true
    },
    changeDark (mode) {
      this.dark = mode
    },
    createProject () {
      const fs = require('fs')
      let re = /[a-zA-Z]:(\\.+)*/
      if (!re.test(this.createProjectData.path)) {
        this.$snotify.error(
          this.$t('tip.can_not_create') + this.$t('tip.invaild_path')
        )
        return
      }
      re = /^[A-Za-z0-9_-]+$/
      if (!re.test(this.createProjectData.name)) {
        this.$snotify.error(
          this.$t('tip.can_not_create') + this.$t('tip.invaild_name')
        )
        return
      }
      re = /[a-zA-Z]+[0-9a-zA-Z_]*(\.[a-zA-Z]+[0-9a-zA-Z_]*)*/
      if (!re.test(this.createProjectData.package)) {
        this.$snotify.error(
          this.$t('tip.can_not_create') + this.$t('tip.invaild_package')
        )
        return
      }
      if (fs.existsSync(this.createProjectData.path)) {
        if (fs.lstatSync(this.createProjectData.path).isDirectory()) {
          if (fs.readdirSync(this.createProjectData.path).length !== 0) {
            console.log(fs.readdirSync(this.createProjectData.path).length)
            // 路径已经存在且不为空，不能创建项目
            this.$snotify.error(
              this.$t('tip.can_not_create') + this.$t('tip.project_exist')
            )
            return
          }
        }
      }
      const res = projectManager.createProject(
        this.createProjectData.path,
        this.createProjectData.name,
        this.createProjectData.package
      )
      if (!res) {
        this.$snotify.error(
          this.$t('tip.can_not_create') + this.$t('tip.create_fail')
        )
        return
      }
      this.projectDialog = false
      this.getstartDialog = false
      this.openProject(this.createProjectData.path)
    },
    selectPath () {
      const { dialog } = require('electron').remote
      const path = dialog.showOpenDialog({
        title: this.$i18n.t('project.create'),
        properties: ['openDirectory']
      })
      if (path === undefined) {
        return
      }
      if (path.length === 0) {
        return
      }
      this.createProjectData.path = path[0]
    },
    changeTitle (title) {
      this.title = title
    }
  },
  data () {
    return {
      busy: false,
      dark: false,
      aboutDialog: false,
      projectDialog: false,
      settingDialog: false,
      languageSetting: this.$i18n.locale,
      themeSetting: settings.get('dark'),
      getstartDialog: true,
      appVersion: this.$BlockCraft.versions.blockcraft,
      electronVersion: process.versions.electron,
      chromeVersion: process.versions.chrome,
      nodeVersion: process.versions.node,
      title: 'BlockCraft',
      createProjectData: {
        path: '',
        name: '',
        package: ''
      },
      langs: [
        {
          label: '简体中文',
          value: 'zh-cn'
        }
      ]
    }
  },
  mounted () {
    this.dark = this.$BlockCraft.dark
    this.$eventHub.$on('dark-change', () => {
      this.changeDark(this.$BlockCraft.dark)
    })
    this.$eventHub.$on('title-update', this.changeTitle)
    this.$eventHub.$on('busy-mode', flag => {
      this.busy = flag
    })
  }
}
</script>

<style scoped>
</style>
