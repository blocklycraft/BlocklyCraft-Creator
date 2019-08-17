<template>
  <div style="width:100%; height:100%;overflow: hidden" >
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
import projectManager from "../project/projectManager";
const fs = require("fs");
const parseString = require("xml2js").parseString;
const xml2js = require("xml2js");
const { app } = require("electron").remote;
const merge = require("deepmerge");
import * as Blockly from "blockly/core";
import "blockly/blocks";
import "blockly/javascript";
import * as Zh from "blockly/msg/zh-hans";

export default {
  name: "BlocklyEditor",
  mounted() {
    this.blocklyArea = document.getElementById("workarea");
    this.blocklyDiv = document.getElementById("workspace");
    Blockly.setLocale(Zh);
    this.workspace = Blockly.inject(this.blocklyDiv, {
      toolbox: "<xml><category></category></xml>",
      scrollbars: true,
      trashcan: true
    });
    console.log(this.workspace);
    let onresize = e => {
      // Compute the absolute coordinates and dimensions of blocklyArea.
      let element = this.blocklyArea;
      let x = 0;
      let y = 0;
      /*
      do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
      } while (element);
      */
      // Position blocklyDiv over blocklyArea.
      this.blocklyDiv.style.left = x + "px";
      this.blocklyDiv.style.top = y + "px";
      this.blocklyDiv.style.width = this.blocklyArea.offsetWidth + "px";
      this.blocklyDiv.style.height = this.blocklyArea.offsetHeight + "px";
      Blockly.svgResize(this.workspace);
    };
    window.addEventListener("resize", onresize, false);
    onresize();
    Blockly.svgResize(this.workspace);
    this.loadLibrary()

    this.$eventHub.$on("project-open", this.loadProject);
    this.$eventHub.$on("block-open", this.openBlock);
    this.$eventHub.$on("block-rename", this.renameBlock);
    this.$eventHub.$on("block-rebuild", this.rebuildBlock);
    this.$eventHub.$on("block-close", this.closeBlock);
    this.$eventHub.$on("block-save", this.saveBlock);
    this.$eventHub.$on("dark-change", this.changeDark(this.$BlockCraft.dark));
  },
  data() {
    return {
      dark: false,
      confirm: false,
      confirm_text: "",
      prompt: false,
      prompt_text: "",
      prompt_input: "",
      workspace: null,
      blocklyArea: null,
      blocklyDiv: null
    };
  },
  methods: {
    changeDark(dark) {
      this.dark = dark;
    },
    loadProject() {},
    openBlock(name) {
      if (
        !fs.existsSync(
          projectManager.getProjectPath() + "/blocks/" + name + ".block"
        )
      ) {
        this.$snotify.error(this.$t("tip.invaild_block"));
        return;
      }
      //NOTE：由于在loadProject下send存在bug,故暂时这么移到这里，并不会影响性能^-^
    },
    loadLibrary() {
      let blocks_script = "";
      //在'libraries'目录中寻找库
      let libraries_dir = app.getPath("userData") + "/libraries/";
      let libraries_dirs = [];
      let toolbox_tree = {};

      const files = fs.readdirSync(libraries_dir);
      files.forEach(function(item, index) {
        let stat = fs.lstatSync(libraries_dir + item);
        if (stat.isDirectory() === true) {
          libraries_dirs.push(item);
          if (fs.existsSync(libraries_dir + item + "/blocks.js")) {
            blocks_script +=
              "\n" + fs.readFileSync(libraries_dir + item + "/blocks.js");
          }
          if (fs.existsSync(libraries_dir + item + "/toolbox.xml")) {
            let toolbox_str = fs.readFileSync(
              libraries_dir + item + "/toolbox.xml"
            );
            if (toolbox_str != null && toolbox_str != "") {
              let toolbox_xml_obj;
              parseString(toolbox_str, (err, data) => {
                if (err == null) {
                  toolbox_xml_obj = data;
                } else {
                  toolbox_xml_obj = null;
                }
              });
              if (toolbox_xml_obj != null) {
                toolbox_tree = merge(toolbox_tree, toolbox_xml_obj);
              }
            }
          }
        }
      });

      let xml_str = new xml2js.Builder({
        headless: true,
        renderOpts: { pretty: false }
      }).buildObject(toolbox_tree);
      Blockly.updateToolbox(xml_str);
    },
    renameBlock(name) {},
    closeBlock() {},
    saveBlock() {},
    rebuildBlock(name) {},
    confirm_(res) {
      this.confirm = false;
    },
    prompt_() {
      if (this.prompt_input === "") {
        return;
      }
      this.prompt = false;
    }
  }
};
</script>

<style scoped>
#editor_view {
  width: 100%;
  height: 100%;
}
</style>
