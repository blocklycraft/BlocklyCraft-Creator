<template>
  <div
    style="box-sizing:border-box;border-bottom:1px solid var(--q-color-secondary);border-right:1px solid var(--q-color-secondary);border-left:1px solid var(--q-color-secondary);"
    class="no-scroll text-accent"
  >
    <div class="no-scroll" view="lHh lpr lFf" container style="height: 100%;">
      <div>
        <q-bar class="q-electron-drag bg-secondary text-white">
          <q-icon name="mode_edit" />
          <div>BlockCraft</div>

          <q-space />

          <q-btn dense flat icon="minimize" @click="minimize" />
          <q-btn dense flat icon="crop_square" @click="maximize" />
          <q-btn dense flat icon="close" @click="closeApp" />
        </q-bar>

        <div class="q-pa-sm q-pl-md row items-center bg-secondary text-white">
          <div class="cursor-pointer non-selectable">
            {{ $t('menu.file') }}
            <q-menu>
              <q-list dense style="min-width: 100px">
                <q-item clickable v-close-popup @click="new_pro_dl_show = true">
                  <q-item-section>{{ $t('menu.new') }}</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="open_project">
                  <q-item-section>{{ $t('menu.open') }}</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="close_project">
                  <q-item-section>{{ $t('menu.close') }}</q-item-section>
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
        <q-dialog v-model="about_dl_show">
          <q-card class="bg-background" :dark="dark" style="min-width: 500px">
            <q-card-section>
              <div class="text-h6 text-accent">{{ $t('app.aboutme') }}</div>
            </q-card-section>

            <q-card-section>
              BlockCraft: {{ app_version }}
              <br />
              Electron: {{ electron_version }}
              <br />
              Chrome: {{ chrome_version }}
              <br />
              Node.js: {{ node_version }}
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

        <q-dialog v-model="new_pro_dl_show" persistent>
          <q-card class="bg-background" :dark="dark" style="min-width: 500px">
            <q-card-section>
              <div class="text-h6">{{ $t('project.create') }}</div>
            </q-card-section>
            <q-card-section>
              <q-form class="q-gutter-md">
                <q-input
                  v-model="create_pro_dl.path"
                  :label="$t('project.path')"
                  dense
                  :dark="dark"
                >
                  <template v-slot:after>
                    <q-btn round dense flat icon="explore" />
                  </template>
                </q-input>
                <q-input
                  :dark="dark"
                  v-model="create_pro_dl.name"
                  :label="$t('project.name')"
                  dense
                ></q-input>
              </q-form>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat :label="$t('dialog.cancel')" color="primary" v-close-popup />
              <q-btn flat :label="$t('dialog.create')" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="setting_dl_show" persistent>
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
                  v-model="setting_lang_sel_model"
                  :options="langs"
                  :label="$t('app.lang')"
                  @input="setlocal"
                />
                <q-toggle
                  :dark="dark"
                  @input="setDark"
                  :label="$t('app.dark')"
                  v-model="setting_them_sel_model"
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

        <q-dialog v-model="getStart_dl" persistent>
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
              <q-btn no-caps flat @click="new_pro_dl_show = true" :label="$t('start.create')" />
              <q-btn no-caps flat @click="open_project" :label="$t('start.open')" />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <Index style="height: 100%"></Index>
      </div>
    </div>

    <vue-snotify></vue-snotify>
  </div>
</template>

<script>
import Index from "../pages/Index";
const settings = require("electron-settings");
import theme_light from "../theme/light";
import theme_dark from "../theme/dark";
import projectManager from "../project/projectManager";

export default {
  name: "layouts",
  components: { Index },
  methods: {
    setlocal(lang) {
      const settings = require("electron-settings");
      this.$i18n.locale = lang;
      settings.set("language", lang);
    },
    openProject(filePaths) {
      if (filePaths !== undefined && filePaths.length > 0) {
        let path = filePaths[0];
        this.$eventHub.$emit("project-close");
        let result = projectManager.openProject(path);
        this.$logger.info("Open project result:" + result);
        if (result != "SUCCESS") {
          this.$eventHub.$emit("project-close");
          this.$snotify.error("未能打开改项目");
          return;
        }
        this.$eventHub.$emit("project-open");
        this.$snotify.info("项目打开事件");
        this.getStart_dl = false;
      }
    },
    setDark(dark) {
      if (dark) {
        this.$BlockCraft.applyTheme(theme_dark);
        this.$BlockCraft.dark = true;
        this.dark = true;
      } else {
        this.$BlockCraft.applyTheme(theme_light);
        this.$BlockCraft.dark = false;
        this.dark = false;
      }
      settings.set("dark", dark);
      this.$eventHub.$emit("dark-change");
    },
    minimize() {
      this.$q.electron.remote.BrowserWindow.getFocusedWindow().minimize();
    },
    maximize() {
      const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow();

      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
    },
    closeApp() {
      this.$q.electron.remote.BrowserWindow.getFocusedWindow().close();
    },
    openUrl(url) {
      let exec = require("child_process").exec;
      exec("start " + url);
    },
    open_project() {
      const { dialog } = require("electron").remote;
      dialog.showOpenDialog(
        {
          title: this.$i18n.t("project.open"),
          properties: ["openDirectory"]
        },
        this.openProject
      );
    },
    close_project() {
      this.$eventHub.$emit("project-close");
      projectManager.unloadProject();
      this.$logger.info("[BlockCraft]Project unloaded!");
      this.getStart_dl = true;
    },
    changeDark(mode) {
      this.dark = mode;
    }
  },
  data() {
    return {
      dark: false,
      about_dl_show: false,
      new_pro_dl_show: false,
      setting_dl_show: false,
      setting_lang_sel_model: this.$i18n.locale,
      setting_them_sel_model: settings.get("dark"),
      getStart_dl: true,
      app_version: this.$BlockCraft.versions.blockcraft,
      electron_version: process.versions.electron,
      chrome_version: process.versions.chrome,
      node_version: process.versions.node,

      create_pro_dl: {
        path: "",
        name: ""
      },
      langs: [
        {
          label: "简体中文",
          value: "zh-cn"
        },
        {
          label: "English",
          value: "en-us"
        }
      ]
    };
  },
  beforeMount() {
    this.dark = this.$BlockCraft.dark;
  },
  mounted() {
    this.$eventHub.$on("dark-change", () => {
      this.changeDark(this.$BlockCraft.dark);
    });
  }
};
</script>

<style scoped>
</style>
