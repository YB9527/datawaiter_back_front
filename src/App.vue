<template>
  <div id="app">

    <router-view />
  </div>
</template>

<script>
  import {systemApi} from '@/_datawaiter/api/datarequset.js';
  import SysURLManager from '@/_datawaiter/api/SysURLManager.js';
  import DatabaseConnURLManager from '@/_datawaiter/api/DatabaseConnURLManager.js';


export default {
  name: 'App',
  created(){
    this.$uiTool.setSelf(this);
    //设置共享数据
    this.setShareData();
  },
  methods:{
    setShareData(){
      systemApi({url: DatabaseConnURLManager.findDatabaseEnum()})
        .then(datas => {
          this.$store.state.share.databaseEnumArray = datas;
        });
      systemApi({url: SysURLManager.findEnums(this.$strTool.questmethodenumname)})
        .then(datas => {
          this.$store.state.share.questMethodArray = datas;
        });

      systemApi({url: SysURLManager.findEnums(this.$strTool.accessstate)})
        .then(datas => {
          this.$store.state.share.accessArray = datas;
          this.$store.state.share.accessMap = this.$tool.groupByAttributeSingle(datas);
        });

      systemApi({url: SysURLManager.findEnums(this.$strTool.crud)})
        .then(datas => {
          this.$store.state.share.crudArray = datas;
          this.$store.state.share.crudMap = this.$tool.groupByAttributeSingle(datas);
        });
      systemApi({url: SysURLManager.findEnums(this.$strTool.AutoCreateMapper)})
        .then(autoCreateMapperArray => {
          for (let autoCreateMapper of autoCreateMapperArray) {
            autoCreateMapper.checked = true;
            break;
          }
          this.$store.state.share.autoCreateMapperArray = autoCreateMapperArray;
          this.$store.state.share.autoCreateMapperMap = this.$tool.groupByAttributeSingle(autoCreateMapperArray);
        });
      systemApi({url: SysURLManager.findEnums(this.$strTool.PoRelation)})
        .then(datas => {

          this.$store.state.share.poRelationArray = datas;
          this.$store.state.share.poRelationMap = this.$tool.groupByAttributeSingle(datas);
        });
      systemApi({url: SysURLManager.findEnums(this.$strTool.MapperCreateEnum)})
        .then(datas => {
          this.$store.state.share.mapperCreateEnumArray = datas;

          this.$store.state.share.mapperCreateEnumMap = this.$tool.groupByAttributeSingle(datas);
        });
    },
  }
}
</script>
<style>
  .matchparent{
    height: 100%;

    width: 100%;
  }
  .a{

  }
  .el-select {
    width: 100%;
  }
</style>
