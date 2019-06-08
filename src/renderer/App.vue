<template>
  <div id="app">
  <!--    <Appbar></Appbar>  -->
    <router-view style="height: 100%"></router-view>
  </div>
</template>

<script>

    import Appbar from "./components/Appbar";
  export default {
    name: 'crafteditor',
      components: {Appbar}
  }
</script>

<style>
  body,html,#app{
    height: 100%;
  }
  body,html{
    margin: 0 0 0 3px;
  }
  /* CSS */
</style>
