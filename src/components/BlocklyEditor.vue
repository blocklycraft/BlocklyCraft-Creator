<template>
    <div style="display:flex; width:100%;height: 100%">
      <webview id="editor_view" src="statics/editor.html" style="display:inline-flex; width:100%; height:100%"></webview>
    </div>
</template>

<script>
    export default {
        name: "BlocklyEditor",
      mounted() {
        let webview = document.getElementById('editor_view');
        webview.addEventListener('dom-ready', () => {
          //webview.openDevTools()

        })
      },
      methods:{

      }
    }
</script>

<style scoped>

</style>
