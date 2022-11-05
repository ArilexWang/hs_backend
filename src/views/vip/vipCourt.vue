<template>
    <div class="home-container">
        <div class="home-content">
            <el-input placeholder="请输入手机号进行搜索" v-model="search" style="width: 300px" clearable @clear="clearClick">
                <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
            </el-input>
            <el-button style="margin-left: 100px" @click="dialogFormVisible = true" type="primary">新建订单</el-button>

            <el-dialog title="订单信息" :visible.sync="dialogFormVisible">
                <el-form :model="newOrder">
                    <el-form-item label="用户昵称" :label-width="formLabelWidth">
                        <el-input v-model="newOrder.nickName" autocomplete="off"></el-input>
                    </el-form-item>
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
                        <el-checkbox-group v-model="newOrder.periods">
                            <el-checkbox v-for="period in selectedPeriods" :key="period.name" :label="period" :name="period.name">{{
                                period.name
                            }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelCreate">取 消</el-button>
                    <el-button type="primary" @click="createNewOrder">确 定</el-button>
                </div>
            </el-dialog>
            <el-table :data="datas" height="550" fit border style="">
                <el-table-column prop="createdFormat" label="下单时间" width="150"> </el-table-column>
                <el-table-column prop="orderDateFormat" label="场地时间" width="200"> </el-table-column>
                <el-table-column prop="courtsFormat" label="场地" width="150"> </el-table-column>
                <el-table-column prop="userInfo.nickName" label="用户昵称" width="120"> </el-table-column>
                <el-table-column prop="userInfo.phoneNum" label="用户联系方式" width="120"> </el-table-column>
                <el-table-column label="二维码" width="120">
                    <template slot-scope="scope">
                        <vue-qr
                            :correctLevel="3"
                            :autoColor="false"
                            colorDark="#313a90"
                            :text="scope.row.qrCode"
                            :size="95"
                            :margin="0"
                            :logoMargin="3"
                        ></vue-qr>
                    </template>
                </el-table-column>
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
    addInfo,
    callCloudFunction
} from "@/api";
import VueQr from "vue-qr";

