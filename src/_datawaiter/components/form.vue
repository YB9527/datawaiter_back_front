<template>
    <div class="matchparent">
      <el-form label-position="labelPosition" :model="elform">
        <el-form-item label="活动名称"  >
          <el-input v-model="form.name" ></el-input>
        </el-form-item>
      </el-form>

    </div>
</template>

<script>
    export default {
        name: "form",
        props:['elform'],
        created(){
          let s = [
            {label:"名称",width:80,model:"form.name"}
          ]
        },

    }
</script>

<style scoped>

</style>
