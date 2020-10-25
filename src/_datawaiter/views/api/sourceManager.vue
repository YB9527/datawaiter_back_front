<template>
  <div class="matchparent">
    <div class="left">
      <div>
        <el-row style="text-align: center">
          <el-button @click="addRoot" size="mini" type="info" plain>添加根</el-button>
          <el-button @click="addNode" size="mini" type="info" plain>添加</el-button>
          <el-button @click="deleteNode" size="mini" type="info" plain>删除</el-button>
        </el-row>
      </div>
      <div class="eltree">
        <el-tree
          :data="data"
          node-key="id"
          :default-expanded-keys="expandedkeys"
          :props="defaultProps">
        </el-tree>
      </div>
    </div>
    <div class="right">

    </div>
  </div>
</template>

<script>
  import {get} from '@/_datawaiter/api/datarequset.js';

  export default {
    name: "sourceManager",
    data() {
      return {
        expandedkeys:[1],
        data: [{
          id: 1,
          simpleName: '一级 1',
          children: [{
            id: 4,
            simpleName: '二级 1-1',
            children: [{
              id: 9,
              simpleName: '三级 1-1-1'
            }, {
              id: 10,
              simpleName: '三级 1-1-2'
            }]
          }]
        },],
        defaultProps: {
          children: 'children',
          label: 'simpleName'
        }
      };
    },
    methods: {
      addRoot(){

      },
      addNode(){

      },
      deleteNode(){

      },
      test() {
        get().then(data => {
          console.log(1111)
        });
      },
      handleNodeClick(data) {
        console.log(data);
      },
    }
  }
</script>

<style scoped>
  .eltree{
    margin-top: 5px;
  }
  .left {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 20%;
    border: 1px solid red;
  }

  .right {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 80%;
    border: 1px solid red;
  }
</style>
