<template>
    <q-page style="display:flex; width:100%;height: auto">
      <webview id="editor_view" src="statics/editor.html" style="display:inline-flex; width:100%; height:auto"></webview>
    </q-page>
</template>

<script>
    export default {
        name: "BlocklyEditor",
      mounted() {
        let webview = document.getElementById('editor_view');
        webview.addEventListener('dom-ready', () => {
          webview.openDevTools()
          webview.executeJavaScript("load()")
        })
      }
    }
</script>

<style scoped>

</style>
