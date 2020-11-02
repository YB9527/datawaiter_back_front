<template>
  <div class="matchparent">
    <table-custom
      :datas="tableData"
      :columns="columns"
    ></table-custom>
    <dialog-custom :modeldialog="modeldialog" v-if="modeldialog.show" @modeldialogOk="modeldialogOk"></dialog-custom>
  </div>
</template>

<script>
  import TableCustom from "../../components/tableCustom";
  import DialogCustom from "../../components/dialogCustom";
  import {systemApi} from '@/_datawaiter/api/datarequset.js';
  import SysURLManager from '@/_datawaiter/api/SysURLManager.js';

  export default {
    name: "ApiManager",
    components: {DialogCustom, TableCustom},
    props:[],
    data() {
      return {
        tableData: [],
        columns: [
          {
            type: "index",
            label: "序列号",
            width: "120",
            prop: "",
            isShow: true,
            align: "center"
          },
          {
            label: "数据库名称",
            width: "150",
            prop: "databaseConnectId",
            isShow: true,
            align: "center"
          },
          {
            label: "访问URL",
            width: "150",
            prop: "ip",
            isShow: true,
            align: "center"
          },
          {
            label: "访问控制",
            prop: "askManagerId",
            isShow: true,
            align: "center",
          },
          {
            label: "请求方式",
            width: "120",
            prop: "questMethod",
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
              label: "添加API",
              click: () => {
                this.addApi();
              },
            }],
            list: [
              {
                label: "查看",
                type: "info",
                click: (index, row) => {
                  this.lookConnection(index, row);
                },
              },
              {
                label: "编辑",
                type: "warning",
                click: (index, row) => {
                  this.editConnection(index, row);
                },
              },
              {
                label: "删除",
                type: "danger",
                click: (index, row) => {
                  this.deleteConnection(index, row);
                },
              }
            ]
          },
        ],
        poolArray:[],
        questMethodArray:[],
        modeldialog: {
          show: false,
          width : '500px',
          titlepo: {add: "添加API", edit: "编辑API"},
          title: "",
          currenthandle: "",
          elform: {},
          okClickName:"modeldialogOk"
        }
      }
    },
    created(){
      systemApi({url:SysURLManager.findByTableName(this.$strTool.pooltablename)})
        .then(datas=>{
          this.poolArray = datas;
        });
      systemApi({url:SysURLManager.findEnums(this.$strTool.questmethodenumname)})
        .then(datas=>{
          this.questMethodArray = datas;
        });
    },
    methods:{
      addApi(){
        let dialog = this.modeldialog;
        dialog.elform.rows = this.newFormRows();
        dialog.title = dialog.titlepo.add;
        dialog.elform.data = this.newPool();
        dialog.currenthandle = this.$strTool.modelhandle[0];
        dialog.show = true;
      },
      newFormRows() {
        return [
          {name: 'label', label: "api名称："},
          {name: 'ip', label: "访问URL："},
          {name: 'databaseConnectId', label: "数据库类型：", type: "select", options: this.poolArray},
          {name: 'questMethod', label: "请求方式：",type: "select", options: this.questMethodArray},
        ];
      },
      newPool() {
        let data = this.modeldialog.elform.data;
        let id = this.$uuid.v4();
        if(data){
          data = JSON.parse(JSON.stringify(data));
          data.id = id;
        }else{
          data = {
            id: id,
            label:"",
            ip: "",
            databaseConnectId: this.poolArray[0],
            questMethod: this.questMethodArray[0],
          };
        }
        return data;
      },
    }
  }
</script>

<style scoped>

</style>
