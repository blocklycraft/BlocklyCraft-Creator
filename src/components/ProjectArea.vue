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
            <q-popup-edit
              v-model="project_info.name"
              :title="$t('plugin.name')"
              :validate="inputcheck"
              @save="changeName"
            >
              <q-input v-model="project_info.name" dense autofocus :dark="dark" />
            </q-popup-edit>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ $t('plugin.author') }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label caption>{{project_info.author}}</q-item-label>
            </q-item-section>
            <q-popup-edit
              v-model="project_info.author"
              :title="$t('plugin.author')"
              :validate="inputcheck1"
              @save="changeAuthor"
            >
              <q-input v-model="project_info.author" dense autofocus :dark="dark" />
            </q-popup-edit>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ $t('plugin.version') }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label caption>{{project_info.version}}</q-item-label>
            </q-item-section>
            <q-popup-edit
              v-model="project_info.version"
              :title="$t('plugin.version')"
              :validate="inputcheck2"
              @save="changeVersion"
            >
              <q-input v-model="project_info.version" dense autofocus :dark="dark" />
            </q-popup-edit>
          </q-item>
        </q-list>
      </q-tab-panel>

      <q-tab-panel name="blocks" style="padding: 0px">
        <q-list separator>
          <div v-for="block_inf in blocks" :key="block_inf.hash">
            <q-item
              clickable
              v-ripple
              active-class="item-active"
              :active="curr_blocks === block_inf.hash"
              @click="openBlock(block_inf.hash)"
            >
              <q-item-section>{{block_inf.name}}</q-item-section>
              <q-item-section side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn
                    size="12px"
                    flat
                    dense
                    round
                    icon="edit"
                    @click="renameBlock(block_inf.hash)"
                  />
                  <q-btn
                    size="12px"
                    flat
                    dense
                    round
                    icon="delete"
                    @click="deleteBlock(block_inf.hash)"
                  />
                </div>
              </q-item-section>
            </q-item>
          </div>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import projectManager from "../project/projectManager";
import logger from "../logger/logger";

export default {
  name: "ProjectArea",
  data() {
    return {
      pro_tab: "info",
      project_info: {
        name: "",
        author: "",
        version: ""
      },
      blocks: [
        {
          name: "插件入口",
          hash: "sdfdsgffdhgkjlbdjsikg"
        },
        {
          name: "插件入口1",
          hash: "sdfdsgffdhgkbdjsikg"
        }
      ],
      curr_blocks: "",
      disable: false,
      dark: false,
      editor: {
        opened_block: null
      },
      opening_dialog: null
    };
  },
  beforeMount() {
    this.dark = this.$BlockCraft.dark;
    this.$eventHub.$on("project-open", this.openProject);
    this.$eventHub.$on("project-close", this.closeProject);
    this.$eventHub.$on("dark-change", this.changeDark);
    this.$eventHub.$on("load-error", hash => {
      this.curr_blocks = hash;
    });
  },
  mounted() {},
  methods: {
    openProject() {
      this.$logger.info("[ProjectArea]rec project-open");
      let info = projectManager.getProjectInfo();
      this.project_info.name = info.name;
      this.project_info.version = info.version;
      this.project_info.author = info.author ? info.author : "";
    },
    changeDark() {
      this.dark = this.$BlockCraft.dark;
    },
    closeProject() {
      if (this.opening_dialog != null) {
        this.opening_dialog.hide();
        this.opening_dialog = null;
      }

      this.$logger.info("[ProjectArea]rec project-close");
      this.project_info.name = "";
      this.project_info.Author = "";
      this.project_info.version = "";
    },
    inputcheck(val) {
      let re = /^[A-Za-z0-9]+$/;
      return re.test(val);
    },
    inputcheck1(val) {
      let re = /^[A-Za-z0-9_\-]+$/;
      return re.test(val);
    },
    inputcheck2(val) {
      let re = /^[A-Za-z0-9_\-\.]+$/;
      return re.test(val);
    },
    changeName(name, name_) {
      if (name == name_) {
        return;
        //不需要更新，因为前后都是一样的
      }
      this.project_info.name = name;
      projectManager.getProjectInfo().name = name;
      projectManager.writeTofile();
    },
    changeVersion(ver, ver_) {
      if (ver == ver_) {
        return;
        //不需要更新，因为前后都是一样的
      }
      this.project_info.version = ver;
      projectManager.getProjectInfo().version = ver;
      projectManager.writeTofile();
    },
    changeAuthor(author, author_) {
      if (author == author_) {
        return;
        //不需要更新，因为前后都是一样的
      }
      this.project_info.author = author;
      projectManager.getProjectInfo().author = author;
      projectManager.writeTofile();
    },
    hash2name(hash) {
      for (let blo of this.blocks) {
        if (blo.hash == hash) {
          return blo.name;
        }
      }
      return null;
    },
    deleteBlock(hash) {
      if (this.hash2name(hash) == null) {
        return;
        logger.warn("Can't not delete block,because is not existing!");
      }
      this.opening_dialog = this.$q
        .dialog({
          title: this.$t("tip.block_delete_title"),
          message: this.$t("tip.block_delete_msg", {
            name: this.hash2name(hash)
          }),
          cancel: true,
          persistent: true,
          dark: this.dark,
          ok: this.$t("dialog.enter"),
          cancel: this.$t("dialog.cancel")
        })
        .onOk(() => {
          let index = 0;
          for (let blo of this.blocks) {
            if (blo.hash == hash) {
              //如果编辑器打开的是这个积木，那么关闭
              if (editor.opened_block == hash) {
                //编辑器还没完成:-(
              }
              this.blocks.splice(index, 1);
              break;
            }
            index++;
          }
          this.opening_dialog = null;
        })
        .onCancel(() => {
          this.opening_dialog = null;
        })
        .onDismiss(() => {
          this.opening_dialog = null;
        });
    },
    openBlock(hash) {
      if (!this.hash2name(hash)) {
        logger.warn("Can't not open block,it seem not exist!");
        return;
      }
      this.$eventHub.$emit("open-block", hash);
      //this.curr_blocks = hash; //成功后再更改
    },
    renameBlock(hash) {
      if (this.hash2name(hash) == null) {
        logger.warn("Can't not rename block,because is not existing!");
        return;
      }
      this.opening_dialog = this.$q
        .dialog({
          title: this.$t("tip.block_rename_title"),
          cancel: true,
          persistent: true,
          dark: this.dark,
          ok: this.$t("dialog.enter"),
          cancel: this.$t("dialog.cancel"),
          prompt: {
            model: this.hash2name(hash),
            type: "text" // optional
          }
        })
        .onOk(new_name => {
          for (let blo of this.blocks) {
            if (blo.hash == hash) {
              blo.name = new_name;
              break;
            }
          }
          this.opening_dialog = null;
        })
        .onCancel(() => {
          this.opening_dialog = null;
        })
        .onDismiss(() => {
          this.opening_dialog = null;
        });
    }
  }
};
</script>

<style scoped>
.item-active {
  color: dodgerblue;
}
</style>
