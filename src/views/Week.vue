<template>
  <div class="home-container">
    <div class="home-content">
      <el-row type="flex" align="middle">
        <el-col :span="8">
          <el-select v-model="selectedValue" placeholder="请选择" @change="selectChanged">
            <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <br>
      <el-table height="550" :data="periods" fit border style="">
        <el-table-column prop="dateFormat" label="时间段" width="150"> </el-table-column>
        <el-table-column label="开放场地" width="450">
          <template slot-scope="scope">
            <el-checkbox-group v-model="scope.row.validCourts" @change="checkBoxChanged">
              <el-checkbox v-for="court in scope.row.allCourts" :key="court._id" :label="court">
              </el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-popconfirm @confirm="handleUpdate(scope)" title="确定保存吗？">
              <el-button slot="reference" size="mini">保存</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script>
import vue from "../main"
var _ = require('lodash');
import dateFormat from "dateformat";
import { Message, Loading } from 'element-ui';

const db = vue.$app.database();

export default {
  name: "week",
  data() {
    return {
      datas: [],
      editingKey: '',
      newData: [{}],
      collection: "week",
      selectOptions: [
        { value: 0, label: "星期日" },
        { value: 1, label: "星期一" },
        { value: 2, label: "星期二" },
        { value: 3, label: "星期三" },
        { value: 4, label: "星期四" },
        { value: 5, label: "星期五" },
        { value: 6, label: "星期六" },
      ],
      selectedValue: 6,
      periods: [],
    };
  },
  async created() {


  },
  async mounted() {
    await this.generatePeriod()
  },
  methods: {
    async generatePeriod() {
      // 获取所有场地信息
      const getCourts = await db.collection('courts').where({ _id: db.command.lt(7) }).get()
      const originCourts = getCourts.data
      console.log('originCourts', originCourts)
      // 获取时间段信息
      const currentDay = this.$data.selectedValue
      const getPeriods = await db.collection('periods').where({
        day: currentDay
      }).get()
      console.log('getPeriods', getPeriods)
      // 组合时间段和场地
      const periods = getPeriods.data.map((item) => {
        // 关键，需要深拷贝
        const allCourts = _.cloneDeep(originCourts)
        item.allOriginCourts = allCourts
        item.dateFormat = dateFormat(item.start, 'HH:MM') + ' - ' + dateFormat(item.end, 'HH:MM')
        item.allCourts = allCourts.map((item) => {
          return item.name
        })
        const validCourts = []
        allCourts.forEach(court => {
          const target = item.courts.find(item => item === court._id)
          if (target !== undefined) {
            validCourts.push(court.name)
          }
        });
        item.validCourts = validCourts
        return item
      })
      console.log('periods', periods)
      this.$data.periods = periods
    },
    async selectChanged() {
      console.log(this.$data.selectedValue)
      let loadingInstance = Loading.service({ text: '加载中' });
      await this.generatePeriod()
      loadingInstance.close()
    },
    checkBoxChanged(value) {
      console.log(value)
    },
    async handleUpdate(value) {
      console.log(value)
      const period = value.row
      const validCourtIds = period.validCourts.map((item) => {
        const target = period.allOriginCourts.find(court => court.name === item)
        return target._id
      })
      console.log(validCourtIds)
      const updateRes = await db.collection('periods').doc(period._id).update({
        courts: validCourtIds
      })
      console.log(updateRes)
      if (updateRes.updated === 1) {
        Message.success('更新开放场地成功')
        return
      }
      if (updateRes.updated === 0) {
        Message.info('场地数据无变化')
        return
      }
      Message.error('更新开放场地失败')
    }
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