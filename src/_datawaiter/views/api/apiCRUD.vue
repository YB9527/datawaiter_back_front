<template>
  <div>
    <el-drawer
      :append-to-body="true"
      :title="modeldialog.title"
      :visible.sync="modeldialog.show"
      direction="ltr"
      custom-class="demo-drawer"
      :size=modeldialog.width
    >
      <div class="demo-drawer__content" style="padding-left: 20px;padding-right: 20px">
        <div class="form-group row">
          <label class="col-sm-3 col-form-label">api标签：</label>
          <div class="col-sm-9">
            <input type="email" class="form-control" v-model="api.label">
          </div>
        </div>


        <div class="form-group row">
          <label class="col-sm-3 col-form-label">根URL：</label>
          <div class="col-sm-9">
            <input type="email" class="form-control" :disabled="true" v-model="api.rootURL">
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-3 col-form-label">本级URL：</label>
          <div class="col-sm-9">
            <input type="email" class="form-control" @change="setdatawaiterip" v-model="api.selfURL">
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-3 col-form-label">访问地址：</label>
          <div class="col-sm-9">
            <input type="email" class="form-control" :disabled="true"  v-model="datawaiterip">
          </div>
        </div>

        <div class="form-group row">
          <label class="col-sm-3 col-form-label">访问控制：</label>
          <div class="col-sm-9">
            <el-select v-model="api.accessId" @input="onInput()">
              <el-option
                v-for="(item,i) in $parent.accessArray"
                :key="i"
                :label="item.label"
                :value="item.id?item.id:item"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-3 col-form-label">数据库：</label>
          <div class="col-sm-9">
            <el-select v-model="api.databaseId" @input="onInput()">
              <el-option
                v-for="(item,i) in $parent.poolArray"
                :key="i"
                :label="item.label"
                :value="item.id?item.id:item"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-3 col-form-label">请求方式：</label>
          <div class="col-sm-9">
            <el-select v-model="api.questMethod" @change="questMethodChange" @input="onInput()">
              <el-option
                v-for="(item,i) in $parent.questMethodArray"
                :key="i"
                :label="item.label"
                :value="item.id?item.id:item"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-3 col-form-label">数据操作：</label>
          <div class="col-sm-9">
            <el-select v-model="api.crud" @input="onInput()">
              <el-option
                v-for="(item,i) in $parent.crudArray"
                :key="i"
                :label="item.label"
                :value="item.id?item.id:item"
                v-show="api.questMethod === 'GET' && item.id === 'SELECT' || (api.questMethod === 'POST' && item.id !== 'SELECT')"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-3 col-form-label">Mapper：</label>
          <div class="col-sm-9">

            <mapper-select  :dataCustom="{data:api,key:'mapperId'}"
                            :databaseId="api.databaseId"
                            :crudEnum="api.crud"></mapper-select>
            <el-button style="float: right" @click="lookMapper(api.mapperId)" type="info">查看</el-button>

          </div>
        </div>

      <!--  <div class="form-group row" v-show="api.questMethod === 'GET'">
          <label class="col-sm-3 col-form-label">SQL语句：</label>
          <div class="col-sm-9">
              <input type="textarea" class="form-control" v-model="api.sql_">
           &lt;!&ndash; <el-input type="textarea" v-model="api.sql_"></el-input>&ndash;&gt;
          </div>
        </div>
        <el-table
          :data="api.params"
          style="width: 100%">
          <el-table-column
            prop="paramName"
            :label='api.questMethod === "GET" ? "参数名字" : "表格名称"'
            >
          </el-table-column>
          <el-table-column
            prop="testValue"
            :label='api.questMethod === "GET" ? "测试值" : "JSON字符串"'
          >
          </el-table-column>
          <el-table-column
            align="right">
            <template slot="header" slot-scope="scope">
              <el-button type="info" @click="addParam()"  size="mini" plain>添加参数</el-button>
              <el-button type="info" @click="previewingData(api)" v-if="api.questMethod === 'GET'" size="mini" plain>预览</el-button>
              <el-button type="info" @click="testPostApi(api)" v-if="api.questMethod !== 'GET'" size="mini" plain>测试</el-button>
            </template>
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="editParam(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                @click="removeParam(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>-->

      <!--  <table class="table table-bordered">
          <thead>
          <tr>
            <th scope="col"  style="width: 100px">{{api.questMethod === "GET" ? "参数名字" : "表格名称"}}</th>
            <th scope="col"  style="width: 100px">{{api.questMethod === "GET" ? "测试值" : "JSON字符串"}}</th>
            <th scope="col" >
              <el-button type="info" @click="addParam()"  size="mini" plain>添加参数</el-button>
              <el-button type="info" @click="previewingData(api)" v-if="api.questMethod === 'GET'" size="mini" plain>预览</el-button>
              <el-button type="info" @click="testPostApi(api)" v-if="api.questMethod !== 'GET'" size="mini" plain>测试</el-button>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(param,i) in api.params">
            <td>{{ param.paramName}}</td>
            <td>{{ param.testValue}}</td>
            <th scope="col" >
              <el-button type="warning"  @click="editParam(i, param)" size="mini" plain>编辑</el-button>
              <el-button type="danger"   @click="removeParam(i, param)" size="mini" plain>删除</el-button>
            </th>
          </tr>
          </tbody>
        </table>-->

       <!-- <table-custom
          :datas="api.params"
          :columns="paramTableColumns">
        </table-custom>-->
         <!--<form-custom :elform="modeldialog.elform"></form-custom>-->
        <div class="demo-drawer__footer" style="float: right">
          <el-button @click="cancel" size="medium">取 消</el-button>
          <el-button type="primary" @click="ok" size="medium">确 定</el-button>
        </div>
      </div>
    </el-drawer>
    <dialog-custom :modeldialog="paramdialog" v-if="paramdialog.show"></dialog-custom>
    <el-dialog :title="preveiwDialog.title" :visible.sync="preveiwDialog.show" :width="preveiwDialog.width">
      <table-custom :datas="preveiwDialog.datas" :columns="preveiwDialog.columns"></table-custom>
    </el-dialog>

    <mapper-c-r-u-d :mapperdialog="mapperdialog" v-if="mapperdialog.show"
                    :mapper="mapperdialog.data"></mapper-c-r-u-d>
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
  import MapperSelect from "../mapper/mapperSelect";
  import MapperCRUD from "../mapper/mapperCRUD";
  export default {
    name: "apiCRUD",
    components: {MapperCRUD, MapperSelect, DialogCustom, TableCustom, FormCustom},
    props: {
      api: {},
      modeldialog: {
        show: false,
        width: '',
        titlepo: {},
        title: "",
        currenthandle: "",
        elform: "",
        okClickName: "",
      },
      paramTableShow: true,
    },
    data() {
      return {
        datawaiterip:'',

        preveiwDialog: {
          show: false,
          width: '80%',
          title: "预览数据",
          datas: [],
          columns: [],
        },
        paramTableColumns: [
          {
            type: "index",
            label: "序列号",
            width: "80",
            prop: "",
            isShow: true,
            align: "center"
          },
          {
            label: this.api.questMethod === "GET" ? "参数名字" : "表格名称",
            prop: "paramName",
            isShow: true,
            align: "center"
          },
          {
            label: "测试值",
            prop: "testValue",
            isShow: true,
            align: "center"
          },
          {
            type: "button",
            label: "操作",
            width: "300",
            prop: "",
            isShow: true,
            align: "center",
            headers: [{
              type: 'button',
              label: "添加参数",
              click: () => {
                this.addParam();
              },
            },
              {
                type: 'button',
                label: "预览",
                click: () => {
                  this.previewingData(this.modeldialog.elform.data);
                },
              }
            ],
            list: [
              {
                label: "编辑",
                type: "warning",
                click: (index, row) => {
                  this.editParam(index, row);
                },
              },
              {
                label: "删除",
                type: "danger",
                click: (index, row) => {
                  this.removeParam(index, row);

                },
              }
            ]
          },
        ],
        paramdialog: {
          show: false,
          width: '500px',
          titlepo: {add: "添加参数", edit: "编辑参数"},
          title: "",
          currenthandle: "",
          elform: {},
          okClickName: "paramDialogOk"
        },
        mapperdialog: {
          show: false,
          width: '100%',
          titlepo: {edit: "编辑Mapper"},
          title: "",
          currenthandle: "",
          data: {},
          okClickName:'mapperdialogOk'
        },
      };
    },
    created() {
      this.api = this.modeldialog.elform.data;
      this.setdatawaiterip();
    },
    watch:{
      'api.selfURL'(){
       this.setdatawaiterip();
      }
    },

    methods: {
      setdatawaiterip(){
        this.datawaiterip =   window.datawaiterip+'/'+'datawaiter'+this.api.rootURL+'/'+this.api.selfURL;
        //console.log(this.datawaiterip)
      },

      mapperdialogOk(dialog) {
        //console.log(111)
        let mapper = dialog.data;
        dialog.show = false;
        systemApi({
          url: MapperURLManager.editMapper(),
          data: mapper,
        }).then(count => {
          if (dialog.currenthandle === this.$strTool.modelhandle[0]) {
            this.tableData.push(mapper);
          } else if (dialog.currenthandle === this.$strTool.modelhandle[2]) {
            this.$tool.replaceModel(this.tableData,mapper);
          }
        });
      },
      lookMapper(mapperId){
        let dialog = this.mapperdialog;
        systemApi({url: MapperURLManager.findMapperById(mapperId)})
          .then(mapper => {
            dialog.data = mapper;
            dialog.title = dialog.titlepo.edit;
            dialog.currenthandle = this.$strTool.modelhandle[2];
            dialog.show = true;
          });
      },
      questMethodChange() {
        switch (this.api.questMethod) {
          case "GET":
            this.api.crud = "SELECT";
            break;
          case "POST":
            this.api.crud = "INSERT";
            break;
        }

      },
      testPostApi(api){

        if (api.params && api.params.length > 0) {
          systemApi({url:ApiURLManager.testPostApi(),data:api })
            .then(count=>{
              this.$uiTool.messageBox({message:"执行成功的个数："+count});
            });
        }else{
          this.$uiTool.notify({message:"没有参数无法测试"})
        }

       /* let url = window.datawaiterip + "/datawaiter" + api.rootURL + "/" + api.selfURL;
        var formData = new FormData();
        if (api.params && api.params.length > 0) {
          for (let param of api.params) {
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
      previewingData(api) {
        let url = window.datawaiterip + "/datawaiter" + api.rootURL + "/" + api.selfURL;
        if (api.params && api.params.length > 0) {
          url = url + "?";
          for (let param of api.params) {
            url = url + param.paramName + "=" + param.testValue;
          }
          url = url.replace("[", "").replace("]", "");
        }
        /* var formData = new FormData();
         formData.append("userArray",JSON.stringify([{id:"3",name:"YYYYYY",password:"bbb"},{id:"4",name:"DDDDD",password:"bbb"}]));
         systemApi({url:url,data:formData });
         return;*/
        systemApi({url: ApiURLManager.findDataByAPI(), data: api})
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
      addParam() {

        let dialog = this.paramdialog;
        dialog.title = dialog.titlepo.add;
        dialog.currenthandle = this.$strTool.modelhandle[0];

        dialog.elform.rows = [
          {name: 'paramName', label: "名称："},
          {name: 'testValue', label: "测试值："},
        ];
        dialog.elform.data = this.newParam();
        dialog.show = true;
      },
      newParam() {
        let data = this.paramdialog.elform.data;
        let id = this.$uuid.v4();
        if (data) {
          data = JSON.parse(JSON.stringify(data));
          data.id = id;
        } else {
          data = {
            id: id,
            apiId: this.modeldialog.elform.data.id,
            paramName: "",
            testValue: "",
          };
        }
        return data;
      },
      paramDialogOk(dialog) {

        let param = dialog.elform.data;
        let params = this.modeldialog.elform.data.params;
        if (dialog.currenthandle === this.$strTool.modelhandle[0]) {
          params.push(param);
        } else {
          console.log(33);
          this.$tool.replaceModel(params, param);
        }
        console.log(params);
        dialog.show = false;
      },
      editParam(index, row) {

        let dialog = this.paramdialog;
        dialog.title = dialog.titlepo.edit;
        dialog.currenthandle = this.$strTool.modelhandle[2];
        dialog.elform.rows = [
          {name: 'paramName', label: "名称："},
          {name: 'testValue', label: "测试值："},
        ];

        dialog.elform.data = this.$tool.copyPo(row);
        dialog.show = true;
      },
      removeParam(index, row) {
        this.$uiTool.confirm({
          message: "确定要删除：" + row.paramName + " 参数吗？",
          callback: flag => {
            if (flag) {
              console.log(11)
              this.modeldialog.elform.data.params.splice(index, 1);
              console.log(this.modeldialog.elform.data.params)
            }
          }
        });

      },

      onInput() {
        this.$forceUpdate();
      },
      cancel() {
        this.modeldialog.show = false;
        if (this.modeldialog.cancelClickName) {
          this.$parent[this.modeldialog.cancelClickName](this.modeldialog);
        }
      },
      ok() {

        if (this.modeldialog.okClickName) {
          this.$parent[this.modeldialog.okClickName](this.modeldialog);
        }
      },
    }
  }
</script>

<style scoped>
  .col-form-label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 12px;
    color: #8a8c8f;
  }


</style>
