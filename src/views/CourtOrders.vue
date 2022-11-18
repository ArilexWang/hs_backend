<template>
    <div class="home-container">
        <div class="home-content">
            <el-input placeholder="请输入手机号进行搜索" v-model="search" style="width: 300px" clearable @clear="clearClick">
                <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
            </el-input>
            <el-button style="margin-left: 100px" @click="dialogFormVisible = true" type="primary">新建订单</el-button>

            <el-dialog title="订单信息" :visible.sync="dialogFormVisible">
                <el-form :model="newOrder">
                    <el-form-item label="手机号码" :label-width="formLabelWidth">
                        <el-input v-model="newOrder.phoneNum" autocomplete="off" style="width: 200px"></el-input>
                        <el-button style="margin-left: 10px" @click="newOrderSearchUser">查询余额</el-button>
                        <div>余额：{{ new_order_member.cash }}</div>
                    </el-form-item>

                    <el-form-item label="选择日期" :label-width="formLabelWidth">
                        <el-date-picker v-model="new_order_date" type="date" placeholder="选择日期" @change="pickeDate">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="选择时间段" :label-width="formLabelWidth">
                        <el-radio-group v-model="new_order_period" @change="selectedPeriod">
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

            <el-table :data="orders" height="250" fit border style="">
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
                <!-- <el-table-column prop="hasRefundFormat" label="退款" width="120"> </el-table-column> -->
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button @click="handleDelete(scope.row)" size="mini" type="danger">删除</el-button>
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
import { Message } from 'element-ui';
import dateFormat from "dateformat";

const db = vue.$app.database();
const COLLECTION = 'court_orders'
const PAGE_SIZE = 20
export default {
    name: "other",
    data() {
        return {
            totalCount: 0,
            currentPage: 1,
            pageSize: PAGE_SIZE,
            originDatas: [],
            orders: [],
            newData: {},
            search: "",
            dialogFormVisible: false,
            new_order_member: {},
            new_order_date: '',
            new_order_period: {},
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
            week: [],
            validPeriods: [],
            validCourts: [],
        };
    },
    async created() {
        // getDatasByOrder("courts", "_id", "asc").then(res => {
        //     this.$data.courts = res.data;
        // });
        // const getOrders = await db.collection('court_orders').
        const countResult = await db.collection(COLLECTION).count()
        const total = countResult.total
        this.$data.totalCount = total
        var orders = await this.getCurrenPageCollections(this.$data.currentPage)
        console.log(orders)
        for (let index = 0; index < orders.length; index++) {
            const item = orders[index];
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
        this.$data.orders = orders
    },
    mounted() {
    },
    methods: {
        async getCurrenPageCollections(currentPage) {
            const offset = (currentPage - 1) * PAGE_SIZE
            const getCollections = await db.collection(COLLECTION).skip(offset).limit(PAGE_SIZE).orderBy('created', 'desc').get()
            return getCollections.data
        },
        handleCurrentChange(val) {

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
        selectedPeriod(value) {
            console.log(value)
            const validCourts = []
            value.courts.forEach(element => {
                if (element.status === 1) {
                    validCourts.push(element)
                }
            });
            this.$data.validCourts = validCourts
        },
        onSelectedCourts(value) {
            this.$data.new_order_period.selectedCourts = value
        },
        onCalculateClick() {

        },
        cancelCreate() {
            this.$data.dialogFormVisible = false;
            this.$data.newOrder = this.defaultNewOrder();
        },
        async newOrderSearchUser() {
            const getMember = await db.collection('members').where({
                phoneNum: this.$data.newOrder.phoneNum
            }).get()
            if (getMember.data.length !== 1) {
                this.$data.new_order_member = { cash: '查询余额失败' }
                return
            }
            const member = getMember.data[0]
            this.$data.newOrder._openid = member._openid
        },
        async createNewOrder() {
            const newOrder = this.$data.newOrder;
            if (newOrder.phoneNum.length == 0) {
                Message.error("请输入手机号")
                return;
            }
            if (!newOrder.period) {
                Message.error("请选择时间段")
                return;
            }
            if (newOrder.courts.length == 0) {
                Message.error("请选择场地")
                return;
            }
            const memberRes = await getCollectionsWithParam("members", { phoneNum: newOrder.phoneNum });
            if (memberRes.data.length == 0) {
                Message.error("未查询到对应用户，请重新输入手机号")
                return;
            }

            // newOrder.price = this.calculatePrice(newOrder.courts)
            const member = memberRes.data[0];
            if (member.cash < newOrder.price) {
                Message.error("用户余额不足！")
                return;
            }
            newOrder.member = member
            if (isNaN(newOrder.price)) {
                Message.error("请输入合法金额")
                newOrder.price = 0
            } else {
                newOrder.price = Number(newOrder.price)
            }
            newOrder.status = 0
            console.log(newOrder, JSON.stringify(newOrder))
            return
            const res = await vue.$app.callFunction({ name: 'createCourtOrder', data: { params: newOrder } })
            console.log(res)
            if (!res.result._id) {
                Message.error(res.result.errorMsg ? res.result.errorMsg : "新建订单失败")
                return
            }
            const order = res.result
            // 订单创建成功，确认订单
            const confirmRes = await vue.$app.callFunction({ name: 'confirmCourtOrder', data: { orderId: order._id, payBy: 0 } })
            console.log(confirmRes)
            if (confirmRes.result.errorMsg.length > 0) {
                Message.error(confirmRes.result.errorMsg)
            }
            Message.success("创建订单成功")
        },


        defaultNewOrder() {
            return {
                phoneNum: "",
                courts: [],
                date: "",
                period: [],
                price: 0,
                member: {}
            };
        },
        formatOrderCourts(courts) {
            let courtsStr = "";
            courts.forEach(court => {
                courtsStr += court.name + " ,";
            });
            courtsStr = courtsStr.substr(0, courtsStr.length - 1);
            return courtsStr;
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
        searchClick() {
        },
        clearClick() {
            this.getCollection(this.$data.currentPage, this.$data.pageSize, {
                isVIP: false
            }).then(res => {
                res.sort((a, b) => b.created - a.created);
                this.$data.datas = res;
            });
        }
    }
};
</script>

<style>

</style>
