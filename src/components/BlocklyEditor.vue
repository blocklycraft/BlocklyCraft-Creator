<template>
  <div style="width:100%; height:100%;overflow: hidden">
    <!--Blockly 支持node.js了，再见了Webview
    <webview id="editor_view" src="statics/editor.html" :style="show" nodeIntegration></webview>
    -->
    <div id="workarea" style="height: 100%"></div>
    <div id="workspace" style="position: absolute" class="text-text"></div>
    <!--Dialog-->
    <q-dialog v-model="confirm" persistent>
      <q-card class="bg-background" :dark="dark">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">{{confirm_text}}</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="取消" color="primary" v-close-popup @click="confirm_(false)" />
          <q-btn flat label="确认" color="primary" v-close-popup @click="confirm_(true)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 400px" class="bg-background" :dark="dark">
        <q-card-section>
          <div class="text-h6">{{prompt_text}}</div>
        </q-card-section>
        <q-card-section>
          <q-input :dark="dark" dense v-model="prompt_input" autofocus @keyup.enter="prompt_()" />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="取消" v-close-popup />
          <q-btn flat label="确认" v-close-popup @click="prompt_()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import projectManager from '../project/projectManager'
import * as Blockly from 'blockly/core'
import 'blockly/blocks'
import 'blockly/javascript'
import * as Zh from 'blockly/msg/zh-hans'
const fs = require('fs')
const parseString = require('xml2js').parseString
const xml2js = require('xml2js')
const { app } = require('electron').remote
const merge = require('deepmerge')
const vm = require('vm')

export default {
  name: 'BlocklyEditor',
  mounted () {
    this.$eventHub.$on('project-open', this.loadProject)
    this.$eventHub.$on('block-open', this.openBlock)
    this.$eventHub.$on('block-rename', this.renameBlock)
    this.$eventHub.$on('block-close', this.closeBlock)
    this.$eventHub.$on('block-save', this.saveBlock)
    this.$eventHub.$on('dark-change', this.changeDark)

    this.blocklyArea = document.getElementById('workarea')
    this.blocklyDiv = document.getElementById('workspace')
    Blockly.setLocale(Zh)
    this.workspace = Blockly.inject(this.blocklyDiv, {
      toolbox: '<xml><category></category></xml>',
      scrollbars: true,
      trashcan: true
    })
    console.log(this.workspace)
    const onresize = e => {
      // Compute the absolute coordinates and dimensions of blocklyArea.
      // const element = this.blocklyArea
      const x = 0
      const y = 0
      /*
      do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
      } while (element);
      */
      // Position blocklyDiv over blocklyArea.
      this.blocklyDiv.style.left = x + 'px'
      this.blocklyDiv.style.top = y + 'px'
      this.blocklyDiv.style.width = this.blocklyArea.offsetWidth + 'px'
      this.blocklyDiv.style.height = this.blocklyArea.offsetHeight + 'px'
      Blockly.svgResize(this.workspace)
    }
    window.addEventListener('resize', onresize, false)
    onresize()
    Blockly.svgResize(this.workspace)
    this.loadLibrary()
  },
  data () {
    return {
      dark: false,
      confirm: false,
      confirm_text: '',
      prompt: false,
      prompt_text: '',
      prompt_input: '',
      workspace: null,
      blocklyArea: null,
      blocklyDiv: null
    }
  },
  methods: {
    changeDark () {
      this.dark = this.$BlockCraft.dark
    },
    loadProject () {},
    openBlock (name) {
      if (
        !fs.existsSync(
          projectManager.getProjectPath() + '/blocks/' + name + '.block'
        )
      ) {
        this.$snotify.error(this.$t('tip.invaild_block'))
      }
      // NOTE：由于在loadProject下send存在bug,故暂时这么移到这里，并不会影响性能^-^
    },
    loadLibrary () {
      // eslint-disable-next-line no-unused-vars
      let blockScript = ''
      // 在'libraries'目录中寻找库
      const librariesDir = app.getPath('userData') + '/libraries/'
      const librariesDirs = []
      let toolboxTree = {}

      const files = fs.readdirSync(librariesDir)
      files.forEach(function (item, index) {
        const stat = fs.lstatSync(librariesDir + item)
        if (stat.isDirectory() === true) {
          librariesDirs.push(item)
          if (fs.existsSync(librariesDir + item + '/blocks.js')) {
            blockScript +=
              '\n' + fs.readFileSync(librariesDir + item + '/blocks.js')
          }
          if (fs.existsSync(librariesDir + item + '/toolbox.xml')) {
            const toolboxStr = fs.readFileSync(
              librariesDir + item + '/toolbox.xml'
            )
            if (toolboxStr != null && toolboxStr !== '') {
              let toolboxXmlObj
              parseString(toolboxStr, (err, data) => {
                if (err === null) {
                  toolboxXmlObj = data
                } else {
                  toolboxXmlObj = null
                }
              })
              if (toolboxXmlObj != null) {
                toolboxTree = merge(toolboxTree, toolboxXmlObj)
              }
            }
          }
        }
      })
      const sandbox = { Blockly: Blockly }
      vm.createContext(sandbox)
      vm.runInContext(blockScript, sandbox)

      const xmlStr = new xml2js.Builder({
        headless: true,
        renderOpts: { pretty: false }
      }).buildObject(toolboxTree)
      Blockly.updateToolbox(xmlStr)
    },
    renameBlock (name) {},
    closeBlock () {},
    saveBlock () {},
    rebuildBlock (name) {},
    confirm_ (res) {
      this.confirm = false
    },
    prompt_ () {
      if (this.prompt_input === '') {
        return
      }
      this.prompt = false
    }
  }
}
</script>

<style scoped>
#editor_view {
  width: 100%;
  height: 100%;
}
</style>
