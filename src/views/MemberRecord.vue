<template>
    <div class="home-container">
        <div class="home-content">
            <el-input placeholder="请输入手机号进行搜索" v-model="search" style="width: 300px" clearable @clear="clearClick">
                <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
            </el-input>
            <el-table :data="datas" height="550" fit border style="">
                <el-table-column prop="createdFormat" label="操作时间" width="180"> </el-table-column>
                <el-table-column prop="phoneNum" label="电话号码" width="120"> </el-table-column>
                <el-table-column prop="originFormat" label="原记录" width="250"></el-table-column>
                <el-table-column prop="newFormat" label="新纪录" width="250"></el-table-column>
                <el-table-column prop="remark" label="备注" width="200"></el-table-column>

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
import dateFormat from "dateformat";
import vue from "../main"
var _ = require('lodash');
import { Message } from 'element-ui';

const db = vue.$app.database();
const COLLECTION = 'update_member_records'
const PAGE_SIZE = 20

export default {
    name: "member_record",
    data() {
        return {
            totalCount: 0,
            currentPage: 1,
            pageSize: PAGE_SIZE,
            datas: [],
            originDatas: [],
            search: "",
            dialogFormVisible: false,
            selectedIndex: 0,
            remark: ''
        };
    },
    async created() {
        const countResult = await db.collection(COLLECTION).count()
        const total = countResult.total
        this.$data.totalCount = total
        var datas = await this.getCurrenPageCollections(this.$data.currentPage)
        datas = datas.map((item) => {
            item.createdFormat = dateFormat(item.created, 'yyyy-mm-dd HH:MM')
            item.phoneNum = item.originData.phoneNum
            item.originFormat = '次卡:' + item.originData.validTimes + ' 积分:' + item.originData.integral + ' 余额:' + item.originData.cash
            item.newFormat = '次卡:' + item.newData.validTimes + ' 积分:' + item.newData.integral + ' 余额:' + item.newData.cash

            return item
        })
        console.log(datas)
        this.$data.datas = datas
    },
    mounted() {

    },
    methods: {
        async handleCurrentChange(val) {
            this.$data.currentPage = val;
            this.$data.datas = await this.getCurrenPageCollections(val)
        },
        async getCurrenPageCollections(currentPage) {
            const offset = (currentPage - 1) * PAGE_SIZE
            const getCollections = await db.collection(COLLECTION).skip(offset).limit(PAGE_SIZE).orderBy('created', 'desc').get()
            return getCollections.data
        },
        async onConfirm() {
            const newData = this.$data.datas[this.$data.selectedIndex]
            const originData = this.$data.originDatas[this.$data.selectedIndex]
            const updateRes = await db.collection('members').where({
                _openid: newData._openid
            }).update({
                validTimes: parseInt(newData.validTimes),
                integral: parseInt(newData.integral),
                cash: parseInt(newData.cash)
            })
            console.log(updateRes)
            if (updateRes.updated !== 1) {
                Message.error('更新失败')
                return
            }
            const newRecord = await db.collection('update_member_records').add({
                newData,
                originData,
                remark: this.$data.remark,
                created: new Date().getTime()
            })
            console.log(newRecord)
            this.$data.dialogFormVisible = false
            Message.success('更新成功')
        },

        async handleUpdate(info) {
            const newData = this.$data.datas[info.$index]
            const originData = this.$data.originDatas[info.$index]
            if (newData.validTimes === originData.validTimes
                && newData.integral === originData.integral
                && newData.cash === originData.cash) {
                Message.info('数据无变化')
                return
            }
            this.$data.selectedIndex = info.$index
            this.$data.dialogFormVisible = true
        },
        searchClick() {

        },
        clearClick() {

        }
    }
};
</script>

<style>

</style>