export default {
    name: "other",
    data() {
        return {
            pageCount: 0,
            currentPage: 1,
            pageSize: 20,
            datas: [],
            newData: [{}],
            collection: "courtOrders",
            dialogFormVisible: false,
            newOrder: {
                nickName: "",
                phoneNum: "",
                courts: [],
                date: "",
                periods: [],
                price: 0
            },
            courts: [],
            formLabelWidth: "120px",
            week: [],
            selectedPeriods: [],
            search: ""
        };
    },
    components: {
        VueQr
    },
    created() {
        getDatasByOrder("courts", "number", "asc").then(res => {
            this.$data.courts = res.data;
        });
        getDatasByOrder("week", "number", "asc").then(res => {
            this.$data.week = res.data;
        });
        getCollectionCountWithParam(this.$data.collection, { isVIP: true })
            .then(res => {
                console.log(res);
                this.$data.pageCount = res.total;
            })
            .catch(err => {
                console.log(err);
            });
    },
    mounted() {
        this.getCollection(this.$data.currentPage, this.$data.pageSize).then(res => {
            res.forEach(element => {
                element.createdFormat = this.$dateFormat(element.created, "yyyy-mm-dd HH:MM");
                element.orderDateFormat =
                    this.$dateFormat(element.orderMsg.start, "yyyy-mm-dd HH:MM") + " - " + this.$dateFormat(element.orderMsg.end, "HH:MM");
                element.courtsFormat = this.formatOrderCourts(element.orderMsg.courts);
                const qrCodeParam = { id: element._id, type: 2 };
                element.qrCode = JSON.stringify(qrCodeParam);
            });
            this.$data.datas = res;
        });
    },
    methods: {
        handleCurrentChange(val) {
            this.getCollection(val, this.$data.pageSize, { isVIP: true }).then(res => {
                res.forEach(element => {
                    element.createdFormat = this.$dateFormat(element.created, "yyyy-mm-dd HH:MM");
                    element.orderDateFormat =
                        this.$dateFormat(element.orderMsg.start, "yyyy-mm-dd HH:MM") +
                        " - " +
                        this.$dateFormat(element.orderMsg.end, "HH:MM");
                    element.courtsFormat = this.formatOrderCourts(element.orderMsg.courts);
                    const qrCodeParam = { id: element._id, type: 2 };
                    element.qrCode = JSON.stringify(qrCodeParam);
                });
                this.$data.datas = res;
                this.$data.datas = res;
            });
        },
        pickeDate(value) {
            this.$data.newOrder.periods = [];
            const numOfWeek = this.$data.newOrder.date.getDay();
            const periods = this.$data.week.find(period => period._id == numOfWeek.toString());
            console.log("periods:", periods);
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
            if (newOrder.courts.length == 0) {
                this.$message({
                    type: "error",
                    message: "请选择场地！"
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
            if (orders.length == 0) return;
            const promises = orders.map(element => {
                return callCloudFunction("checkResource", element);
            });
            const res = await Promise.all(promises);
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
                    isVIP: true,
                    hasRefund: false,
                    userInfo: {
                        nickName: newOrder.nickName,
                        phoneNum: newOrder.phoneNum
                    }
                };
                return addInfo(param, "courtOrders");
            });
            const newOrderRes = await Promise.all(newOrderPromises);

            this.$message({
                type: "success",
                message: "订单新建成功，即将刷新页面"
            });
            this.$data.newOrder = this.defaultNewOrder();
            setTimeout(() => {
                this.$router.go(0);
            }, 1000);
            return;
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
            if (!param) {
                param = {
                    isVIP: true
                };
            }
            return new Promise((resolve, reject) => {
                const offset = (currentPage - 1) * pageSize;
                getCollectionsByPageWithParamAndOrder(this.$data.collection, offset, pageSize, param, "created", "desc")
                    .then(res => {
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
                courtsStr += court.name + "，";
            });
            courtsStr = courtsStr.substr(0, courtsStr.length - 1);
            return courtsStr;
        },
        handleDelete(info) {
            this.$prompt("请输入密码", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputType: "new-password"
            }).then(({ value }) => {
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
                }).then(() => {
                    const promises = info.orderMsg.resourceIds.map(id => {
                        const resource = { _id: id };
                        return deleteInfo(resource, "resource");
                    });
                    Promise.all(promises).then(() => {
                        deleteInfo(info, this.$data.collection).then(res => {
                            this.$message({
                                type: "success",
                                message: "已删除，即将刷新页面！"
                            });
                            setTimeout(() => {
                                this.$router.go(0);
                            }, 1000);
                        });
                    });
                });
            });
        },
        searchClick() {
            getCollectionCountWithParam(this.$data.collection, {
                isVIP: true,
                "userInfo.phoneNum": this.$data.search
            })
                .then(res => {
                    this.$data.pageCount = res.total;
                    this.getCollection(this.$data.currentPage, this.$data.pageSize, {
                        isVIP: true,
                        "userInfo.phoneNum": this.$data.search
                    }).then(res => {
                        res.forEach(element => {
                            element.createdFormat = this.$dateFormat(element.created, "yyyy-mm-dd HH:MM");
                            element.orderDateFormat =
                                this.$dateFormat(element.orderMsg.start, "yyyy-mm-dd HH:MM") +
                                " - " +
                                this.$dateFormat(element.orderMsg.end, "HH:MM");
                            element.courtsFormat = this.formatOrderCourts(element.orderMsg.courts);
                            const qrCodeParam = { id: element._id, type: 2 };
                            element.qrCode = JSON.stringify(qrCodeParam);
                        });
                        this.$data.datas = res;
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        },
        clearClick() {
            this.getCollection(this.$data.currentPage, this.$data.pageSize).then(res => {
                console.log(res);
                res.sort((a, b) => b.created - a.created);
                res.forEach(element => {
                    element.createdFormat = this.$dateFormat(element.created, "yyyy-mm-dd HH:MM");
                    element.orderDateFormat =
                        this.$dateFormat(element.orderMsg.start, "yyyy-mm-dd HH:MM") +
                        " - " +
                        this.$dateFormat(element.orderMsg.end, "HH:MM");
                    element.courtsFormat = this.formatOrderCourts(element.orderMsg.courts);
                    const qrCodeParam = { id: element._id, type: 2 };
                    console.log(JSON.stringify(qrCodeParam));
                    element.qrCode = JSON.stringify(qrCodeParam);
                });
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
