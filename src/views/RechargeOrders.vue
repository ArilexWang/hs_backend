<template>
    <div class="home-container">
        <div class="home-content">
            <div>
                <el-row>
                    <el-col :span="8">
                        <el-input placeholder="请输入手机号进行搜索" v-model="filterParams.phoneNum" style="width: 200px"
                            clearable>
                        </el-input>
                    </el-col>
                    <el-col :span="12">
                        <span>购卡时间</span>
                        <el-date-picker v-model="filterParams.pickValue" type="daterange" align="right" unlink-panels
                            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                            :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="filterParams.status" placeholder="订单状态" clearable>
                            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="end" style="margin: 10px">
                    <el-col :span="4">
                        <el-button style="margin-left: 100px" @click="onClearClick" type="primary">清空筛选项</el-button>
                    </el-col>
                    <el-col :span="4">
                        <el-button style="margin-left: 100px" @click="onSearchClick" type="primary">搜索</el-button>
                    </el-col>
                    <el-col :span="4">
                        <el-button style="margin-left: 100px" @click="onExportClick" type="primary">导出</el-button>
                    </el-col>
                    <el-col :span="4">
                    </el-col>
                </el-row>
            </div>
            <el-dialog title="操作退款" :visible.sync="refundDialogFormVisible">
                <div>将订单标记为已退款，若用户剩余次数不足，则无法退款成功。使用余额支付的自动退还实际支付金额到账户余额，使用微信支付的请到微信支付后台操作退款</div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="refundDialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="onRefundConfirm">确 定</el-button>
                </div>
            </el-dialog>
            <el-table :data="datas" height="400" fit border style="">
                <el-table-column prop="createdFormat" label="下单时间" width="170"> </el-table-column>
                <el-table-column prop="name" label="散客卡" width="120"> </el-table-column>
                <el-table-column prop="payMsg" label="支付订单号" width="150"> </el-table-column>
                <el-table-column prop="statusFormat" label="订单状态" width="100"> </el-table-column>
                <el-table-column prop="price" label="订单金额" width="100"> </el-table-column>
                <el-table-column prop="actualPrice" label="实付金额" width="100"> </el-table-column>
                <el-table-column prop="costIntegral" label="使用积分" width="100"> </el-table-column>
                <el-table-column prop="member.phoneNum" label="用户联系方式" width="120"> </el-table-column>
                <el-table-column v-if="isAdmin" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status === 1" @click="onRefundClick(scope)" size="mini"
                            type="warning">退款
                        </el-button>
                        <div v-else>已退款</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="block">
            <el-pagination layout="prev, pager, next" :total="totalCount" :page-size="pageSize"
                @current-change="handleCurrentChange">
            </el-pagination>
        </div>
    </div>
</template>

<script>

import vue from "../main"
import { Message, Loading } from 'element-ui';
import dateFormat from "dateformat";
import XLSX from 'xlsx';

