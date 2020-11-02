<template>
  <div class="matchparent">
    <el-form label-position="right" :model="elform.data" label-width="120px">
      <el-form-item  v-for="(row,i) in elform.rows" :key="i" :label="row.label" >
        <el-select v-model="elform.data.databaseEnum" v-if="row.type === 'select'">
          <el-option
            v-for="(item,i) in row.options"
            :key="item"
            :label="item"
            :value="item"
            >
          </el-option>
        </el-select>
        <el-input v-model="elform.data[row.name]" :disabled="row.disabled" v-if="!row.type"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "formCustom",
    props: ['elform'],
    data() {
      return {
        data:{},
      }
    },
    created() {
      this.data = this.elform.data;
    },

  }
</script>

<style scoped>

</style>
