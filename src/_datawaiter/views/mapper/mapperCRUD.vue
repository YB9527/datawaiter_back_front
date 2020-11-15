<template>
  <div>
    <el-drawer
      :title="mapperdialog.title"
      :visible.sync="mapperdialog.show"
      direction="ltr"
      custom-class="demo-drawer"
      :size=mapperdialog.width
    >
      <div class="demo-drawer__content" style="padding-left: 20px;padding-right: 20px">
        <div class="form-group row">
          <label class=" col-form-label">表格：</label>
          <div class="col-sm-2">
            <input type="email" class="form-control" v-model="mapper.tableName" :disabled="true">
          </div>
          <label class="col-form-label">mapper标签：</label>
          <div class="col-sm-2">
            <input type="email" class="form-control" v-model="mapper.label">
          </div>
          <label class=" col-form-label">操作类型：</label>
          <div class="col-sm-1">
            <el-select v-model="mapper.crud" @input="onInput()">
              <el-option
                v-for="(item,i) in $store.state.share.crudArray"
                :key="i"
                :label="item.label"
                :value="item.id?item.id:item"
              >
              </el-option>
            </el-select>
          </div>
          <label class="col-form-label">SQL语句：</label>
          <div class="col-sm-5">
            <input type="textarea" class="form-control" v-model="mapper.sql_">
            <!-- <el-input type="textarea" v-model="mapper.sql_"></el-input>-->
          </div>

        </div>
        <!--<div class="form-group row">
          <label class="col-sm-1 col-form-label">mapper标签：</label>
          <div class="col-sm-2">
            <input type="email" class="form-control" v-model="mapper.label">
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-3 col-form-label">操作类型：</label>
          <div class="col-sm-9">
            <el-select v-model="mapper.crud" @input="onInput()">
              <el-option
                v-for="(item,i) in $store.state.share.crudArray"
                :key="i"
                :label="item.label"
                :value="item.id?item.id:item"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="form-group row" v-show="mapper.crud === 'SELECT'">
          <label class="col-sm-3 col-form-label">SQL语句：</label>
          <div class="col-sm-9">
              <input type="textarea" class="form-control" v-model="mapper.sql_">
           &lt;!&ndash; <el-input type="textarea" v-model="mapper.sql_"></el-input>&ndash;&gt;
          </div>
        </div>-->
 <!--       <el-row :gutter="20">
          <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
        </el-row>-->


        <div  class="grid-content bg-purple" style="padding-left: 20px">
          <h5 style="line-height: 40px"> 参数替换 、 字段映射 </h5>
        </div>
        <el-table
          :data="mapper.resultColumns"
          style="width: 100%">
          <el-table-column
            label='property'
          >
            <template slot-scope="scope">
              <input  class="form-control" v-model="scope.row.property" >
            </template>
          </el-table-column>

          <el-table-column
            label='对象关系'
          >
            <template slot-scope="scope">
              <el-select v-model="scope.row.poRelation" >
                <el-option
                  v-for="item in $store.state.share.poRelationArray"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>



          <el-table-column
            prop="mapperId"
            label='映射'
          >
            <template slot-scope="scope">
            <!--  <el-cascader  v-model="scope.row.column_MapperId" :props="props"   :options="tables">
              </el-cascader>-->
              <el-cascader
                placeholder="选择映射"
                v-if="scope.row.poRelation !== 'no'"
                v-model="scope.row.column_MapperId"
                :options="column_MapperIdOptions"
                ></el-cascader>
            </template>
          </el-table-column>

          <el-table-column
            label='映射对象字段'
          >
            <template slot-scope="scope">
              <input   class="form-control" v-model="scope.row.column_" v-if="scope.row.poRelation !== 'no'" >
            </template>
          </el-table-column>

          <el-table-column
            label='测试值'
          >
            <template slot-scope="scope">
              <input   class="form-control" v-model="scope.row.testValue" v-if="scope.row.poRelation === 'no'" >
            </template>
          </el-table-column>

          <el-table-column
            align="right"
          >
            <template slot="header" slot-scope="scope">
              <el-button type="info"  @click="addResultColumn" size="mini" plain>添加参数</el-button>
              <el-button type="info"   @click="previewingData(mapper)" v-if="mapper.crud === 'SELECT'"  size="mini" plain>预览</el-button>
              <el-button type="info"  v-if="mapper.crud !== 'SELECT'"  size="mini" plain>测试</el-button>
            </template>
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="removeResultColumn(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="demo-drawer__footer" style="float: right">
          <el-button @click="cancel" size="medium">取 消</el-button>
          <el-button type="primary" @click="ok" size="medium">确 定</el-button>
        </div>
      </div>
    </el-drawer>

    <el-dialog :title="preveiwDialog.title" :visible.sync="preveiwDialog.show" :width="preveiwDialog.width">
      <table-custom :datas="preveiwDialog.datas" :columns="preveiwDialog.columns"></table-custom>
    </el-dialog>

  </div>


</template>

