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
                        <span>场地时间</span>
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
                        <el-button style="margin-left: 100px" @click="dialogFormVisible = true" type="primary">新建订单
                        </el-button>
                    </el-col>
                    <el-col :span="4">
                    </el-col>
                </el-row>
            </div>
            <el-dialog title="订单信息" :visible.sync="dialogFormVisible">
                <el-form :model="newOrder">
                    <el-form-item label="手机号码" :label-width="formLabelWidth">
                        <el-input v-model="new_order_phoneNum" autocomplete="off" style="width: 200px"></el-input>
                        <el-button style="margin-left: 10px" @click="newOrderSearchUser">查询余额</el-button>
                        <div>余额：{{ new_order_member.cash }}</div>
                    </el-form-item>

                    <el-form-item label="选择日期" :label-width="formLabelWidth">
                        <el-date-picker v-model="new_order_date" type="date" placeholder="选择日期" @change="pickeDate">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="选择时间段" :label-width="formLabelWidth">
                        <el-radio-group v-model="new_order_period" @change="onSelectedPeriod">
                            <el-radio v-for="period in validPeriods" :key="period.format" :label="period"
                                :name="period.format">{{
                                period.format
                                }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="选择场地" :label-width="formLabelWidth">
                        <el-checkbox-group v-model="newOrder.selectedCourts" @change="onSelectedCourts">
                            <el-checkbox v-for="court in validCourts" :key="court._id" :label="court"
                                :name="court.name">{{
                                court.name
                                }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="投篮机" :label-width="formLabelWidth">
                        <el-checkbox v-model="newOrder.firstShoot">前一小时</el-checkbox>
                        <el-checkbox v-model="newOrder.secondShoot">后一小时</el-checkbox>
                    </el-form-item>
                    <el-form-item label="总额" :label-width="formLabelWidth">
                        <el-input v-model="newOrder.price" :disabled="false" style="width:100px"></el-input>
                        <el-button style="margin-left: 10px" @click="onCalculateClick">计算价格</el-button>
                    </el-form-item>
                    <el-form-item label="裁判" :label-width="formLabelWidth">
                        <el-checkbox v-model="newOrder.needReferee">需要</el-checkbox>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelCreate">取 消</el-button>
                    <el-button type="primary" @click="createNewOrder">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="操作退款" :visible.sync="refundDialogFormVisible">
                <div>将订单标记为已退款。使用余额支付的自动退还实际支付金额到账户余额，使用微信支付的请到微信支付后台操作退款</div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="refundDialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="onRefundConfirm">确 定</el-button>
                </div>
            </el-dialog>
            <el-table :data="datas" height="400" fit border style="">
                <el-table-column prop="createdFormat" label="下单时间" width="170"> </el-table-column>
                <el-table-column prop="payMsg" label="支付订单号" width="150"> </el-table-column>
                <el-table-column prop="statusFormat" label="订单状态" width="100"> </el-table-column>
                <el-table-column prop="orderDate" label="场地时间" width="200"> </el-table-column>
                <el-table-column prop="courtsFormat" label="场地" width="120"> </el-table-column>
                <el-table-column prop="refereeFormat" label="裁判" width="80"> </el-table-column>
                <el-table-column prop="shootFormat" label="投篮机" width="120"> </el-table-column>
                <el-table-column prop="price" label="订单金额" width="100"> </el-table-column>
                <el-table-column prop="actualPrice" label="实付金额" width="100"> </el-table-column>
                <el-table-column prop="costIntegral" label="使用积分" width="100"> </el-table-column>
                <el-table-column prop="member.phoneNum" label="用户联系方式" width="120"> </el-table-column>
                <el-table-column v-if="isAdmin" label="操作" width="100">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status === 0">未支付</div>
                        <el-button v-if="scope.row.status === 1" @click="onRefundClick(scope)" size="mini"
                            type="warning">退款
                        </el-button>
                        <div v-if="scope.row.status === 2">已退款</div>
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
import {
    deleteInfo,
    getCollectionsWithParam,
} from "@/api";

import vue from "../main"
import { Message, Loading } from 'element-ui';
import dateFormat from "dateformat";
import XLSX from 'xlsx';

const db = vue.$app.database();
const COLLECTION = 'court_orders'
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
                item.courtsFormat = item.selectedCourts.map((item) => {
                    return item.name
                }).join(',')
                item.refereeFormat = item.needReferee ? '需要裁判' : ''
                if (item.firstShoot && item.secondShoot) {
                    item.shootFormat = '两小时投篮机'
                } else if (item.firstShoot) {
                    item.shootFormat = '前一小时投篮机'
                } else if (item.secondShoot) {
                    item.shootFormat = '后一小时投篮机'
                }
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
        onSelectedPeriod(value) {
            console.log(value)
            const validCourts = []
            value.courts.forEach(element => {
                if (element.status === 1) {
                    validCourts.push(element)
                }
            });
            this.$data.validCourts = validCourts
            this.$data.newOrder.start = value.start
            this.$data.newOrder.end = value.end
            this.$data.newOrder.middle = value.middle
        },
        onSelectedCourts(value) {
        },
        async onCalculateClick() {
            const res = await vue.$app.callFunction({
                name: 'calculateOrderPrice',
                data: this.$data.newOrder
            })
            console.log(res)
            this.$data.newOrder.price = res.result.price
        },
        cancelCreate() {
            this.$data.dialogFormVisible = false;
            this.$data.newOrder = this.defaultNewOrder();
        },
        async newOrderSearchUser() {
            const getMember = await db.collection('members').where({
                phoneNum: this.$data.new_order_phoneNum
            }).get()
            if (getMember.data.length !== 1) {
                this.$data.new_order_member = { cash: '查询余额失败' }
                return
            }
            const member = getMember.data[0]
            this.$data.new_order_member = member
            this.$data.newOrder._openid = member._openid
        },
        async createNewOrder() {
            const newOrder = this.$data.newOrder;
            if (this.$data.new_order_phoneNum.length == 0) {
                Message.error("请输入手机号")
                return;
            }
            if (!this.$data.new_order_period) {
                Message.error("请选择时间段")
                return;
            }
            if (newOrder.selectedCourts == 0) {
                Message.error("请选择场地")
                return;
            }
            const memberRes = await getCollectionsWithParam("members", { phoneNum: this.$data.new_order_phoneNum });
            if (memberRes.data.length == 0) {
                Message.error("未查询到对应用户，请重新输入手机号")
                return;
            }

            const member = memberRes.data[0];
            if (member.cash < newOrder.price) {
                Message.error("用户余额不足！")
                return;
            }
            newOrder._openid = member._openid
            if (isNaN(newOrder.price)) {
                Message.error("请输入合法金额")
                newOrder.price = 0
            } else {
                newOrder.price = Number(newOrder.price)
            }
            console.log(newOrder)
            const res = await vue.$app.callFunction({ name: 'createCourtOrder', data: { params: newOrder } })
            console.log(res)
            if (!res.result._id) {
                Message.error(res.result.errorMsg ? res.result.errorMsg : "新建订单失败")
                return
            }
            const order = res.result
            // 订单创建成功，确认订单
            const confirmRes = await vue.$app.callFunction({
                name: 'payByCash', data: {
                    orderid: order._id,
                    orderType: 0,
                    openid: order._openid
                }
            })
            console.log(confirmRes)
            if (confirmRes.result.errorMsg !== 'success') {
                Message.error(confirmRes.result.errorMsg)
                return
            }
            Message.success("创建订单成功")
        },
        defaultNewOrder() {
            return {
                start: 0,
                end: 0,
                needReferee: false,
                firstShoot: false,
                secondShoot: false,
                selectedCourts: [],
                price: 0,
                useIntegral: false,
                _openid: ''
            };
        },

        handleDelete(info) {
            this.$prompt("请输入密码", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputType: "new-password"
            })
                .then(({ value }) => {
                    if (value !== "947117") {
                        this.$message({
                            type: "error",
                            message: "密码错误"
                        });
                        return;
                    }
                    this.$confirm("删除当前订单信息前请确认是否完成退款操作", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            if (info.hasRefund) {
                                // 已退款
                                deleteInfo(info, this.$data.collection).then(() => {
                                    this.$message({
                                        type: "success",
                                        message: "已删除，即将刷新页面！"
                                    });
                                    setTimeout(() => {
                                        this.$router.go(0);
                                    }, 1000);
                                });
                            } else {
                                const promises = info.orderMsg.resourceIds.map(id => {
                                    const resource = { _id: id };
                                    return deleteInfo(resource, "resource");
                                });
                                Promise.all(promises).then(() => {
                                    deleteInfo(info, this.$data.collection).then(() => {
                                        this.$message({
                                            type: "success",
                                            message: "已删除，即将刷新页面！"
                                        });
                                        setTimeout(() => {
                                            this.$router.go(0);
                                        }, 1000);
                                    });
                                });
                            }
                        })
                        .catch(() => {
                            this.$message({
                                type: "info",
                                message: "操作取消"
                            });
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "操作取消"
                    });
                });
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
                const { createdFormat, payMsg, statusFormat, orderDate, courtsFormat, refereeFormat, shootFormat, price, actualPrice, costIntegral, } = item
                const sheetData = {
                    '下单时间': createdFormat,
                    '支付订单号': payMsg,
                    '订单状态': statusFormat,
                    '场地时间': orderDate,
                    '场地': courtsFormat,
                    '裁判': refereeFormat,
                    '投篮机': shootFormat,
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
                    start: db.command.gt(start),
                    end: db.command.lt(end)
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
                name: 'refundCourtOrder',
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
