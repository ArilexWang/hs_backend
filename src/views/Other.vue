<template>
    <div class="home-container">
        <div class="home-content">
            <el-input placeholder="请输入手机号进行搜索" v-model="search" style="width: 300px" clearable @clear="clearClick">
                <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
            </el-input>
            <el-table :data="datas" height="550" fit border style="">
                <el-table-column prop="createdFormat" label="注册日期" width="180"> </el-table-column>
                <el-table-column prop="nickName" label="昵称" width="120"> </el-table-column>
                <el-table-column prop="phoneNum" label="电话号码" width="200"> </el-table-column>
                <el-table-column prop="validTimes" label="次卡" width="120">
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.validTimes"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="validTime" label="时间卡" width="120">
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.validTime"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="validTime" label="余额" width="120">
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.cash"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button @click="handleUpdate(scope.row)" size="mini">保存</el-button>
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
import { getCollectionCount, getCollectionsByPageWithParamAndOrder, updateInfo, getCollectionCountWithParam } from "@/api";

export default {
    name: "other",
    data() {
        return {
            pageCount: 0,
            currentPage: 1,
            pageSize: 20,
            datas: [],
            collection: "members",
            search: ""
        };
    },
    created() {
        getCollectionCount(this.$data.collection)
            .then(res => {
                console.log(res);
                this.$data.pageCount = res.total;
            })
            .catch(err => {
                console.log(err);
            });
    },
    mounted() {
        this.getCollection(this.$data.currentPage, this.$data.pageSize, {}).then(res => {
            this.$data.datas = res;
        });
    },
    methods: {
        handleCurrentChange(val) {
            this.$data.currentPage = val;
            this.getCollection(val, this.$data.pageSize, {}).then(res => {
                this.$data.datas = res;
            });
        },
        getCollection(currentPage, pageSize, param) {
            return new Promise((resolve, reject) => {
                const offset = (currentPage - 1) * pageSize;
                getCollectionsByPageWithParamAndOrder(this.$data.collection, offset, pageSize, param, "created", "desc")
                    .then(res => {
                        res.data.forEach(element => {
                            element.createdFormat = this.$dateFormat(element.created, "yyyy-mm-dd HH:MM");
                        });
                        resolve(res.data);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        },
        handleUpdate(info) {
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
                    this.$confirm("是否提交修改", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            info.validTimes = parseInt(info.validTimes);
                            info.validTime = parseInt(info.validTime);
                            info.cash = parseInt(info.cash);
                            delete info._openid;
                            updateInfo(info, this.$data.collection).then(res => {
                                if (res.updated == 1) {
                                    this.$message({
                                        type: "success",
                                        message: "已保存!请刷新页面"
                                    });
                                    this.getCollection(this.$data.currentPage, this.$data.pageSize, {}).then(res => {
                                        this.$data.datas = res;
                                    });
                                } else {
                                    console.log(res);
                                    this.$message({
                                        type: "fail",
                                        message: "保存失败!"
                                    });
                                }
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            // this.$router.go(0);
                            this.$message({
                                type: "info",
                                message: "保存失败"
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
            console.log(this.$data.search);
            getCollectionCountWithParam(this.$data.collection, {
                phoneNum: this.$data.search
            })
                .then(res => {
                    console.log(res);
                    this.$data.pageCount = res.total;
                    this.getCollection(1, this.$data.pageSize, {
                        phoneNum: this.$data.search
                    }).then(datas => {
                        console.log(datas);
                        this.$data.datas = datas;
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        },
        clearClick() {
            getCollectionCount(this.$data.collection)
                .then(res => {
                    console.log(res);
                    this.$data.pageCount = res.total;
                })
                .catch(err => {
                    console.log(err);
                });
            this.getCollection(this.$data.currentPage, this.$data.pageSize, {}).then(res => {
                this.$data.datas = res;
            });
        }
    }
};
</script>

<style></style>
