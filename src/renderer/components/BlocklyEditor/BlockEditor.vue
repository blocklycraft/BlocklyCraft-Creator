<template>
    <div style="width:100%; height:100%">
    <webview src="static/index.html" style="display:inline-flex; width:100%; height:100%"></webview>
    </div>
</template>

<script>
    export default {
        name: "BlockEditor",
        mounted() {
            this.setHtml("<div>Test</div>");
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