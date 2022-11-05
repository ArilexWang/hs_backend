<template>
  <div class="home-container">
    <div class="home-content">
      <el-table :data="newData" fit border style="margin-top: 10px">
        <el-table-column prop="price" label="充值金额" width="120">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.recharge"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="赠送金额" width="120">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.handsel"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              @click="handleAdd(scope.row)"
              size="mini"
              type="primary"
              icon="el-icon-circle-plus"
              >新增</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table
        :data="datas"
        :default-sort="{ prop: 'price' }"
        height="450"
        border
        style="margin-top: 10px"
      >
        <el-table-column prop="price" label="充值金额" width="120">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.recharge"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="赠送金额" width="120">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.handsel"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" size="mini"
              >保存</el-button
            >
            <el-button
              @click="handleDelete(scope.row)"
              size="mini"
              type="danger"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable semi */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
import { getDatas, updateInfo, deleteInfo, addInfo } from "@/api";

export default {
  name: "home",
  data() {
    return {
      datas: [],
      newData: [{}],
      collection: "cash",
    };
  },
  created() {
    getDatas(this.$data.collection).then((res) => {
      this.$data.datas = res.data;
    });
  },
  methods: {
    handleEdit(info) {
      this.$confirm("是否提交修改", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          info.recharge = parseInt(info.recharge);
          info.handsel = parseInt(info.handsel);
          updateInfo(info, this.$data.collection).then((res) => {
            console.log(res);
            if (res.updated == 1) {
              this.$message({
                type: "success",
                message: "已保存!请刷新页面",
              });
              getDatas(this.$data.collection).then((res) => {
                this.$data.datas = res.data;
              });
            } else {
              this.$message({
                type: "fail",
                message: "保存失败!",
              });
            }
          });
        })
        .catch((err) => {
          console.log(err);
          this.$router.go(0);
          this.$message({
            type: "info",
            message: "保存失败",
          });
        });
    },
    handleDelete(info) {
      this.$confirm("是否删除当前充值信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteInfo(info, "recharge").then(() => {
          this.$router.go(0);
        });
      });
    },
    handleAdd(info) {
      const that = this;
      console.log(info);
      addInfo(info, this.$data.collection).then((res) => {
        console.log(res);
        if (res.id) {
          this.$message({
            type: "success",
            message: "新增成功!",
          });
          that.$router.go(0);
        } else {
          this.$message({
            type: "info",
            message: "新增失败!",
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.home-container {
  padding: 10px;
  padding-top: 5px;
}
.home-content {
  padding: 10px;
  border-radius: 5px;
  background: #fff;
}
</style>