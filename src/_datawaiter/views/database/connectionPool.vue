<template>
  <div>
    <el-button @click="addTestData">添加测试数据</el-button>
   <!-- <el-button type="warning" @click="testConn">测试事务</el-button>-->
    <TableCustom
      :datas="tableData"
      :columns="columns"
    ></TableCustom>
    <dialog-custom :modeldialog="modeldialog" v-if="modeldialog.show"></dialog-custom>
    <!-- <el-dialog :title="modeldialog.title" :visible.sync="modeldialog.show" v-if="modeldialog.show" width="500px">
       <formCustom :elform="modeldialog.elform"></formCustom>
       <div slot="footer" class="dialog-footer">
         <el-button @click="modeldialog.show = false">取 消</el-button>
         <el-button type="primary" @click="modeldialogOk(modeldialog)">确 定</el-button>
       </div>
     </el-dialog>-->
  </div>


</template>

<script>
  import TableCustom from "../../components/tableCustom";
  import formCustom from "@/_datawaiter/components/formCustom.vue";
  import {systemApi} from '@/_datawaiter/api/datarequset.js';
  import DatabaseConnURLManager from '@/_datawaiter/api/DatabaseConnURLManager.js';
  import SysURLManager from '@/_datawaiter/api/SysURLManager.js';
  import DialogCustom from "../../components/dialogCustom";

  export default {
    components: {DialogCustom, TableCustom, formCustom},
    data() {
      return {
        databaseEnumArray: [],
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
            label: "名称",
            width: "150",
            prop: "label",
            isShow: true,
            align: "center"
          },
          {
            label: "IP地址",
            width: "150",
            prop: "ip",
            isShow: true,
            align: "center"
          },
          {
            label: "数据库类型",
            prop: "databaseEnum",
            isShow: true,
            align: "center",
          },

          {
            label: "数据库名称",
            width: "120",
            prop: "databaseName",
            isShow: true,
            align: "center"
          },
          {
            label: "账号",
            width: "120",
            prop: "username",
            isShow: true,
            align: "center"
          },
          {
            label: "密码",
            width: "120",
            prop: "password",
            isShow: true,
            align: "center"
          },
          {
            label: "API数量",
            width: "120",
            prop: "apiCount",
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
              label: "添加连接",
              click: () => {
                this.addConnection();
              },
            }],
            list: [
              /*{
                label: "查看",
                type: "info",
                click: (index, row) => {
                  this.lookConnection(index, row);
                },
              },*/
              {
                label: "装备Bean",
                type: "info",
                click: (index, row) => {
                  this.$router.push({path: '/mapperconfig/index?databaseId=' + row.id});
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
        modeldialog: {
          show: false,
          width: '500px',
          titlepo: {add: "添加连接池", edit: "编辑连接池", look: "查看连接池"},
          title: "",
          currenthandle: "",
          elform: {},
          okClickName: "modeldialogOk"
        }
      }
    },
    created() {
      //所有数据库类型
      this.databaseEnumArray = this.$store.state.share.databaseEnumArray;
      /* systemApi({url: DatabaseConnURLManager.findDatabaseEnum()})
         .then(datas => {
           this.databaseEnumArray = datas;
         });*/
      systemApi({url: DatabaseConnURLManager.findAll()})
        .then(datas => {
          this.tableData = datas;
        });

    },
    methods: {
      /*添加测试数据*/
      addTestData(){
        console.log(this.$store.state.xzq.xzqAll);
        let  xzqys = this.$store.state.xzq.xzqAll;
        let dcsj = [2013,2014,2015,2016,2017,2018];
        let lx=[[11,12,13,14,15,16,17,18],[21,22,23,24,25,29],[99]];
        let datas = [];
        for (let i = 0; i < 2000; i++) {
          let data = {
            xzqdm: xzqys[parseInt( Math.random()*xzqys.length)].xzqdm,
            dcsj:dcsj[parseInt( Math.random()*dcsj.length)],
            mbzwlx:"",
            mbzwlxmj:"",
            mbzwlxmjm:"",
            fmbzwlx:"",
            fmbzwlxmj:"",
            fmbzwlxmjm:"",
            qtlx:"",
            qtlxmj:"",
            qtlxmjm:"",
            id:i,
            dks:500 + parseInt( Math.random()*10000),
          };
          datas.push(data);
          switch(i % 6){
            case 0:
            case 1:
            case 2:
              data.mbzwlx=lx[0][parseInt(Math.random()*lx[0].length)];
              data.mbzwlxmj=  Math.random()*58898136.18;
              data.mbzwlxmjm= data.mbzwlxmj *0.0015;
              break;
            case 3:
            case 4:
              data.fmbzwlx=lx[1][parseInt( Math.random()*lx[1].length)];
              data.fmbzwlxmj=  Math.random()*58898136.18;
              data.fmbzwlxmjm= data.fmbzwlxmj *0.0015;
              break;
            case 5:
              data.qtlx=lx[2][parseInt(Math.random()*lx[2].length)];
              data.qtlxmj=  Math.random()*58898136.18;
              data.qtlxmjm= data.fmbzwlxmj *0.0015;
              break;
          }

        }
        let formdata = new FormData();
        formdata.append("tj_lqdkzzqk",JSON.stringify(datas));
        systemApi({url:"http://127.0.0.1:3333/datawaiter/slq/jg/saveTJ_LQDKZZQK",data:formdata})
          .then(data=>{
            console.log(data);
          })
     /*   axios({
          url:"http://127.0.0.1:3333/datawaiter/slq/jg/saveTJ_LQDKZZQK",
          data:formdata,
        }).then(data=>{
          console.log(data);
        });*/
      },
      testConn() {

       /* systemApi({url: 'http://127.0.0.1:3333/datawaiter/root/finduser'})
          .then(users => {
            systemApi({url: 'http://127.0.0.1:3333/datawaiter/root/findJTCY'})
              .then(jtcys => {
                users[0].jtcys = jtcys;
                console.log(users);
                let formData = new FormData;
                formData.append("users", JSON.stringify(users));
                systemApi({url: 'http://127.0.0.1:3333/datawaiter/root/deleteUserAll', data: formData})
                  .then(count => {
                    console.log("删除了：" + count);
                  });
              })
          });
*/
        let users = [];
        for (let i = 0; i < 9527; i++) {
          let user = {
            id: this.$uuid.v4(),
            name: 'AAA' + i,
            password: 'bb' + i,
            t: i,
            jtcy: [],
          };
         /* for (let j = 0; j < 5; j++) {
            let jtcy = {
              id: this.$uuid.v4(),
              name: 'JTCY' + i,
            };
            user.jtcy.push(jtcy);
           // break
          }*/
          users.push(user);
         // break;
        }
        let formData = new FormData;
        formData.append("user", JSON.stringify(users));
        systemApi({url: 'http://127.0.0.1:3333/datawaiter/test/jtcy/saveUser', data: formData})
          .then(count => {
            console.log("保存了：" + count);
          });
      },
      modeldialogOk(modeldialog) {

        switch (modeldialog.currenthandle) {
          case this.$strTool.modelhandle[0]:
            systemApi({url: DatabaseConnURLManager.addConnection(), method: "post", data: modeldialog.elform.data})
              .then(data => {
                this.tableData.push(modeldialog.elform.data);
                modeldialog.show = false;
              });
            break;
          case this.$strTool.modelhandle[1]:
            break;
          case this.$strTool.modelhandle[2]:
            systemApi({url: DatabaseConnURLManager.editConnection(), method: "post", data: modeldialog.elform.data})
              .then(data => {
                this.$tool.replaceModel(this.tableData, modeldialog.elform.data);
                modeldialog.show = false;
              });
            break;
          case this.$strTool.modelhandle[3]:
            break;
        }
      },
      newFormRows() {
        return [
          {name: 'label', label: "名称："},
          {name: 'ip', label: "IP地址："},
          {name: 'databaseEnum', label: "数据库类型：", type: "select", options: this.databaseEnumArray},
          {name: 'databaseName', label: "数据库名称："},
          {name: 'username', label: "账号："},
          {name: 'password', label: "密码："},
        ];
      },
      newPool() {
        let id = this.$uuid.v4();
        let data = {
          id: id,
          label: "",
          ip: "127.0.0.1:3306",
          databaseEnum: this.databaseEnumArray[0],
          databaseName: "",
          username: "",
          password: "",
        };
        return data;
      },
      addConnection() {
        let dialog = this.modeldialog;
        dialog.elform.rows = this.newFormRows();
        dialog.title = dialog.titlepo.add;
        dialog.elform.data = this.newPool();
        dialog.currenthandle = this.$strTool.modelhandle[0];
        dialog.show = true;
      },
      editConnection(index, row) {
        let dialog = this.modeldialog;
        dialog.elform.rows = this.newFormRows();
        dialog.title = dialog.titlepo.edit;
        dialog.elform.data = row;
        dialog.currenthandle = this.$strTool.modelhandle[2];
        dialog.show = true;
      },
      deleteConnection(index, row) {
        this.$uiTool.confirm({
          message: "确定要删除" + row.label + "吗？",
          callback: flag => {
            if (flag) {
              systemApi({url: SysURLManager.deleteByTableNameAndId(this.$strTool.pooltablename, row.id)})
                .then(data => {
                  this.tableData.splice(index, 1);
                });
            }
          }
        });

      },
      lookConnection(index, row) {
        console.log(index, row);
      }
    },
  }
</script>

<style scoped>

</style>
