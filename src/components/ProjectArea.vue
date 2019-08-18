<template>
  <div style="height: 100%">
    <q-tabs
      v-model="activeTab"
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

    <q-tab-panels v-model="activeTab" class="bg-background text-text">
      <q-tab-panel style="padding: 0px" name="info">
        <q-list separator :dark="dark">
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ $t('plugin.name') }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label caption>{{projectInfo.name}}</q-item-label>
            </q-item-section>
            <q-popup-edit
              v-model="projectInfo.name"
              :title="$t('plugin.name')"
              :validate="inputcheck"
              @save="changeName"
            >
              <q-input v-model="projectInfo.name" dense autofocus :dark="dark" />
            </q-popup-edit>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ $t('plugin.author') }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label caption>{{projectInfo.author}}</q-item-label>
            </q-item-section>
            <q-popup-edit
              v-model="projectInfo.author"
              :title="$t('plugin.author')"
              :validate="inputcheck1"
              @save="changeAuthor"
            >
              <q-input v-model="projectInfo.author" dense autofocus :dark="dark" />
            </q-popup-edit>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ $t('plugin.version') }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label caption>{{projectInfo.version}}</q-item-label>
            </q-item-section>
            <q-popup-edit
              v-model="projectInfo.version"
              :title="$t('plugin.version')"
              :validate="inputcheck2"
              @save="changeVersion"
            >
              <q-input v-model="projectInfo.version" dense autofocus :dark="dark" />
            </q-popup-edit>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ $t('plugin.package') }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label caption>{{projectInfo.package}}</q-item-label>
            </q-item-section>
            <q-popup-edit
              v-model="projectInfo.package"
              :title="$t('plugin.package')"
              :validate="inputcheck3"
              @save="changePackage"
            >
              <q-input v-model="projectInfo.package" dense autofocus :dark="dark" />
            </q-popup-edit>
          </q-item>
          <q-item clickable v-ripple @click="CommandListDialog=true">
            <q-item-section>
              <q-item-label>{{ $t('plugin.commands') }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="permissionListDialog=true">
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
              :active="currBlock === block_inf"
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
    <q-dialog v-model="CommandListDialog" :dark="dark">
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
            v-for="command in projectInfo.commands"
            :dark="dark"
            separator
            :key="command.command"
          >
            <q-item clickable v-ripple @click="callEditCommand(command)">
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
    <q-dialog v-model="permissionListDialog" :dark="dark">
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
            v-for="permission in projectInfo.permissions"
            :dark="dark"
            separator
            :key="permission.permission"
          >
            <q-item clickable v-ripple @click="callEditPermission(permission)">
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
    <q-dialog v-model="commandEditDialog" :dark="dark">
      <q-card class="bg-background" :dark="dark" style="min-width: 500px;">
        <q-card-section>
          <div class="text-h6">{{$t('project.edit_command')}}</div>
        </q-card-section>
        <q-card-section>
          <div class="q-gutter-md">
            <q-input
              :disable="editCommandDisable"
              v-model="editCommandData.command"
              :dark="dark"
              outlined
              :label="$t('plugin.command')"
            />
            <q-input
              v-model="editCommandData.permission"
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

    <q-dialog v-model="permissionEditDialog" :dark="dark">
      <q-card class="bg-background" :dark="dark" style="min-width: 500px;">
        <q-card-section>
          <div class="text-h6">{{$t('project.edit_permission')}}</div>
        </q-card-section>
        <q-card-section>
          <div class="q-gutter-md">
            <q-input
              :disable="editPermissionDisable"
              v-model="editPermissionData.permission"
              :dark="dark"
              outlined
              :label="$t('plugin.permission')"
            />
            <q-input
              v-model="editPermissionData.default"
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
    <q-dialog v-model="buildDialog" :dark="dark" persistent>
      <BuildDialog :action="buildAction" style="min-width:500px"></BuildDialog>
    </q-dialog>
  </div>
</template>

<script>
import BuildDialog from '../components/BuildDialog'
import projectManager from '../project/projectManager'
import pluginBuilder from '../project/pluginBuilder'
export default {
  name: 'ProjectArea',
  components: { BuildDialog },
  data () {
    return {
      activeTab: 'info',
      projectInfo: {
        name: '',
        author: '',
        version: '',
        package: '',
        commands: [],
        permissions: [],
        path: ''
      },
      blocks: [],
      currBlock: '',
      disable: false,
      dark: false,
      openedDialog: null,
      CommandListDialog: false,
      permissionListDialog: false,
      commandEditDialog: false,
      permissionEditDialog: false,
      editCommandDisable: false,
      editPermissionDisable: false,
      buildDialog: false,
      editCommandData: {
        command: '',
        permission: ''
      },
      editPermissionData: {
        permission: '',
        default: 'true'
      },
      buildAction: ''
    }
  },
  beforeMount () {
    this.dark = this.$BlockCraft.dark
    this.$eventHub.$on('project-open', this.openProject)
    this.$eventHub.$on('project-close', this.closeProject)
    this.$eventHub.$on('dark-change', this.changeDark)
    this.$eventHub.$on('load-success', name => {
      this.currBlock = name
    })
  },
  methods: {
    openProject () {
      this.$logger.info('[ProjectArea]rec project-open')
      const info = projectManager.getProjectInfo()
      this.projectInfo.name = info.name
      this.projectInfo.version = info.version
      this.projectInfo.author = info.author ? info.author : ''
      this.projectInfo.package = info.package
      const currBlocks = projectManager.getBlockList()
      this.projectInfo.commands = projectManager.getCommands()
      this.projectInfo.permissions = projectManager.getPermissions()
      this.projectInfo.path = projectManager.getProjectPath()
      if (currBlocks !== null) {
        this.blocks = currBlocks
      }
      document.title = 'BlockCraft : ' + projectManager.getProjectPath()
      this.$eventHub.$emit('title-update', document.title)
    },
    changeDark () {
      this.dark = this.$BlockCraft.dark
    },
    closeProject () {
      if (this.openedDialog != null) {
        this.openedDialog.hide()
        this.openedDialog = null
      }
      this.buildDialog = false

      this.$logger.info('[ProjectArea]rec project-close')
      this.projectInfo.name = ''
      this.projectInfo.author = ''
      this.projectInfo.version = ''
      this.projectInfo.package = ''
      this.blocks = []
      this.currBlock = ''

      // 更新标题
      document.title = 'BlockCraft'
      this.$eventHub.$emit('title-update', document.title)
    },
    inputcheck (val) {
      const re = /^[A-Za-z0-9]+$/
      return re.test(val)
    },
    inputcheck1 (val) {
      const re = /^[A-Za-z0-9_-]+$/
      return re.test(val)
    },
    inputcheck2 (val) {
      const re = /^[A-Za-z0-9_\-.]+$/
      return re.test(val)
    },
    inputcheck3 (val) {
      const re = /[a-zA-Z]+[0-9a-zA-Z_]*(\.[a-zA-Z]+[0-9a-zA-Z_]*)*/
      return re.test(val)
    },
    changeName (name, name_) {
      if (name === name_) {
        return
        // 不需要更新，因为前后都是一样的
      }
      this.projectInfo.name = name
      projectManager.getProjectInfo().name = name
      projectManager.writeTofile()
    },
    changeVersion (ver, ver_) {
      if (ver === ver_) {
        return
        // 不需要更新，因为前后都是一样的
      }
      this.projectInfo.version = ver
      projectManager.getProjectInfo().version = ver
      projectManager.writeTofile()
    },
    changeAuthor (author, author_) {
      if (author === author_) {
        return
        // 不需要更新，因为前后都是一样的
      }
      this.projectInfo.author = author
      projectManager.getProjectInfo().author = author
      projectManager.writeTofile()
    },
    changePackage (packagename, packagename_) {
      if (packagename === packagename_) {
        return
        // 不需要更新，因为前后都是一样的
      }
      this.projectInfo.package = packagename
      projectManager.getProjectInfo().package = packagename
      projectManager.writeTofile()
    },
    deleteBlock (name) {
      this.openedDialog = this.$q
        .dialog({
          title: this.$t('tip.block_delete_title'),
          message: this.$t('tip.block_delete_msg', {
            name: name
          }),
          persistent: true,
          dark: this.dark,
          ok: this.$t('dialog.enter'),
          cancel: this.$t('dialog.cancel')
        })
        .onOk(() => {
          for (const blo of this.blocks) {
            if (blo === name) {
              // 如果编辑器打开的是这个积木，那么关闭
              if (this.currBlock === name) {
                // 编辑器还没完成:-(
                this.$eventHub.$emit('block-close')
              }
              projectManager.deleteBlock(name)
              break
            }
          }
          const currBlocks = projectManager.getBlockList()
          if (currBlocks != null) {
            this.blocks = currBlocks
          }
          this.openedDialog = null
        })
        .onCancel(() => {
          this.openedDialog = null
        })
        .onDismiss(() => {
          this.openedDialog = null
        })
    },
    openBlock (name) {
      // 通知编辑器打开
      this.$eventHub.$emit('block-open', name)
    },
    renameBlock (name) {
      this.openedDialog = this.$q
        .dialog({
          title: this.$t('project.rename_block'),
          persistent: true,
          dark: this.dark,
          ok: this.$t('dialog.enter'),
          cancel: this.$t('dialog.cancel'),
          prompt: {
            model: name,
            type: 'text' // optional
          }
        })
        .onOk(newName => {
          const re = /^[\u4E00-\u9FA5A-Za-z0-9_-]+$/
          if (!re.test(newName)) {
            this.$snotify.error('积木板名称中仅可包含中英文数字和-_')
            return
          }
          for (let x = 0; x < this.blocks.length; x++) {
            if (this.blocks[x] === name) {
              // 直接赋值会导致视图无法更新
              // 详情见:https://cn.vuejs.org/v2/guide/reactivity.html
              projectManager.renameBlock(name, newName)
            }
          }

          const currBlocks = projectManager.getBlockList()

          if (currBlocks != null) {
            this.blocks = {}
            this.blocks = currBlocks
          }
          // 发送'block-rename'事件(如果编辑器打开的正是当前积木时)

          if (this.currBlock === name) {
            this.currBlock = newName
            console.log(this.currBlock)
            this.$eventHub.$emit('block-rename', newName)
          }
          this.openedDialog = null
        })
        .onCancel(() => {
          this.openedDialog = null
        })
        .onDismiss(() => {
          this.openedDialog = null
        })
    },
    addBlock () {
      this.openedDialog = this.$q
        .dialog({
          title: this.$t('project.create_block'),
          persistent: true,
          dark: this.dark,
          ok: this.$t('dialog.enter'),
          cancel: this.$t('dialog.cancel'),
          prompt: {
            model: '',
            type: 'text' // optional
          }
        })
        .onOk(name => {
          if (name === '') {
            this.$snotify.error(this.$t('tip.invaild_name'))
            return
          }
          const re = /^[\u4E00-\u9FA5A-Za-z0-9_-]+$/
          if (!re.test(name)) {
            this.$snotify.error(this.$t('tip.invaild_name'))
            return
          }
          console.log(this.blocks)
          for (const block of this.blocks) {
            if (block === name) {
              this.$snotify.error(this.$t('tip.already_exist', { name: name }))
              return
            }
          }
          projectManager.addBlock(name)
          const currBlocks = projectManager.getBlockList()
          if (currBlocks != null) {
            this.blocks = currBlocks
          }
          this.openedDialog = null
        })
        .onCancel(() => {
          this.openedDialog = null
        })
        .onDismiss(() => {
          this.openedDialog = null
        })
    },
    saveBlock () {
      this.$eventHub.$emit('block-save')
    },
    callEditCommand (cmd) {
      // 用于弹出对话框
      this.editCommandDisable = true
      this.editCommand.command = cmd.command
      this.editCommand.permission = cmd.permission
      this.commandEditDialog = true
    },
    callEditPermission (per) {
      // 用于弹出对话框
      this.editPermissionDisable = true
      this.editPermission.permission = per.permission
      this.editPermission.default = per.default
      this.permissionEditDialog = true
    },
    editCommand () {
      if (
        this.editCommand.command === '' ||
        this.editCommand.permission === ''
      ) {
        return
      }
      projectManager.changeCommand(this.editCommand.command, this.editCommand)
      this.projectInfo.commands = projectManager.getCommands()
      this.commandEditDialog = false
    },
    editPermission () {
      if (
        this.editPermission.permission === '' ||
        this.editPermission.default === ''
      ) {
        return
      }
      projectManager.changePermission(
        this.editPermission.permission,
        this.editPermission
      )
      this.projectInfo.permissions = projectManager.getPermissions()
      console.log(this.projectInfo.permissions)
      this.permissionEditDialog = false
    },
    deleteCommand (cmd) {
      projectManager.deleteCommand(cmd)
      this.projectInfo.commands = projectManager.getCommands()
    },
    deletePermission (per) {
      projectManager.deletePermission(per)
      this.projectInfo.permissions = projectManager.getPermissions()
    },
    addPermission () {
      this.editPermissionDisable = false
      this.editPermission.default = ''
      this.editPermission.permission = ''
      this.permissionEditDialog = true
    },
    addCommand () {
      this.editCommandDisable = false
      this.editCommand.command = ''
      this.editCommand.permission = ''
      this.commandEditDialog = true
    },
    buildPlugin () {
      // 进行一些必要的检查
      if (!pluginBuilder.check(projectManager.getProjectPath())) {
        this.$snotify.error('构建插件失败，项目目录被非法修改。')
        return
      }
      if (projectManager.getBlockList().length === 0) {
        this.$snotify.error('构建插件失败，你至少需要创建一个积木板。')
        return
      }
      // 重新生成脚本代码
      /* 即将重写
      for(let block of projectManager.getBlockList()){
        this.$eventHub.$emit('block-rebuild',block)
      }
      */
      this.buildDialog = true
      this.buildAction = '正在准备构建'
      this.buildAction = '生成plugin.yml'
      pluginBuilder.genPluginYml(projectManager.getProjectPath())
      this.buildAction = '生成脚本代码'
      pluginBuilder.genJavaScript(projectManager.getProjectPath())
      this.buildAction = '编译插件'
      pluginBuilder.genJar(
        projectManager.getProjectPath(),
        result => {
          this.buildDialog = false
          this.buildAction = '完成'
          if (result) {
            this.$snotify.info(
              '构建插件成功，我们已经自动打开插件所在文件夹。'
            )
          } else {
            this.$snotify.error('构建插件失败，详情请查看日志。')
          }
        },
        result => {}
      )
    }
  }
}
</script>

<style scoped>
.item-active {
  color: dodgerblue;
}
</style>
