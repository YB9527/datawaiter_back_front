<template>
  <div class="matchparent">
    <table-custom
      :datas="tableData"
      :columns="columns"
    ></table-custom>
    <drawer-custom :modeldialog="modeldialog" v-if="modeldialog.show"></drawer-custom>
    <dialog-custom :modeldialog="paramdialog" v-if="paramdialog.show"></dialog-custom>

    <el-dialog :title="preveiwDialog.title" :visible.sync="preveiwDialog.show" :width="preveiwDialog.width" >
      <table-custom :datas="preveiwDialog.datas" :columns="preveiwDialog.columns"></table-custom>
    </el-dialog>

  </div>
</template>

<script>
  import TableCustom from "../../components/tableCustom";
  import DialogCustom from "../../components/dialogCustom";
  import {systemApi} from '@/_datawaiter/api/datarequset.js';
  import SysURLManager from '@/_datawaiter/api/SysURLManager.js';
  import ApiURLManager from '@/_datawaiter/api/ApiURLManager.js'
  import LevelURLManager from '@/_datawaiter/api/LevelURLManager.js'
  import DrawerCustom from "../../components/drawerCustom";

  export default {
    name: "ApiManager",
    components: {DrawerCustom, DialogCustom, TableCustom},
    props: ["levelId"],
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
            label: "标签",
            prop: "label",
            isShow: true,
            align: "center"
          },
          {
            label: "数据库名称",
            prop: "databaseConnectId",
            isShow: true,
            align: "center",
            formatter: (value) => {
              let pool = this.poolMap[value];
              return pool ? pool.label : "";
            }
          },
          {
            label: "根URL",
            prop: "rootURL",
            isShow: true,
            align: "center"
          },
          {
            label: "本级URL",
            prop: "selfURL",
            isShow: true,
            align: "center"
          },
          {
            label: "访问控制",
            prop: "accessId",
            isShow: true,
            align: "center",
            formatter: (value) => {
              if (value) {
                let access = this.accessMap[value];
                return access ? access.label : "";
              } else {
                return "";
              }

            }
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
                label: "网页",
                type: "info",
                click: (index, row) => {
                  this.openURL(index, row);
                },
              },
              {
                label: "编辑",
                type: "warning",
                click: (index, row) => {
                  this.editApi(index, row);
                },
              },
              {
                label: "删除",
                type: "danger",
                click: (index, row) => {
                  this.deleteApi(index, row);
                },
              }
            ]
          },
        ],
        rootURL: "",
        level: {},
        poolArray: [],
        poolMap: {},
        questMethodArray: [],
        accessArray: [],
        accessMap: {},
        modeldialog: {
          show: false,
          width: '600px',
          titlepo: {add: "添加API", edit: "编辑API"},
          title: "",
          currenthandle: "",
          elform: {},
          okClickName: "modeldialogOk"
        },
        paramdialog: {
          show: false,
          width: '500px',
          titlepo: {add: "添加参数", edit: "编辑参数"},
          title: "",
          currenthandle: "",
          elform: {},
          okClickName: "paramDialogOk"
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
            label: "参数名字",
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
        preveiwDialog:{
          show: false,
          width: '80%',
          title: "预览数据",
          datas:[],
          columns:[],
        }
      }
    },
    created() {
      this.init();
    },
    watch: {
      levelId(node, oldValue) {
        this.init();
      }
    },
    methods: {
      previewingData(api) {
        let url = window.datawaiterip + "/datawaiter" + api.rootURL + "/" + api.selfURL;

        if (api.params && api.params.length > 0) {
          url = url + "?";
          for (let param of api.params) {
            url = url + param.paramName + "=" + param.testValue;
          }
          url = url.replace("[", "").replace("]", "");
        }
        systemApi({url:ApiURLManager.findDataByAPI(),data:api})
          .then(datas=>{
            if(!datas || datas.length <= 0){
              this.$uiTool.notify({message:"无数据",title:"预览数据"});
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
      /**
       * 打开网页
       * @param index
       * @param row
       */
      openURL(index, row) {

        let url = window.datawaiterip + "/datawaiter" + row.rootURL + "/" + row.selfURL;
        systemApi({url: ApiURLManager.findParamsByApiId() + row.id})
          .then(datas => {
            row.params = datas;
            if (row.params && row.params.length > 0) {
              url = url + "?";
              for (let param of row.params) {
                url = url + param.paramName + "=" + param.testValue;
              }
              url = url.replace("[", "").replace("]", "");
            }
            window.open(url, '_blank')
          });
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
      modeldialogOk(dialog) {

        let map = {api: dialog.elform.data, params: dialog.elform.data.params};

        dialog.show = false;
        systemApi({
          url: ApiURLManager.editApi(),
          method: 'post',
          data: dialog.elform.data,
        }).then(data => {
          if (dialog.currenthandle === this.$strTool.modelhandle[0]) {
            this.tableData.push(dialog.elform.data);
          } else if (dialog.currenthandle === this.$strTool.modelhandle[2]) {
            this.$tool.replaceModel(this.tableData, dialog.elform.data);
          }
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
      addApi() {
        let dialog = this.modeldialog;
        dialog.title = dialog.titlepo.add;
        dialog.elform.data = this.newApi();
        dialog.currenthandle = this.$strTool.modelhandle[0];
        dialog.elform.rows = this.newFormRows();

        dialog.show = true;
      },
      newFormRows() {

        return [
          {name: 'label', label: "api标签："},
          {name: 'rootURL', label: "根URL：", disabled: true},
          {name: 'selfURL', label: "本级URL："},
          {name: 'databaseConnectId', label: "数据库类型：", type: "select", options: this.poolArray,},
          {name: 'questMethod', label: "请求方式：", type: "select", options: this.questMethodArray},
          {name: 'accessId', label: "访问控制：", type: "select", options: this.accessArray},
          {name: 'sql_', label: "SQL语句："},
          {
            name: 'id',
            label: "",
            type: "table",
            tableData: this.modeldialog.elform.data.params,
            columns: this.paramTableColumns
          },
        ];
      },
      newApi() {
        let data = this.modeldialog.elform.data;
        let id = this.$uuid.v4();
        if (data) {
          data = JSON.parse(JSON.stringify(data));
          data.params = [];
          data.id = id;
          data.rootURL = this.rootURL;
          data.levelId = this.levelId;
        } else {
          data = {
            id: id,
            label: "",
            accessId: this.accessArray[0].id,
            params: [],
            rootURL: this.rootURL,
            levelId: this.levelId,
            databaseConnectId: this.poolArray[0].id,
            questMethod: this.questMethodArray[0],
            sql_: "",
          };
        }
        return data;
      },
      findRootURL(url, level) {
        if (level) {
          if (level.name) {
            url = "/" + level.name + url;
          }
          if (level.parent) {
            return this.findRootURL(url, level.parent);
          }
        }
        return url;
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
      editApi(index, row) {

        let dialog = this.modeldialog;
        dialog.elform.data = this.$tool.copyPo(row);
        systemApi({url: ApiURLManager.findParamsByApiId() + row.id})
          .then(datas => {

            dialog.elform.data.params = datas;
            if (!dialog.elform.data.params) {
              dialog.elform.data.params = [];
            }
            dialog.elform.rows = this.newFormRows();
            dialog.title = dialog.titlepo.edit;
            dialog.currenthandle = this.$strTool.modelhandle[2];
            dialog.show = true;
          });


      },
      deleteApi(index, row) {
        this.$uiTool.confirm({
          message: "确定要删除 '" + row.label + "' 吗？",
          callback: flag => {
            if (flag) {
              systemApi({url: SysURLManager.deleteByTableNameAndId(this.$strTool.apitablename, row.id)})
                .then(data => {
                  this.tableData.splice(index, 1);
                });
            }
          }
        });

      },
      init() {
        systemApi({url: ApiURLManager.findByLevelId() + this.levelId})
          .then(datas => {
            this.tableData = datas;
          });
        systemApi({url: LevelURLManager.findLevelAndParentId() + this.levelId})
          .then(level => {
            this.level = level;
            this.rootURL = this.findRootURL("", level);
          });

        systemApi({url: SysURLManager.findByTableName(this.$strTool.pooltablename)})
          .then(datas => {
            this.poolArray = datas;
            this.poolMap = this.$tool.groupByAttributeSingle(datas);
          });
        systemApi({url: SysURLManager.findEnums(this.$strTool.questmethodenumname)})
          .then(datas => {
            this.questMethodArray = datas;
          });
        systemApi({url: SysURLManager.findEnums(this.$strTool.accessstate)})
          .then(datas => {
            this.accessArray = datas;
            this.accessMap = this.$tool.groupByAttributeSingle(datas);

          });
      }
    }
  }
</script>

<style scoped>

</style>
