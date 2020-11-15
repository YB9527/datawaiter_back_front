<template>
  <div class="matchparent" >

    <el-tabs tab-position="left" style="height: 100%;"  v-model="currentTableName">
      <el-tab-pane v-for="(table,i) in tables"  :name="table.name"
                    :label="table.name" :key="table.name">
        <beanManager   v-if="currentTableName === table.name" :databaseId="databaseId" :tableName="table.name"  ></beanManager>
      </el-tab-pane>
      <el-tab-pane label="返回" @click="goBack">返回</el-tab-pane>
    </el-tabs>

   <!-- -->
   <!-- <div class="left">
      <div>
        <el-row style="text-align: center">
          <el-button @click="addNode" v-show="modeldialog.currentnode" size="mini" type="info" plain>添加</el-button>
          <el-button @click="deleteNode" v-show="modeldialog.currentnode" size="mini" type="info" plain>删除</el-button>
        </el-row>
      </div>
      <div class="eltree">
        <el-tree
          :data="treedata"
          :highlight-current="true"
          node-key="id"
          @node-click="handleNodeClick"
          :default-expanded-keys="expandedkeys"
          :props="defaultProps">
        </el-tree>
      </div>
    </div>-->
    <!--<div class="right">
        <beanManager :levelId="levelId"  v-show="modeldialog.currentnode" ></beanManager>
    </div>-->

    <el-dialog  :title="modeldialog.title" :visible.sync="modeldialog.show" width="40%" >
      <formCustom :elform="modeldialog.elform"></formCustom>

      <div slot="footer" class="dialog-footer">
        <el-button @click="modeldialog.show = false">取 消</el-button>
        <el-button type="primary" @click="modeldialogOk(modeldialog)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { systemApi} from '@/_datawaiter/api/datarequset.js';
  import  ApiURLManager from  '@/_datawaiter/api/ApiURLManager.js'
  import  LevelURLManager from  '@/_datawaiter/api/LevelURLManager.js'
  import  DatabaseConnURLManager from  '@/_datawaiter/api/DatabaseConnURLManager.js'
  import FormCustom from "../../components/formCustom";
  import beanManager from "./mapperTable";

  export default {
    name: "sourceManager",
    components: {FormCustom,beanManager},
    data() {
      return {
        databaseId:"",
        tables:[],
        currentTableName:"",
        apidatas:[],
        modeldialog: {
          currentnode:undefined,
          show: false,
          title: "",
          isadd :true,
          elform: {},
        },

      };
    },
    watch:{
      'modeldialog.currentnode'(node,oldValue){
          if(node){
             this.levelId = node.id;
            systemApi({url :ApiURLManager.findByLevelId()+this.levelId})
              .then(datas => {
                let roots = this.findRoots(datas);
                let parentidMap = this.$tool.groupByAttribute(datas, "parentid");
                for (let root of roots) {
                  this.setChilds(root, parentidMap);
                }
              });
          }else{
            this.levelId = "";
            this.apidatas = [];
          }

      }
    },
    created() {
      this.databaseId =this.$route.query.databaseId;
      if(!this.databaseId){
        return;
      }
      systemApi({url:DatabaseConnURLManager.findTableAllByDatabaseId()+ this.databaseId})
        .then(tables=>{
            this.tables = tables;
           if(tables.length > 0){
             this.currentTableName = tables[0].name;
           }
        });

      /**
       * 找到api层级
       */
      /*systemApi({url:LevelURLManager.findBeanLevel()})
        .then(datas => {
           //this.$uiTool.loading({});
          let roots = this.findRoots(datas);
          let parentidMap = this.$tool.groupByAttribute(datas, "parentId");
          for (let root of roots) {
            this.setChilds(root, parentidMap);
          }
          this.treedata = roots;
          //this.$uiTool.closeLoading({});
        });*/
    },
    methods: {
      goBack(){
        console.log(1)
        this.$router.goBack();
      },
      modeldialogOk(modeldialog){
        let data = modeldialog.elform.data;
        if(modeldialog.isadd){
          if(modeldialog.currentnode){
            let childs =  modeldialog.currentnode.childs;
            if(!childs){
              childs= [];
              modeldialog.currentnode.childs = childs;
            }
            childs.push(data);
            data.parentId = modeldialog.currentnode.id;
          }else{
            this.treedata.push(data);
          }
          systemApi({
            url:LevelURLManager.addBeanLevel(),
            method:"post",
            data:data,
          });
          this.modeldialog.currentnode = undefined;
        }

        modeldialog.show = false;
      },
      addRoot() {

        let root = this.newLevelData();
        this.modeldialog.currentnode = undefined;
        this.modeldialog.title = "添加根节点";
        this.modeldialog.elform = {
          data:root,
          isadd :true,
          rows: this.newNodeFormRows(),
        };
        this.modeldialog.show = true;
      },
      newNodeFormRows(){
        return [
          {name: 'parentFullSimpleName', label: "父节点名字",disabled:true},
          {name: 'simpleName', label: "显示名称"},
          {name: 'des', label: "描述"},
        ];
      },
      newLevelData(parents){
        let id = this.$uuid.v4();
        let data = {
          parentFullSimpleName:"",
          id: id,
          simpleName: "",
          des: "",
          childs:[],
        };
        if(parents){
          for (let parent of parents){
            data.parentFullSimpleName = data.parentFullSimpleName+"/"+parent.simpleName;
          }
          data.parentFullSimpleName = data.parentFullSimpleName;
        }

        return data;
      },
      addNode() {
        let parents = this.findAllParent(this.treedata, this.modeldialog.currentnode.parentId);
        parents.push(this.modeldialog.currentnode);
        let root = this.newLevelData(parents);
        this.modeldialog.title = "添加子节点";
        this.modeldialog.elform = {
          data:root,
          isadd :true,
          rows: this.newNodeFormRows()
        };
        this.modeldialog.show = true;
      },
      findAllParent(datas, parentId){

        let parents = [];
        if(parentId){
          while (parentId){
            let parent = this.findParent(datas,parentId);
            if(parent){
              parents.unshift(parent);
              parentId = parent.parentId;
            }else{
              break;
            }
          }
        }

          return parents;

      },
      deleteNode() {
        let index;
        if(this.modeldialog.currentnode){
            this.$uiTool.confirm({
              message:"确定要删除："+this.modeldialog.currentnode.simpleName+" 吗？",
              callback:flag=>{
                if(flag){
                  let currentnode = this.modeldialog.currentnode;
                  let parent = this.findParent(this.treedata,currentnode.parentId);
                  if(parent){
                    index = parent.childs.findIndex(item=>{
                      return item === currentnode;
                    });
                    parent.childs.splice(index,1);
                  }else{
                    //如果没有就是根节点
                    index = this.treedata.findIndex(item=>{
                      return item === currentnode;
                    });
                    if(index !== undefined){
                      this.treedata.splice(index,1);
                    }
                  }
                  systemApi({url:LevelURLManager.deleteLevelById()+currentnode.id} );
                }
              }
            });
          }
      },
      findParent(treedata,parentId){
        for (let data of treedata){

          if(data.id === parentId){
            return data;
          }else {
            let parent =  this.findParent(data.childs,parentId);
            if(parent != null){
              return parent;
            }
          }
        }
      },
      setChilds(root, parentidMap) {
        if (root) {
          let id = root.id;
          let childs = parentidMap[id];
          if (childs) {
            root.childs = childs;
            for (let child of childs) {
              this.setChilds(child, parentidMap);
            }
          }else{
            root.childs = [];
          }
        }
      },
      /**
       * 查找所有的根节点
       * @param datas
       */
      findRoots(datas) {
        let roots = []
        for (let data of datas) {

          if (!data.parentId) {
            roots.push(data);
          }else{

          }
        }
        return roots;
      },

      handleNodeClick(data) {
        this.modeldialog.currentnode = data;


      },
    }
  }
</script>

<style scoped>
  .eltree {
    margin-top: 5px;
  }

  .left {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 20%;
    border: 1px solid grey;
  }

  .right {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 80%;
    border: 1px solid grey;
  }
</style>
