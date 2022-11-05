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
                        <el-input v-model="newOrder.phoneNum" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="选择场地" :label-width="formLabelWidth">
                        <el-checkbox-group v-model="newOrder.courts">
                            <el-checkbox v-for="court in courts" :key="court._id" :label="court" :name="court.name">{{
                                court.name
                            }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="选择日期" :label-width="formLabelWidth">
                        <el-date-picker v-model="newOrder.date" type="date" placeholder="选择日期" @change="pickeDate"> </el-date-picker>
                    </el-form-item>
                    <el-form-item label="选择时间段" :label-width="formLabelWidth">
                        <el-checkbox-group v-model="newOrder.periods" @change="selectPeriods" :max="1">
                            <el-checkbox v-for="period in selectedPeriods" :key="period.name" :label="period" :name="period.name">{{
                                period.name
                            }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="总额" :label-width="formLabelWidth">
                        <el-input v-model="newOrder.price" :disabled="true"></el-input>
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
            <el-pagination layout="prev, pager, next" :total="pageCount" :page-size="pageSize" @current-change="handleCurrentChange">
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
                periods: [],
                price: 0
            },
            courts: [],
            formLabelWidth: "120px",
            week: [],
            selectedPeriods: []
        };
    },
    created() {
        getDatasByOrder("courts", "number", "asc").then(res => {
            this.$data.courts = res.data;
        });
        getDatasByOrder("week", "number", "asc").then(res => {
            this.$data.week = res.data;
        });
        getCollectionCountWithParam(this.$data.collection, { isVIP: false })
            .then(res => {
                this.$data.pageCount = res.total;
            })
            .catch(err => {
                console.log(err);
            });
    },
    mounted() {
        this.getCollection(this.$data.currentPage, this.$data.pageSize, {
            isVIP: false
        }).then(res => {
            res.sort((a, b) => b.created - a.created);
            this.$data.datas = res;
        });
    },
    methods: {
        handleCurrentChange(val) {
            this.getCollection(val, this.$data.pageSize, {
                isVIP: false
            }).then(res => {
                this.$data.datas = res;
            });
        },
        pickeDate(value) {
            this.$data.newOrder.periods = [];
            const numOfWeek = this.$data.newOrder.date.getDay();
            const periods = this.$data.week.find(period => period._id == numOfWeek.toString());
            var newPeriods = [];
            periods.period.forEach(element => {
                var startDate = new Date(value);
                startDate.setHours(element.startHour);
                startDate.setMinutes(element.startMinute);
                const startFormat = startDate.format("hh:mm");
                var endDate = new Date(value);
                endDate.setHours(element.endHour);
                endDate.setMinutes(element.endMinute);
                const endFormat = endDate.format("hh:mm");
                const tempPeriod = {
                    start: startDate,
                    end: endDate,
                    halfPrice: element.halfPrice,
                    fullPrice: element.fullPrice,
                    name: startFormat + " - " + endFormat
                };
                newPeriods.push(tempPeriod);
            });
            this.$data.selectedPeriods = newPeriods;
        },
        cancelCreate() {
            this.$data.dialogFormVisible = false;
            this.$data.newOrder = this.defaultNewOrder();
        },
        async createNewOrder() {
            const newOrder = this.$data.newOrder;
            if (newOrder.phoneNum.length == 0) {
                this.$message({
                    type: "error",
                    message: "请输入手机号！"
                });
                return;
            }

            if (newOrder.periods.length == 0) {
                this.$message({
                    type: "error",
                    message: "请选择时间段！"
                });
                this.$data.newOrder = this.defaultNewOrder();
                return;
            }
            if (newOrder.periods.length > 1) {
                this.$message({
                    type: "error",
                    message: "只能选择一个时间段！"
                });
                this.$data.newOrder = this.defaultNewOrder();
                return;
            }
            if (newOrder.courts.length == 0) {
                this.$message({
                    type: "error",
                    message: "请选择场地！"
                });
                this.$data.newOrder = this.defaultNewOrder();
                return;
            }
            const memberRes = await getCollectionsWithParam("members", { phoneNum: newOrder.phoneNum });
            if (memberRes.data.length == 0) {
                this.$message({
                    type: "error",
                    message: "未查询到对应用户，请重新输入手机号！"
                });
                this.$data.newOrder = this.defaultNewOrder();
                return;
            }
            const member = memberRes.data[0];
            console.log(member);
            if (member.cash < newOrder.price) {
                this.$message({
                    type: "error",
                    message: "余额不足！用户余额为：" + member.cash
                });
                this.$data.newOrder = this.defaultNewOrder();
                return;
            }

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
        selectPeriods(value) {
            console.log(value);
            this.$data.newOrder.price = this.calculatePrice(this.$data.newOrder.courts, this.$data.newOrder.periods);
        },
        calculatePrice(courts, periods) {
            var totalCost = 0;
            periods.forEach(element => {
                const findNum = (search, array) => {
                    for (var i in array) {
                        if (array[i].number == search) {
                            return true;
                        }
                    }
                    return false;
                };
                if (findNum(1, courts) && findNum(2, courts)) {
                    totalCost += 400;
                } else if (findNum(1, courts) || findNum(2, courts)) {
                    totalCost += 280;
                }
                if (findNum(3, courts) && findNum(4, courts)) {
                    totalCost += 400;
                } else if (findNum(3, courts) || findNum(4, courts)) {
                    totalCost += 280;
                }
                if (findNum(5, courts) && findNum(6, courts)) {
                    totalCost += element.fullPrice;
                } else if (findNum(5, courts) || findNum(6, courts)) {
                    totalCost += element.halfPrice;
                }
                if (findNum(7, courts) && findNum(8, courts)) {
                    totalCost += element.fullPrice;
                } else if (findNum(7, courts) || findNum(8, courts)) {
                    totalCost += element.halfPrice;
                }
            });
            return totalCost;
        },
        defaultNewOrder() {
            return {
                phoneNum: "",
                courts: [],
                date: "",
                periods: [],
                price: 0
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
Date.prototype.format = function(fmt) {
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

<style></style>
