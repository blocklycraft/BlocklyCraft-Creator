<template>
    <div>
        <el-container style="height:100%">
            <el-aside width="256px">
                <LeftSpace>
                </LeftSpace>
            </el-aside>
            <el-main><BlockEditor></BlockEditor></el-main>
        </el-container>
    </div>
</template>

<script>
    import LeftSpace from "./LeftSpace/LeftSpace";
    import BlockEditor from "./BlocklyEditor/BlockEditor";
    export default {
        name: "Home",
        components: {BlockEditor, LeftSpace},
        mounted() {
            if (process.env.NODE_ENV === 'development') {
                this.$notify({
                    title: '提示',
                    message: "当前正处于开发状态!",
                    type: 'warning'
                });
            }
        }
    }
</script>

<style scoped>

</style>