<template>
    <div class="home-container">
        <div class="home-content">
            <el-date-picker v-model="value" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions"
                @change="onPick">
            </el-date-picker>
            <el-alert v-if="hasRepeatCourt" title="经检测有重复预定的场地，请检查并联系客户！" type="error"> </el-alert>
            <el-table height="550" :data="periods" fit border style="">
                <el-table-column prop="dateFormat" label="时间段" width="150"> </el-table-column>
                <el-table-column v-for="item in courts" :key="item._id" :label="item.name" :prop="item.name"
                    width="150">
                    <template slot-scope="scope">
                        <div>{{ scope.row[item.name] ? scope.row[item.name].member.phoneNum : '' }}</div>
                        <div v-if="scope.row[item.name] && scope.row[item.name].needReferee">需要裁判</div>
                        <div v-if="scope.row[item.name] && scope.row[item.name].firstShoot">前一小时投篮机</div>
                        <div v-if="scope.row[item.name] && scope.row[item.name].firstShoot">后一小时投篮机</div>

                        <!-- <div>{{scope.row.}}</div> -->
                        <!-- <div
                            v-if="scope.row.courtOrders[item._id] && scope.row.courtOrders[item._id].firstShoot && scope.row.courtOrders[item._id].secondShoot">
                            两小时投篮机</div>
                        <div v-if="scope.row.courtOrders[item._id] && scope.row.courtOrders[item._id].needReferee">需要裁判
                        </div> -->
                    </template>
                </el-table-column>
                <el-table-column prop="shoot" label="投篮机" width="150">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>

import vue from "../main.js";
import dateFormat from "dateformat";


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
        const currentDate = this.$data.value
        const getCourts = await db.collection('courts').where({
            _id: db.command.lt(7)
        }).get()
        const courts = getCourts.data
        this.$data.courts = courts
        this.getPeriod(currentDate)
    },
    async mounted() {
        console.log("mouted");
    },
    methods: {
        async onPick() {
            this.getPeriod(this.$data.value)
            this.$data.period = await this.getPeriod(this.$data.value);
        },
        async getPeriod(currentDate) {
            const getPeriod = await db.collection('periods').where({
                day: currentDate.getDay()
            }).get()
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
            for (let index = 0; index < periods.length; index++) {
                const item = periods[index];
                const getOrders = await db.collection('court_orders').where({
                    start: item.start
                }).get()
                console.log('item', item)
                if (getOrders.data.length === 0) {
                    continue
                }
                const orders = getOrders.data
                for (let index = 0; index < orders.length; index++) {
                    const element = orders[index];
                    console.log(element._openid)
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
                        console.log('selectedCourt', selectedCourt)
                        item[selectedCourt.name] = order
                    })
                })
            }
            console.log('periods', periods)
            this.$data.periods = periods
        }
    }
};
</script>
