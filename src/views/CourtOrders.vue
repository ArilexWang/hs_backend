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
                        <div>余额：{{ newOrder.member.cash }}</div>
                    </el-form-item>

                    <el-form-item label="选择日期" :label-width="formLabelWidth">
                        <el-date-picker v-model="newOrder.date" type="date" placeholder="选择日期" @change="pickeDate">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="选择时间段" :label-width="formLabelWidth">
                        <el-radio-group v-model="newOrder.period" @change="selectedPeriod">
                            <el-radio v-for="period in validPeriods" :key="period.format" :label="period"
                                :name="period.format">{{
                                        period.format
                                }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="选择场地" :label-width="formLabelWidth">
                        <el-checkbox-group v-model="newOrder.courts" @change="selectedCourts">
                            <el-checkbox v-for="court in validCourts" :key="court._id" :label="court"
                                :name="court.name">{{
                                        court.name
                                }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="总额" :label-width="formLabelWidth">
                        <el-input v-model="newOrder.price" :disabled="false" style="width:100px"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelCreate">取 消</el-button>
                    <el-button type="primary" @click="createNewOrder">确 定</el-button>
                </div>
            </el-dialog>

            <el-table :data="datas" height="550" fit border style="">
                <el-table-column prop="createdFormat" label="下单时间" width="150"> </el-table-column>
                <el-table-column prop="_id" label="业务订单号" width="130"> </el-table-column>
                <el-table-column prop="payMsg.transactionId" label="支付订单号" width="150"> </el-table-column>
                <el-table-column prop="orderDateFormat" label="场地时间" width="200"> </el-table-column>
                <el-table-column prop="courtsFormat" label="场地" width="150"> </el-table-column>
                <el-table-column prop="userInfo.nickName" label="用户昵称" width="120"> </el-table-column>
                <el-table-column prop="userInfo.phoneNum" label="用户联系方式" width="120"> </el-table-column>
                <el-table-column prop="hasRefundFormat" label="退款" width="120"> </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button @click="handleDelete(scope.row)" size="mini" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="block">
            <el-pagination layout="prev, pager, next" :total="pageCount" :page-size="pageSize"
                @current-change="handleCurrentChange">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import {
    getCollectionCountWithParam,
    getCollectionsByPageWithParamAndOrder,
    deleteInfo,
    getDatasByOrder,
    callCloudFunction,
    getCollectionsWithParam,
    addInfo
} from "@/api";
import { updateInfo } from "../api";
import vue from "../main"
import { Message } from 'element-ui';

const db = vue.$app.database();

export default {
    name: "other",
    data() {
        return {
            pageCount: 0,
            currentPage: 1,
            pageSize: 20,
            datas: [],
            newData: {},
            search: "",
            collection: "courtOrders",
            dialogFormVisible: false,
            newOrder: {
                phoneNum: "",
                courts: [],
                date: "",
                period: {},
                price: 0,
                member: {},
            },
            courts: [],
            formLabelWidth: "120px",
            week: [],
            validPeriods: [],
            validCourts: [],
        };
    },
    created() {
        getDatasByOrder("courts", "_id", "asc").then(res => {
            this.$data.courts = res.data;
        });
        // getDatasByOrder("week", "number", "asc").then(res => {
        //     this.$data.week = res.data;
        // });
        // getCollectionCountWithParam(this.$data.collection, { isVIP: false })
        //     .then(res => {
        //         this.$data.pageCount = res.total;
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     });
    },
    mounted() {
        // this.getCollection(this.$data.currentPage, this.$data.pageSize, {
        //     isVIP: false
        // }).then(res => {
        //     res.sort((a, b) => b.created - a.created);
        //     this.$data.datas = res;
        // });
    },
    methods: {
        handleCurrentChange(val) {
            this.getCollection(val, this.$data.pageSize, {
                isVIP: false
            }).then(res => {
                this.$data.datas = res;
            });
        },
        async pickeDate() {
            this.$data.newOrder.periods = [];
            const numOfWeek = this.$data.newOrder.date.getDay();
            const getPeriods = await db.collection('periods').where({
                day: numOfWeek
            }).get()
            const validPeriods = getPeriods.data
            validPeriods.map((item) => {
                item.format = item.start.format("hh:mm") + ' - ' + item.end.format("hh:mm")
                return item
            })
            this.$data.validPeriods = validPeriods
        },
        selectedPeriod(value) {
            const validCourts = []
            this.$data.courts.map((court) => {
                if (value.courts.find(item => court._id === item)) {
                    validCourts.push(court)
                }
            })
            this.$data.validCourts = validCourts
        },
        selectedCourts(value) {
            console.log(value)
            const total = this.calculatePrice(value)
            this.$data.newOrder.price = total
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
                this.$data.newOrder.member = { cash: '查询余额失败' }
                return
            }
            const member = getMember.data[0]
            this.$data.newOrder.member = member
        },
        async createNewOrder() {
            const newOrder = this.$data.newOrder;
            if (newOrder.phoneNum.length == 0) {
                Message.error("请输入手机号")
                return;
            }
            if (!newOrder.period._id) {
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
            console.log(newOrder)
            return
            var orders = [];
            newOrder.periods.map((element, index) => {
                var date = new Date();
                const currentSecond = date.getSeconds() + index;
                date.setSeconds(currentSecond);
                const orderMsg = {
                    courts: newOrder.courts,
                    start: element.start,
                    end: element.end,
                    outTradeNo: "0752" + date.format("yyyyMMddhhmmss"),
                    price: newOrder.price
                };
                orders.push(orderMsg);
            });
            console.log("订单信息：", orders);
            const promises = orders.map(element => {
                return callCloudFunction("checkResource", element);
            });
            const res = await Promise.all(promises);
            console.log(res, orders);
            var allValid = true;
            res.forEach(element => {
                if (!element.result.resourceAvaliable) {
                    allValid = false;
                }
            });
            if (!allValid) {
                this.$message({
                    type: "error",
                    message: "该时段部分场地已被占用"
                });
                this.$data.newOrder = this.defaultNewOrder();
                return;
            }
            const newOrderPromises = orders.map((element, index) => {
                element.resourceIds = res[index].result.resourceIds;
                const param = {
                    created: new Date(),
                    _id: element.outTradeNo,
                    orderMsg: element,
                    validCount: 40 * element.courts.length,
                    isVIP: false,
                    hasRefund: false,
                    userInfo: member,
                    payBy: "余额支付",
                    source: "后台订单",
                    remain: member.cash - element.price,
                    _openid: member._openid
                };
                return addInfo(param, "courtOrders");
            });
            const newOrderRes = await Promise.all(newOrderPromises);
            console.log("订单创建结果：", newOrderRes);
            delete member._openid;
            const updateMemberPromises = orders.map(element => {
                member.cash -= element.price;
                return updateInfo(member, "members");
            });
            const membersRes = await Promise.all(updateMemberPromises);
            console.log("用户扣款结果：", newOrderRes);
            this.$message({
                type: "success",
                message: "订单新建成功，即将刷新页面"
            });
            setTimeout(() => {
                this.$router.go(0);
            }, 1000);
        },
        calculatePrice(courts) {
            var totalCost = 0;
            const tempCourts = JSON.parse(
                JSON.stringify(courts)
            );
            tempCourts.sort(function (a, b) { return a._id - b._id })
            const findNum = (search, array) => {
                for (var i in array) {
                    if (array[i]._id == search) {
                        return true;
                    }
                }
                return false;
            }
            if (findNum(1, tempCourts) && findNum(2, tempCourts)) {
                const targetCourt = this.$data.courts.find(item => 3 === item._id)
                totalCost += targetCourt.price
                for (let index = 0; index < 2; index++) {
                    tempCourts.map((item, index) => {
                        if (item._id === 1 || item._id === 2) {
                            tempCourts.splice(index, 1)
                        }
                    })
                }
            }
            if (findNum(4, tempCourts) && findNum(5, tempCourts)) {
                const targetCourt = this.$data.courts.find(item => 9 === item._id)
                totalCost += targetCourt.price
                for (let index = 0; index < 2; index++) {
                    tempCourts.map((item, index) => {
                        if (item._id === 4 || item._id === 5) {
                            tempCourts.splice(index, 1)
                        }
                    })
                }
            }
            if (findNum(6, tempCourts) && findNum(7, tempCourts)) {
                const targetCourt = this.$data.courts.find(item => 13 === item._id)
                totalCost += targetCourt.price
                for (let index = 0; index < 2; index++) {
                    tempCourts.map((item, index) => {
                        if (item._id === 6 || item._id === 7) {
                            tempCourts.splice(index, 1)
                        }
                    })
                }
            }
            tempCourts.forEach(element => {
                console.log(element)
                totalCost += element.price
            })
            return totalCost;
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
        getCollection(currentPage, pageSize, param) {
            return new Promise((resolve, reject) => {
                const offset = (currentPage - 1) * pageSize;
                getCollectionsByPageWithParamAndOrder(this.$data.collection, offset, pageSize, param, "created", "desc")
                    .then(res => {
                        res.data.forEach(element => {
                            element.createdFormat = this.$dateFormat(element.created, "yyyy-mm-dd HH:MM");
                            element.courtsFormat = this.formatOrderCourts(element.orderMsg.courts);
                            element.hasRefundFormat = element.hasRefund ? "已退款" : "未退款";
                            if (!element.payMsg) {
                                if (element.source == "后台订单") {
                                    element.payMsg = { transactionId: "余额支付(后台)" };
                                } else {
                                    element.payMsg = { transactionId: "余额支付" };
                                }
                            }
                            if (element.remain) {
                                element.userInfo.nickName = element.userInfo.nickName + "(" + element.remain + ")";
                            }
                            element.orderDateFormat =
                                this.$dateFormat(element.orderMsg.start, "yyyy-mm-dd HH:MM") +
                                " - " +
                                this.$dateFormat(element.orderMsg.end, "HH:MM");
                        });
                        resolve(res.data);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
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
            getCollectionCountWithParam(this.$data.collection, {
                isVIP: false,
                "userInfo.phoneNum": this.$data.search
            })
                .then(res => {
                    console.log(res);
                    this.$data.pageCount = res.total;
                    this.getCollection(this.$data.currentPage, this.$data.pageSize, {
                        isVIP: false,
                        "userInfo.phoneNum": this.$data.search
                    }).then(datas => {
                        datas.sort((a, b) => b.created - a.created);
                        this.$data.datas = datas;
                    });
                })
                .catch(err => {
                    console.log(err);
                });
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
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return fmt;
};
</script>

<style>

</style>
