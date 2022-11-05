<template>
    <div class="home-container">
        <div class="home-content">
            <el-input placeholder="请输入手机号进行搜索" v-model="search" style="width: 300px" clearable @clear="clearClick">
                <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
            </el-input>
            <el-table height="550" :data="datas" fit border style>
                <el-table-column prop="orderDate" label="下单时间" width="150"></el-table-column>
                <el-table-column prop="payMsg.transactionId" label="订单号" width="150"></el-table-column>
                <el-table-column prop="recharge.name" label="充值类型" width="120"></el-table-column>
                <el-table-column prop="recharge.price" label="充值金额" width="120"></el-table-column>
                <el-table-column prop="userInfo.nickName" label="用户昵称" width="120"></el-table-column>
                <el-table-column prop="userInfo.phoneNum" label="用户联系方式" width="120"></el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button @click="handleDelete(scope.row)" size="mini" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="block">
            <el-pagination
                layout="prev, pager, next"
                :total="pageCount"
                :page-size="pageSize"
                @current-change="handleCurrentChange"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { getCollectionCount, deleteInfo, getCollectionCountWithParam, getCollectionsByPageWithParamAndOrder } from "@/api";

export default {
    name: "other",
    data() {
        return {
            pageCount: 0,
            currentPage: 1,
            pageSize: 20,
            datas: [],
            boolTrue: true,
            collection: "orders",
            search: ""
        };
    },
    created() {
        getCollectionCount(this.$data.collection)
            .then(res => {
                this.$data.pageCount = res.total;
            })
            .catch(err => {
                console.log(err);
            });
    },
    mounted() {
        this.getCollection(this.$data.currentPage, this.$data.pageSize, {}).then(res => {
            console.log(res);
            this.$data.datas = res;
        });
    },
    methods: {
        handleCurrentChange(val) {
            console.log(val);
            this.getCollection(val, this.$data.pageSize, {}).then(res => {
                this.$data.datas = res;
            });
        },
        getCollection(currentPage, pageSize, param) {
            return new Promise((resolve, reject) => {
                const offset = (currentPage - 1) * pageSize;
                getCollectionsByPageWithParamAndOrder(this.$data.collection, offset, pageSize, param, "created", "desc")
                    .then(res => {
                        res.data.sort((a, b) => b.orderDate - a.orderDate);
                        res.data.forEach(element => {
                            element.orderDate = this.$dateFormat(element.created, "yyyy-mm-dd HH:MM");
                            if (!element.payMsg) {
                                if (element.rechargeBy == "余额支付") {
                                    element.payMsg = {
                                        transactionId: "余额支付"
                                    };
                                } else {
                                    element.payMsg = {
                                        transactionId: "未支付"
                                    };
                                }
                            }
                        });
                        resolve(res.data);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
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
                    this.$confirm("是否删除当前订单信息", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            deleteInfo(info, this.$data.collection).then(() => {
                                this.$message({
                                    type: "success",
                                    message: "删除成功，即将刷新页面！"
                                });
                                setTimeout(() => {
                                    this.$router.go(0);
                                }, 1000);
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            this.$message({
                                type: "info",
                                message: "操作取消"
                            });
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "取消修改"
                    });
                });
        },
        searchClick() {
            getCollectionCountWithParam(this.$data.collection, {
                "userInfo.phoneNum": this.$data.search
            })
                .then(res => {
                    console.log(res);
                    this.$data.pageCount = res.total;
                    this.getCollection(this.$data.currentPage, this.$data.pageSize, {
                        "userInfo.phoneNum": this.$data.search
                    }).then(datas => {
                        console.log(datas);
                        datas.sort((a, b) => b.created - a.created);
                        this.$data.datas = datas;
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        },
        clearClick() {
            this.getCollection(this.$data.currentPage, this.$data.pageSize, {}).then(res => {
                console.log(res);
                this.$data.datas = res;
            });
        }
    }
};
</script>

<style></style>