<script>
  import FormCustom from "../../components/formCustom";
  import TableCustom from "../../components/tableCustom";
  import DialogCustom from "../../components/dialogCustom";
  import {systemApi} from '@/_datawaiter/api/datarequset.js';
  import ApiURLManager from '@/_datawaiter/api/ApiURLManager.js'
  import DatabaseConnURLManager from '@/_datawaiter/api/DatabaseConnURLManager.js'
  import MapperURLManager from '@/_datawaiter/api/MapperURLManager.js'

  export default {
    name: "mapperCRUD",
    components: {DialogCustom, TableCustom, FormCustom},
    props: {
      mapper: {},
      mapperdialog: {
        show: false,
        width: '',
        titlepo: {},
        title: "",
        currenthandle: "",
        data: "",
        okClickName: "",
      },
      paramTableShow: true,
    },

    data() {
      return {
        tables:[],
        id:1,
        column_MapperIdOptions:[],
        props: {
          lazy: true,
          label:"name",
          value:"id",
          lazyLoad: ((node, resolve) => {
            console.log(1)
            let tableName = node.label;
            let nodes= [];
            systemApi({url: MapperURLManager.findMappersByDatabaseIdAndTableName(this.mapper.databaseId, tableName)})
              .then(mappers => {
                for (let mapper of mappers){
                  nodes.push({id:mapper.id,name:mapper.label,leaf:1});
                }
                resolve(nodes);
              })
          })
        },
        preveiwDialog: {
          show: false,
          width: '80%',
          title: "预览数据",
          datas: [],
          columns: [],
        },


      };
    },
    created() {
      let databaseId = this.mapper.databaseId;

      systemApi({url:DatabaseConnURLManager.findTableAllByDatabaseId()+ databaseId})
        .then(tables=>{
          this.tables =[];
          for (let table of tables){
              this.column_MapperIdOptions.push({value:table.name,label:table.name,children:[]});
          }

          let  tableMap = this.$tool.groupByAttributeSingle(this.column_MapperIdOptions,"value");
          this.tables = tables;
          systemApi({url:MapperURLManager.findMappersByDatabaseId(databaseId)})
            .then(mappers=>{
                for (let mapper of mappers){
                  let tem =  tableMap[mapper.tableName];
                  tem.children.push({value:mapper.id,label:mapper.label});
                }
              if(this.mapper.resultColumns){
                for (let resultColumn of  this.mapper.resultColumns){
                  if(resultColumn.column_MapperId ){
                    for (let mapper of mappers){
                      if(mapper.id === resultColumn.column_MapperId){
                        resultColumn.column_MapperId= [mapper.tableName, resultColumn.column_MapperId];
                      }
                    }
                  }
                }
              }
            });
         // console.log(this.tables);
        });
    },


    methods: {
      addResultColumn(){
        this.mapper.resultColumns.push({id:this.$uuid.v4()});
      },
      questMethodChange() {
        switch (this.mapper.questMethod) {
          case "GET":
            this.mapper.crud = "SELECT";
            break;
          case "POST":
            this.mapper.crud = "INSERT";
            break;
        }

      },
      testPostApi(mapper){

        if (mapper.params && mapper.params.length > 0) {
          systemApi({url:ApiURLManager.testPostApi(),data:mapper })
            .then(count=>{
              this.$uiTool.messageBox({message:"执行成功的个数："+count});
            });
        }else{
          this.$uiTool.notify({message:"没有参数无法测试"})
        }

       /* let url = window.datawaiterip + "/datawaiter" + mapper.rootURL + "/" + mapper.selfURL;
        var formData = new FormData();
        if (mapper.params && mapper.params.length > 0) {
          for (let param of mapper.params) {
            formData.append(param.paramName ,param.testValue);
          }
          systemApi({url:url,data:formData })
            .then(count=>{
              this.$uiTool.messageBox({message:"执行成功的个数："+count});
            });
        }else{
          this.$uiTool.notify({message:"没有参数无法测试"})
        }*/

      },
      previewingData(mapper) {
         mapper = this.$tool.copyPo(mapper);
        for (let resultColumn of  mapper.resultColumns){
          if(resultColumn.column_MapperId){
            resultColumn.column_MapperId= resultColumn.column_MapperId[1];
          }
        }

        systemApi({url: MapperURLManager.mapperTest(), data: mapper})
          .then(datas => {
            if (!datas || datas.length <= 0) {
              this.$uiTool.notify({message: "无数据", title: "预览数据"});
              return;
            }
            let columns = [{
              type: "index",
              label: "序列号",
              width: "120",
              prop: "",
              isShow: true,
              align: "center"
            },];
            this.preveiwDialog.columns = columns;
            this.preveiwDialog.datas = datas;
            for (let columnname in datas[0]) {
              columns.push({
                label: columnname,
                prop: columnname,
                isShow: true,
                align: "center"
              });
            }
            this.preveiwDialog.show = true;
          });

      },
      removeResultColumn(index, row) {
        this.$uiTool.confirm({
          message: "确定要删除：" + row.property + " 参数吗？",
          callback: flag => {
            if (flag) {
              this.mapper.resultColumns.splice(index, 1);
            }
          }
        });
      },

      onInput() {
        this.$forceUpdate();
      },
      cancel() {
        this.mapperdialog.show = false;
        if (this.mapperdialog.cancelClickName) {
          this.$parent[this.mapperdialog.cancelClickName](this.mapperdialog);
        }
      },
      ok() {
        for (let resultColumn of  this.mapper.resultColumns){
           if(resultColumn.column_MapperId){
             resultColumn.column_MapperId= resultColumn.column_MapperId[1];
           }
        }

        if (this.mapperdialog.okClickName) {
          this.$parent[this.mapperdialog.okClickName](this.mapperdialog);
        }
      },

    }
  }
</script>

<style scoped>
  .col-form-label {
    text-align: left;
    vertical-align: middle;
    float: left;
    font-size: 12px;
    color: #8a8c8f;
  }
  \deep\ .el-drawer__header {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    color: #72767b;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin-bottom: 2px;
    padding: 20px 20px 0;
  }

  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
