<template>
  <div class="home-container">
    <div class="home-content">
      <el-table :data="datas" fit border max-height="400">
        <el-table-column prop="name" label="名称" width="120">
        </el-table-column>
        <el-table-column prop="locked" label="价格" width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" size="mini">保存</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

import { getDatasByOrder, } from "@/api";
import vue from "../main"
export default {
  name: "home",
  data() {
    return {
      datas: [],
    };
  },
  created() {
    getDatasByOrder("courts", "_id", "asc").then((res) => {
      console.log(res);
      this.$data.datas = res.data;
    });
  },
  methods: {
    async handleEdit(info) {
      console.log(info)
      const key = info._id
      delete info._id
      info.price = parseInt(info.price)
      console.log(key, info)
      const res = await vue.$app.database().collection('courts').doc(key).update(info)
      if (res.updated === 1) {
        this.$message.success('更新成功');
      } else if (res.updated === 0) {
        this.$message.info('数据无变化');
      } else {
        console.log(res)
        this.$message.error('更新失败');
      }
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