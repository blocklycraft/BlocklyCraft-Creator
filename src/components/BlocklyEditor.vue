<template>
  <div style="width:100%; height:100%">
    <webview id="editor_view" src="statics/editor.html" :style="show" nodeIntegration></webview>
  </div>
</template>

<script>
import projectManager from "../project/projectManager";
const fs = require("fs");
const parseString = require("xml2js").parseString;
const xml2js = require("xml2js");
const { app } = require("electron").remote;
let webview;
export default {
  name: "BlocklyEditor",
  mounted() {
    webview = document.getElementById("editor_view");
    webview.addEventListener("dom-ready", () => {
      //仅在开发环境显示调试工具
      if (process.env.NODE_ENV != "production") {
        webview.openDevTools();
      }
      console.log("OK!");
    });
    webview.addEventListener("ipc-message", event => {
      if (event.channel == "load-error") {
        this.$snotify.error(this.$t("tip.invaild_block"));
        return;
      }
      if (event.channel == "load-success") {
        this.$eventHub.$emit("load-success", event.args[0]);
      }
    });
    this.$eventHub.$on("project-open", this.loadProject);
    this.$eventHub.$on("project-close", this.unloadProject);
    this.$eventHub.$on("block-open", this.openBlock);
    this.$eventHub.$on("block-rename", this.renameBlock);
    this.$eventHub.$on("block-close", this.closeBlock);
    this.$eventHub.$on("block-save", this.saveBlock);
  },
  data() {
    return {
      show: "display:none",
      dirty: false
    };
  },
  methods: {
    loadProject() {
      this.show = "";
      //Load project libraries.
      //由于info.json是属于bpm的，故在此并不对其信息进行验证
      //webview.executeJavaScript('console.log("脚本执行成功")');
      let blocks_script = "";
      //在'libraries'目录中寻找库
      let libraries_dir = app.getPath("userData") + "/libraries/";
      let libraries_dirs = [];
      const toolbox_tree = {};

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
                //console.dir(toolbox_xml_obj);
                //直接合并，应该不会出现问题(敷衍)
                Object.assign(toolbox_tree, toolbox_xml_obj);
              }
            }
          }
        }
      });

      this.dirty = true;
      webview.send("open-project", projectManager.getProjectPath());
      webview.executeJavaScript(blocks_script);
      let xml_str = new xml2js.Builder({
        headless: true,
        renderOpts: { pretty: false }
      }).buildObject(toolbox_tree);
      webview.executeJavaScript("workspace.updateToolbox('" + xml_str + "');");
    },
    unloadProject() {
      if (this.dirty) {
        console.log("UNLOAD PROEJCT");
        webview.reload();
      }
      this.show = "display: none";
    },
    openBlock(name) {
      if (
        !fs.existsSync(
          projectManager.getProjectPath() + "/blocks/" + name + ".block"
        )
      ) {
        this.$snotify.error(this.$t("tip.invaild_block"));
        return;
      }
      webview.send("block-open", name);
    },
    renameBlock(name) {
      webview.send("block-rename", name);
    },
    closeBlock() {
      webview.send("block-close");
    },
    saveBlock() {
      webview.executeJavaScript("saveBlock()");
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
