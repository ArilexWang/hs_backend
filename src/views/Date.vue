<template>
    <div class="home-container">
        <div class="home-content">
            <el-date-picker v-model="value" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions"
                @change="onPick">
            </el-date-picker>
            <el-table height="550" :data="periods" fit border style="">
                <el-table-column prop="dateFormat" label="时间段" width="150"> </el-table-column>
                <el-table-column v-for="item in courts" :key="item._id" :label="item.name" :prop="item.name"
                    width="150">
                    <template slot-scope="scope">
                        <div>{{ scope.row[item.name] ? scope.row[item.name].member.phoneNum : '' }}</div>
                        <div v-if="scope.row[item.name] && scope.row[item.name].needReferee">需要裁判</div>
                        <div v-if="scope.row[item.name] && scope.row[item.name].firstShoot">前一小时投篮机</div>
                        <div v-if="scope.row[item.name] && scope.row[item.name].secondShoot">后一小时投篮机</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>

import vue from "../main.js";
import dateFormat from "dateformat";
import { Loading } from 'element-ui';

const db = vue.$app.database();
export default {
    name: "date",
    data() {
        return {
            pickerOptions: {
                // disabledDate(time) {
                //   return time.getTime() > Date.now();
                // },
            },
            value: new Date(new Date().toLocaleDateString()),
            periods: [],
            courts: [],
            hasRepeatCourt: false
        };
    },
    async created() {
        const getCourts = await db.collection('courts').where({
            _id: db.command.lt(7)
        }).get()
        if (!getCourts.data) {
            loadingInstance.close()
            return
        }
        const courts = getCourts.data
        this.$data.courts = courts
    },
    async mounted() {
        let loadingInstance = Loading.service({ text: '正在加载当日概况' });
        await this.getPeriod(this.$data.value)
        loadingInstance.close()
        console.log("mouted");
    },
    methods: {
        async onPick() {
            let loadingInstance = Loading.service({ text: '正在加载当日概况' });
            this.$data.period = await this.getPeriod(this.$data.value);
            loadingInstance.close()
        },
        async getPeriod(currentDate) {
            const getPeriod = await db.collection('periods').where({
                day: currentDate.getDay()
            }).get()
            if (getPeriod.data.length === 0) {
                return
            }
            const periods = []
            for (let index = 0; index < getPeriod.data.length; index++) {
                const element = getPeriod.data[index];
                const res = await vue.$app.callFunction({
                    name: "generateCurrentPeriod",
                    data: {
                        period: element,
                        date: currentDate.getTime()
                    },
                })
                const period = res.result
                period.dateFormat = dateFormat(period.start, 'HH:MM') + ' - ' + dateFormat(period.end, 'HH:MM')
                periods.push(period)
            }
            console.log(periods)
            for (let index = 0; index < periods.length; index++) {
                const item = periods[index];
                const orders = item.orders
                for (let index = 0; index < orders.length; index++) {
                    const element = orders[index];
                    const getMember = await db.collection('members').where({
                        _openid: element._openid
                    }).get()
                    if (getMember.data.length !== 1) {
                        console.log("获取用户信息失败")
                    }
                    element.member = getMember.data[0]
                }
                orders.forEach((order) => {
                    order.selectedCourts.forEach(selectedCourt => {
                        if (order.status === 1) {
                            item[selectedCourt.name] = order
                        }
                    })
                })
            }
            this.$data.periods = periods
        }
    }
};
</script>
