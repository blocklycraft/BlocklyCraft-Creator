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
let webview;
export default {
  name: "BlocklyEditor",
  mounted() {
    webview = document.getElementById("editor_view");
    webview.addEventListener("dom-ready", () => {
      webview.openDevTools();
    });
    webview.addEventListener("ipc-message", event => {
      if(event.channel=='load-error'){
          this.$snotify.error("未能打开此积木板，该积木板可能被删除或依赖不兼容。");
          return;
      }
      if(event.channel=='load-success'){
        this.$eventHub.$emit('load-success',event.args[0])
      }

    });
    this.$eventHub.$on("project-open", this.loadProject);
    this.$eventHub.$on("project-close", this.unloadProject);
    this.$eventHub.$on("open-block",this.openBlock)
  },
  data() {
    return {
      show: "display:none",
      dirty: false
    };
  },
  methods: {
    loadProject() {
      if (this.dirty) {
        webview.reload();
      }
      this.show = "";
      //Load project libraries.
      //由于info.json是属于bpm的，故在此并不对其信息进行验证
      //webview.executeJavaScript('console.log("脚本执行成功")');
      let blocks_script = "";
      //在'_libraries'目录中寻找库
      let libraries_dir = "./libraries/";
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
      webview.executeJavaScript("Workspace.updateToolbox('" + xml_str + "');");
    },
    unloadProject() {
      if (this.dirty) {
        webview.reload();
      }
      this.show = "display: none";
    },
    openBlock(name) {
      if (!fs.existsSync(projectManager.getProjectPath() + "/blocks/" + name)) {
        this.$snotify.error("未能打开积木板，他可能被强行删除了！");
        return;
      }
      webview.send("block-open", hash);
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
