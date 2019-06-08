<template>
    <div style="width:100%; height:100%">
    <webview id="editor" src="static/index.html" style="display:inline-flex; width:100%; height:100%" nodeintegration></webview>
    </div>
</template>

<script>
    export default {
        name: "BlockEditor",
        mounted() {
            this.setHtml("<div>Test</div>");
            let webview = document.getElementById("editor");
            webview.addEventListener('console-message', e => {
                console.log('webview: ' + e.message);
            });
            webview.addEventListener('did-finish-load', () => {
                console.log("正在加载编辑器");
                webview.executeJavaScript('init()');
            });
        },
        data(){
            return {
                webview_url:"data:text/html, 加载中......"
            }
        },
        methods:{
          setHtml (html){
              this.webview_url="data:text/html, " + encodeURI(html)
          }
        }
    }
</script>

<style scoped>

</style>