const db = vue.$app.database();
const COLLECTION = 'recharge_orders'
const PAGE_SIZE = 10
const MAX_LIMIT = 100
export default {
    name: "other",
    data() {
        return {
            isAdmin: false,
            totalCount: 0,
            currentPage: 1,
            pageSize: PAGE_SIZE,
            originDatas: [],
            datas: [],
            newData: {},
            search: "",
            dialogFormVisible: false,
            refundDialogFormVisible: false,
            new_order_phoneNum: '',
            new_order_member: {},
            new_order_date: '',
            new_order_period: {},
            statusOptions: [
                {
                    value: 0,
                    label: '未支付'
                },
                {
                    value: 1,
                    label: '已支付'
                },
                {
                    value: 2,
                    label: '已退款'
                },
            ],
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        start.setHours(0)
                        end.setHours(0)
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        start.setHours(0)
                        end.setHours(0)
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        start.setHours(0)
                        end.setHours(23)
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            filterParams: {
                phoneNum: '',
                pickValue: '',
                status: '',
            },
            newOrder: {
                start: 0,
                end: 0,
                needReferee: false,
                firstShoot: false,
                secondShoot: false,
                selectedCourts: [],
                price: 0,
                useIntegral: false,
                _openid: ''
            },

            courts: [],
            formLabelWidth: "120px",
            validPeriods: [],
            validCourts: [],

            refundIndex: '',
        };
    },
    async created() {

    },
    async mounted() {
        this.$data.isAdmin = vue.$user === 'admin'
        console.log(this.$data)
        let loadingInstance = Loading.service({ text: '加载中' });
        const datas = await this.filterDatas(1)
        this.$data.datas = await this.formatDatas(datas)
        loadingInstance.close()
    },
    methods: {
        async handleCurrentChange(val) {
            let loadingInstance = Loading.service({ text: '加载中' });
            const datas = await this.filterDatas(val)
            this.$data.datas = await this.formatDatas(datas)
            loadingInstance.close()
        },

        async formatDatas(datas) {
            for (let index = 0; index < datas.length; index++) {
                const item = datas[index];
                item.createdFormat = dateFormat(item.created, 'yyyy-mm-dd HH:MM:ss')
                item.payMsg = item.payBy === 1 ? '微信支付' : '余额支付'
                switch (item.status) {
                    case 0:
                        item.statusFormat = '未支付'
                        break;
                    case 1:
                        item.statusFormat = '已支付'
                        break
                    case 2:
                        item.statusFormat = '已退款'
                        break
                    default:
                        break;
                }
                item.orderDate = dateFormat(item.start, 'yyyy-mm-dd HH:MM') + ' - ' + dateFormat(item.end, 'HH:MM')
                const getMember = await db.collection('members').where({
                    _openid: item._openid
                }).get()
                item.member = getMember.data[0]
            }
            return datas
        },

        async pickeDate() {
            const numOfWeek = this.$data.new_order_date.getDay();
            const getPeriods = await db.collection('periods').where({
                day: numOfWeek
            }).get()
            const validPeriods = []
            for (let index = 0; index < getPeriods.data.length; index++) {
                const element = getPeriods.data[index];
                const res = await vue.$app.callFunction({
                    name: "generateCurrentPeriod",
                    data: {
                        period: element,
                        date: this.$data.new_order_date.getTime()
                    },
                })
                validPeriods.push(res.result)
            }
            validPeriods.map((item) => {
                item.format = dateFormat(item.start, 'HH:MM') + ' - ' + dateFormat(item.end, 'HH:MM')
                return item
            })
            this.$data.validPeriods = validPeriods
        },

        async onExportClick() {
            const selectedOptions = await this.generateFilterOptions()
            const countRes = await db.collection(COLLECTION).where(selectedOptions).count()
            const total = countRes.total
            const batchTimes = Math.ceil(total / MAX_LIMIT)
            // 承载所有读操作的 promise 的数组
            const tasks = []
            for (let i = 0; i < batchTimes; i++) {
                const promise = db.collection(COLLECTION).where(selectedOptions).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
                tasks.push(promise)
            }
            const res = (await Promise.all(tasks)).reduce((acc, cur) => {
                return {
                    data: acc.data.concat(cur.data),
                    errMsg: acc.errMsg
                }
            })
            console.log('导出数据', res)
            const formatData = await this.formatDatas(res.data)
            const sheetDatas = []
            formatData.forEach(item => {
                const { createdFormat, name, payMsg, statusFormat, price, actualPrice, costIntegral, } = item
                const sheetData = {
                    '下单时间': createdFormat,
                    '散客卡': name,
                    '支付订单号': payMsg,
                    '订单状态': statusFormat,
                    '订单金额': price,
                    '实付金额': actualPrice,
                    '使用积分': costIntegral,
                    '用户联系方式': item.member.phoneNum
                }
                sheetDatas.push(sheetData)
                return item
            })
            let wb = XLSX.utils.book_new()
            let sheet = XLSX.utils.json_to_sheet(sheetDatas)
            XLSX.utils.book_append_sheet(wb, sheet, '包场订单信息')
            // 创建工作薄blob
            XLSX.writeFile(wb, 'output.xlsx');
        },
        async generateFilterOptions() {
            const filter = this.$data.filterParams
            var member = {}
            const filterArr = []
            if (filter.phoneNum.length > 0) {
                const getMember = await db.collection('members').where({ phoneNum: filter.phoneNum }).get()
                if (getMember.data.length !== 1) {
                    console.log('未查询到该用户')
                    return {}
                }
                member = getMember.data[0]
            }
            if (filter.pickValue.length > 0) {
                const start = filter.pickValue[0].getTime()
                const end = filter.pickValue[1].getTime()
                filterArr.push({
                    created: db.command.gt(start).and(db.command.lt(end)),
                })
            }
            if (member._openid) {
                filterArr.push({
                    _openid: member._openid,
                })
            }
            if (typeof filter.status === 'number' && !isNaN(filter.status)) {
                filterArr.push({
                    status: filter.status,
                })
            }
            const selectedOptions = filterArr.length > 0 ? db.command.and(filterArr) : {}
            return selectedOptions
        },
        async filterDatas(currentPage) {
            const selectedOptions = await this.generateFilterOptions()
            console.log(selectedOptions)
            //count 
            const countRes = await db.collection(COLLECTION).where(selectedOptions).count()
            const total = countRes.total
            this.$data.totalCount = total
            const offset = (currentPage - 1) * PAGE_SIZE
            const res = await db.collection(COLLECTION).where(selectedOptions).skip(offset).limit(PAGE_SIZE).orderBy('created', 'desc').get()
            console.log("获取订单", res)
            return res.data
        },
        async onSearchClick() {
            let loadingInstance = Loading.service({ text: '加载中' });
            const datas = await this.filterDatas(1)
            this.$data.datas = await this.formatDatas(datas)
            loadingInstance.close()
        },
        onClearClick() {
            this.$data.filterParams = {
                phoneNum: '',
                pickValue: '',
                status: '',
            }
        },
        onRefundClick(e) {
            this.$data.refundIndex = e.$index
            this.$data.refundDialogFormVisible = true
        },
        async onRefundConfirm() {
            const order = this.datas[this.$data.refundIndex]
            const res = await vue.$app.callFunction({
                name: 'refundRechargeOrder',
                data: {
                    orderid: order._id
                }
            })
            if (res.result.errorMsg !== 'success') {
                Message.error(res.result.errorMsg)
                return
            }
            Message.success('退款成功')
            this.$data.refundDialogFormVisible = false
        }
    }
};
</script>

<style>

</style>
