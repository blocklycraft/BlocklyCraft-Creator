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

          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ $t('plugin.package') }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label caption>{{project_info.package}}</q-item-label>
            </q-item-section>
            <q-popup-edit
              v-model="project_info.package"
              :title="$t('plugin.package')"
              :validate="inputcheck3"
              @save="changePackage"
            >
              <q-input v-model="project_info.package" dense autofocus :dark="dark" />
            </q-popup-edit>
          </q-item>
          <q-item clickable v-ripple @click="command_list_dl=true">
            <q-item-section>
              <q-item-label>{{ $t('plugin.commands') }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="permission_list_dl=true">
            <q-item-section>
              <q-item-label>{{ $t('plugin.permissions') }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="buildPlugin">
            <q-item-section>
              <q-item-label>{{ $t('plugin.build') }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>

      <q-tab-panel name="blocks" style="padding: 0px">
        <q-toolbar class="text-text">
          <q-btn @click="addBlock" flat round dense icon="add_circle_outline" />
          <q-btn @click="saveBlock" flat round dense icon="save" />
        </q-toolbar>

        <q-list separator>
          <div v-for="block_inf in blocks" :key="block_inf">
            <q-item
              clickable
              v-ripple
              active-class="item-active"
              :active="curr_block === block_inf"
              style="text-overflow: ellipsis;"
            >
              <q-item-section @click="openBlock(block_inf)">{{block_inf}}</q-item-section>
              <q-item-section side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn size="12px" flat dense round icon="edit" @click="renameBlock(block_inf)" />
                  <q-btn
                    size="12px"
                    flat
                    dense
                    round
                    icon="delete"
                    @click="deleteBlock(block_inf)"
                  />
                </div>
              </q-item-section>
            </q-item>
          </div>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
    <!--命令列表对话框-->
    <q-dialog v-model="command_list_dl" :dark="dark">
      <q-card class="bg-background" :dark="dark" style="min-width: 500px;">
        <q-card-section>
          <div class="text-h6">{{$t('plugin.commands')}}</div>
        </q-card-section>
        <q-card-section>
          <q-toolbar class="text-text">
            <q-btn
              @click="addCommand"
              flat
              dense
              icon="add_circle_outline"
            >{{$t('project.add_command')}}</q-btn>
          </q-toolbar>
          <q-list
            v-for="command in project_info.commands"
            :dark="dark"
            separator
            :key="command.command"
          >
            <q-item clickable v-ripple @click="edit_command(command)">
              <q-item-section>{{command.command}}</q-item-section>
              <q-item-section side>
                <div class="q-gutter-xs">
                  <q-btn
                    @click="deleteCommand(command.command)"
                    size="12px"
                    flat
                    dense
                    round
                    icon="delete"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!--权限列表对话框-->
    <q-dialog v-model="permission_list_dl" :dark="dark">
      <q-card class="bg-background" :dark="dark" style="min-width: 500px;">
        <q-card-section>
          <div class="text-h6">{{$t('plugin.permissions')}}</div>
        </q-card-section>
        <q-card-section>
          <q-toolbar class="text-text">
            <q-btn
              @click="addPermission"
              flat
              dense
              icon="add_circle_outline"
            >{{$t('project.add_permission')}}</q-btn>
          </q-toolbar>
          <q-list
            v-for="permission in project_info.permissions"
            :dark="dark"
            separator
            :key="permission.permission"
          >
            <q-item clickable v-ripple @click="edit_permission(permission)">
              <q-item-section>{{permission.permission}}</q-item-section>
              <q-item-section side>
                <div class="q-gutter-xs">
                  <q-btn
                    size="12px"
                    flat
                    dense
                    round
                    icon="delete"
                    @click="deletePermission(permission.permission)"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="command_edit_dl" :dark="dark">
      <q-card class="bg-background" :dark="dark" style="min-width: 500px;">
        <q-card-section>
          <div class="text-h6">{{$t('project.edit_command')}}</div>
        </q-card-section>
        <q-card-section>
          <div class="q-gutter-md">
            <q-input
              :disable="curr_edit_command_disable"
              v-model="curr_edit_command.command"
              :dark="dark"
              outlined
              :label="$t('plugin.command')"
            />
            <q-input
              v-model="curr_edit_command.permission"
              :dark="dark"
              outlined
              :label="$t('plugin.permission')"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat v-close-popup>{{$t('dialog.cancel')}}</q-btn>
          <q-btn @click="editCommand" flat>{{$t('dialog.enter')}}</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="permission_edit_dl" :dark="dark">
      <q-card class="bg-background" :dark="dark" style="min-width: 500px;">
        <q-card-section>
          <div class="text-h6">{{$t('project.edit_permission')}}</div>
        </q-card-section>
        <q-card-section>
          <div class="q-gutter-md">
            <q-input
              :disable="curr_edit_permission_disable"
              v-model="curr_edit_permission.permission"
              :dark="dark"
              outlined
              :label="$t('plugin.permission')"
            />
            <q-input
              v-model="curr_edit_permission.default"
              :dark="dark"
              outlined
              :label="$t('plugin.default_own')"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat v-close-popup>{{$t('dialog.cancel')}}</q-btn>
          <q-btn @click="editPermission" flat>{{$t('dialog.enter')}}</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="build_dl" :dark="dark" persistent>
      <BuildDialog :action="build_action" style="min-width:500px"></BuildDialog>
    </q-dialog>
  </div>
</template>

<script>
import BuildDialog from "../components/BuildDialog";
import projectManager from "../project/projectManager";
import logger from "../logger/logger";
import pluginBuilder from "../project/pluginBuilder";


export default {
  name: "ProjectArea",
  components: { BuildDialog },
  data() {
    return {
      pro_tab: "info",
      project_info: {
        name: "",
        author: "",
        version: "",
        package: "",
        commands: [],
        permissions: [],
        path: ""
      },
      blocks: [],
      curr_block: "",
      disable: false,
      dark: false,
      opening_dialog: null,
      command_list_dl: false,
      permission_list_dl: false,
      command_edit_dl: false,
      permission_edit_dl: false,
      curr_edit_command_disable: false,
      curr_edit_permission_disable: false,
      build_dl:false,
      curr_edit_command: {
        command: "",
        permission: ""
      },
      curr_edit_permission: {
        permission: "",
        default: "true"
      },
      build_action: ''
    };
  },
  beforeMount() {
    this.dark = this.$BlockCraft.dark;
    this.$eventHub.$on("project-open", this.openProject);
    this.$eventHub.$on("project-close", this.closeProject);
    this.$eventHub.$on("dark-change", this.changeDark);
    this.$eventHub.$on("load-success", name => {
      this.curr_block = name;
    });
  },
  methods: {
    openProject() {
      this.$logger.info("[ProjectArea]rec project-open");
      let info = projectManager.getProjectInfo();
      this.project_info.name = info.name;
      this.project_info.version = info.version;
      this.project_info.author = info.author ? info.author : "";
      this.project_info.package = info.package;
      let curr_blocks = projectManager.getBlockList();
      this.project_info.commands = projectManager.getCommands();
      this.project_info.permissions = projectManager.getPermissions();
      this.project_info.path = projectManager.getProjectPath()
      if (curr_blocks != null) {
        this.blocks = curr_blocks;
      }
      document.title = "BlockCraft : " + projectManager.getProjectPath();
      this.$eventHub.$emit("title-update", document.title);
    },
    changeDark() {
      this.dark = this.$BlockCraft.dark;
    },
    closeProject() {
      if (this.opening_dialog != null) {
        this.opening_dialog.hide();
        this.opening_dialog = null;
      }
      this.build_dl = false;

      this.$logger.info("[ProjectArea]rec project-close");
      this.project_info.name = "";
      this.project_info.author = "";
      this.project_info.version = "";
      this.project_info.package = "";
      this.blocks = [];
      this.curr_block = "";

      //更新标题
      document.title = "BlockCraft";
      this.$eventHub.$emit("title-update", document.title);
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
    inputcheck3(val) {
      let re = /[a-zA-Z]+[0-9a-zA-Z_]*(\.[a-zA-Z]+[0-9a-zA-Z_]*)*/;
      return re.test(val);
    },
    changeName(name, name_) {
      if (name === name_) {
        return;
        //不需要更新，因为前后都是一样的
      }
      this.project_info.name = name;
      projectManager.getProjectInfo().name = name;
      projectManager.writeTofile();
    },
    changeVersion(ver, ver_) {
      if (ver === ver_) {
        return;
        //不需要更新，因为前后都是一样的
      }
      this.project_info.version = ver;
      projectManager.getProjectInfo().version = ver;
      projectManager.writeTofile();
    },
    changeAuthor(author, author_) {
      if (author === author_) {
        return;
        //不需要更新，因为前后都是一样的
      }
      this.project_info.author = author;
      projectManager.getProjectInfo().author = author;
      projectManager.writeTofile();
    },
    changePackage(packagename, packagename_) {
      if (packagename === packagename_) {
        return;
        //不需要更新，因为前后都是一样的
      }
      this.project_info.package = packagename;
      projectManager.getProjectInfo().package = packagename;
      projectManager.writeTofile();
    },
    deleteBlock(name) {
      this.opening_dialog = this.$q
        .dialog({
          title: this.$t("tip.block_delete_title"),
          message: this.$t("tip.block_delete_msg", {
            name: name
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
            if (blo == name) {
              //如果编辑器打开的是这个积木，那么关闭
              if (this.curr_block == name) {
                //编辑器还没完成:-(
                this.$eventHub.$emit("block-close");
              }
              projectManager.deleteBlock(name);
              break;
            }
            index++;
          }
          let curr_blocks = projectManager.getBlockList();
          if (curr_blocks != null) {
            this.blocks = curr_blocks;
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
    openBlock(name) {
      //通知编辑器打开
      this.$eventHub.$emit("block-open", name);
    },
    renameBlock(name) {
      this.opening_dialog = this.$q
        .dialog({
          title: this.$t("project.rename_block"),
          cancel: true,
          persistent: true,
          dark: this.dark,
          ok: this.$t("dialog.enter"),
          cancel: this.$t("dialog.cancel"),
          prompt: {
            model: name,
            type: "text" // optional
          }
        })
        .onOk(new_name => {
          let re = /^[\u4E00-\u9FA5A-Za-z0-9_\-]+$/;
          if (!re.test(new_name)) {
            this.$snotify.error("积木板名称中仅可包含中英文数字和-_");
            return;
          }
          for (let x = 0; x < this.blocks.length; x++) {
            if (this.blocks[x] == name) {
              //直接赋值会导致视图无法更新
              //详情见:https://cn.vuejs.org/v2/guide/reactivity.html
              projectManager.renameBlock(name, new_name);
            }
          }

          let curr_blocks = projectManager.getBlockList();

          if (curr_blocks != null) {
            this.blocks = {};
            this.blocks = curr_blocks;
          }
          //发送'block-rename'事件(如果编辑器打开的正是当前积木时)

          if (this.curr_block === name) {
            this.curr_block = new_name;
            console.log(this.curr_block);
            this.$eventHub.$emit("block-rename", new_name);
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
    addBlock() {
      this.opening_dialog = this.$q
        .dialog({
          title: this.$t("project.create_block"),
          cancel: true,
          persistent: true,
          dark: this.dark,
          ok: this.$t("dialog.enter"),
          cancel: this.$t("dialog.cancel"),
          prompt: {
            model: "",
            type: "text" // optional
          }
        })
        .onOk(name => {
          if ("" == name) {
            this.$snotify.error(this.$t("tip.invaild_name"));
            return;
          }
          let re = /^[\u4E00-\u9FA5A-Za-z0-9_\-]+$/;
          if (!re.test(name)) {
            this.$snotify.error(this.$t("tip.invaild_name"));
            return;
          }
          console.log(this.blocks);
          for (let block of this.blocks) {
            if (block == name) {
              this.$snotify.error(this.$t("tip.already_exist", { name: name }));
              return;
            }
          }
          projectManager.addBlock(name);
          let curr_blocks = projectManager.getBlockList();
          if (curr_blocks != null) {
            this.blocks = curr_blocks;
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
    saveBlock() {
      this.$eventHub.$emit("block-save");
    },
    edit_command(cmd) {
      //用于弹出对话框
      this.curr_edit_command_disable = true;
      this.curr_edit_command.command = cmd.command;
      this.curr_edit_command.permission = cmd.permission;
      this.command_edit_dl = true;
    },
    edit_permission(per) {
      //用于弹出对话框
      this.curr_edit_permission_disable = true;
      this.curr_edit_permission.permission = per.permission;
      this.curr_edit_permission.default = per.default;
      this.permission_edit_dl = true;
    },
    editCommand() {
      if (
        this.curr_edit_command.command === "" ||
        this.curr_edit_command.permission === ""
      ) {
        return;
      }
      projectManager.changeCommand(
        this.curr_edit_command.command,
        this.curr_edit_command
      );
      this.project_info.commands = projectManager.getCommands();
      this.command_edit_dl = false;
    },
    editPermission() {
      if (
        this.curr_edit_permission.permission === "" ||
        this.curr_edit_permission.default === ""
      ) {
        return;
      }
      projectManager.changePermission(
        this.curr_edit_permission.permission,
        this.curr_edit_permission
      );
      this.project_info.permissions = projectManager.getPermissions();
      console.log(this.project_info.permissions);
      this.permission_edit_dl = false;
    },
    deleteCommand(cmd) {
      projectManager.deleteCommand(cmd);
      this.project_info.commands = projectManager.getCommands();
    },
    deletePermission(per) {
      projectManager.deletePermission(per);
      this.project_info.permissions = projectManager.getPermissions();
    },
    addPermission() {
      this.curr_edit_permission_disable = false;
      this.curr_edit_permission.default = "";
      this.curr_edit_permission.permission = "";
      this.permission_edit_dl = true;
    },
    addCommand() {
      this.curr_edit_command_disable = false;
      this.curr_edit_command.command = "";
      this.curr_edit_command.permission = "";
      this.command_edit_dl = true;
    },
    buildPlugin() {
      this.build_dl=true;
      this.$eventHub.$emit("busy-mode")
      this.build_action = '正在准备构建'
      this.build_action = '生成plugin.yml'
      pluginBuilder.genPluginYml(projectManager.getProjectPath());
      this.build_action = '编译插件'
      pluginBuilder.genJar(projectManager.getProjectPath(),(data,flag)=>{
        logger.info(data);
        if(flag){
          this.build_dl=false;
          this.$snotify.info("构建插件完成。");
          this.build_action = '完成'
        }
      })
    }
  }
};
</script>

<style scoped>
.item-active {
  color: dodgerblue;
}
</style>
