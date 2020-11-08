<template>
  <div class="matchparent">
    <table-custom
      :datas="users"
      :columns="columns"
    ></table-custom>
  </div>
</template>

<script>
  import TableCustom from "../../components/tableCustom";
  import {systemApi} from '@/_datawaiter/api/datarequset.js';
  import SysURLManager from '@/_datawaiter/api/SysURLManager.js';
  import LevelURLManager from '@/_datawaiter/api/LevelURLManager.js'

  export default {
    name: "userManager",
    components: {TableCustom},
    data(){
      return {
        users: [],
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
            label: "账号",
            prop: "name",
            isShow: true,
            align: "center"
          },
          {
            label: "密码",
            prop: "password",
            isShow: true,
            align: "center",

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
              label: "添加人员",
              click: () => {
                this.addApi();
              },
            }],
            list: [
              {
                label: "编辑",
                type: "warning",
                click: (index, row) => {
                  this.editUser(index, row);
                },
              },
              {
                label: "删除",
                type: "danger",
                click: (index, row) => {
                  this.deleteUser(index, row);
                },
              }
            ]
          },
        ],
      }
    },
    created(){
      systemApi({url:SysURLManager.findByTableName("user")})
        .then(users=>{
          this.users = users;
        });
    },
    methods:{
      editApi(index, row) {

        let dialog = this.modeldialog;
        dialog.elform.data =   this.$tool.copyPo(row);
        systemApi({url:ApiURLManager.findParamsByApiId()+row.id})
          .then(datas=>{
            dialog.elform.data.params =datas;
            /* if(!row.params ){
                    row.params = [];
                  }*/
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
    }

  }
</script>

<style scoped>

</style>
