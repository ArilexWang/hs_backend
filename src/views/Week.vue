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
      <a-table :columns="columns" :data-source="datas" bordered>
        <template slot="originCourts" slot-scope="text, record, index">
          <a-checkbox-group :options="record.originCourts.map(myMap)" :disabled="!record.editable"
            :default-value="record.originCourts.map(mapValidCourts)" @change="(e) => checkboxChanged(e, record._id)" />
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <div class="editable-row-operations">
            <span v-if="record.editable">
              <a-popconfirm title="确认保存吗?" @confirm="() => save(record._id)">
                <a style="margin-left: 10px;">保存</a>
              </a-popconfirm>
              <a-popconfirm title="确认取消吗?" @confirm="() => cancel(record._id)">
                <a style="margin-left: 10px;">取消</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a :disabled="editingKey !== ''" @click="() => edit(record._id)">编辑</a>
            </span>
          </div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import vue from "../main"
import { getCollectionsWithParam, updateInfo } from "../api"
const db = vue.$app.database();

const columns = [
  {
    dataIndex: 'hour',
    key: 'hour',
    title: '时间段'
  },
  {
    title: '开放场地',
    dataIndex: 'originCourts',
    key: 'originCourts',
    scopedSlots: { customRender: 'originCourts' },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  },
];

export default {
  name: "week",
  data() {
    return {
      datas: [],
      columns,
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
      cacheDatas: [],
    };
  },
  async created() {
    // 获取场地配置
    const getCourts = await getCollectionsWithParam('courts', {})
    if (getCourts.data.length <= 0) return
    const originCourts = getCourts.data
    originCourts.sort((a, b) => { return a._id - b._id })
    originCourts.forEach(element => {
      element.valid = false
    });

    // // 获取时间段配置
    const getPeriods = await getCollectionsWithParam('periods', { day: this.$data.selectedValue })
    if (getPeriods.data.length <= 0) {
      return
    }
    const periods = getPeriods.data

    const newPeriods = periods.map((item) => {
      const hour = vue.$dateFormat(item.start, "HH:MM") + ' - ' + vue.$dateFormat(item.end, "HH:MM")
      item.hour = hour
      item.key = item._id
      item.courts.forEach(court => {
        originCourts.map((item) => {
          if (item._id == court) {
            item.valid = true
          }
        })
      });
      item.originCourts = originCourts
      return item
    })
    this.$data.datas = newPeriods
    this.$data.cacheDatas = this.$data.datas.map(item => ({ ...item }));
  },
  methods: {
    selectChanged(value) {
      console.log(value, this.$data.selectOptions[value]);
    },
    checkboxChanged(e, key) {
      const newData = [...this.$data.datas];
      const target = newData.find(item => key === item._id);
      if (target) {
        target.originCourts.map((item) => { item.valid = false })
        e.forEach(element => {
          const targetCourt = target.originCourts.find(item => element === item.name)
          targetCourt.valid = true
        });
        this.$data.datas = newData
      }
      // console.log(this.$data.datas)
    },
    edit(key) {
      const newData = [...this.$data.datas];
      const target = newData.find(item => key === item._id);
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.$data.datas = newData;
      }
    },
    async save(key) {
      const newData = [...this.$data.datas];
      const newCacheData = [...this.$data.cacheDatas];
      const target = newData.find(item => key === item._id);
      const targetCache = newCacheData.find(item => key === item._id);
      if (target && targetCache) {
        delete target.editable;
        this.$data.datas = newData;
        Object.assign(targetCache, target);
        this.$data.cacheDatas = newCacheData;

        const newPeriod = {}
        Object.assign(newPeriod, target)
        newPeriod.courts = []
        newPeriod.originCourts.forEach(element => {
          if (element.valid === true) {
            newPeriod.courts.push(element._id)
          }
        });
        delete newPeriod.key
        delete newPeriod.originCourts
        delete newPeriod._id
        delete newPeriod.hour
        console.log(newPeriod)
        const updateRes = await db.collection('periods').doc(key).update(newPeriod)
        console.log(updateRes)
        if (updateRes.updated === 1) {
          console.log("更新成功")
        } else if (updateRes.updated === 0) {
          console.log("数据无变化")
        } else {
          console.log("未知错误")
        }
      }
      this.editingKey = '';
    },
    cancel(key) {
      const newData = [...this.$data.datas];
      const target = newData.find(item => key === item._id);
      this.editingKey = '';
      if (target) {
        Object.assign(target, this.$data.cacheDatas.find(item => key === item._id));
        delete target.editable;
        this.$data.datas = newData;
      }
    },
    myMap(e) {
      return e.name
    },
    mapValidCourts(e) {
      if (e.valid) return e.name
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