<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created(){
    this.$uiTool.setSelf(this);
  }
}
</script>
<style>
  .matchparent{
    height: 100%;
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
</style>
