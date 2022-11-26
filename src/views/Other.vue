<template>
    <div class="home-container">
        <div class="home-content">
            <div>
                <el-row style="margin: 10px">
                    <el-col :span="4">
                        <el-input placeholder="请输入手机号进行搜索" v-model="filterParams.phoneNum" style="width: 200px"
                            clearable>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button style="margin-left: 100px" @click="onSearchClick" type="primary">搜索</el-button>
                    </el-col>
                    <el-col :span="4">
                        <el-button style="margin-left: 100px" @click="onExportClick" type="primary">导出</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-dialog title="修改用户信息" :visible.sync="dialogFormVisible">
                <el-input v-model="remark" placeholder="备注"></el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="onConfirm">确 定</el-button>
                </div>
            </el-dialog>
            <el-table :data="datas" height="550" fit border style="">
                <el-table-column prop="createdFormat" label="注册日期" width="180"> </el-table-column>
                <el-table-column prop="phoneNum" label="电话号码" width="120"> </el-table-column>
                <el-table-column prop="validTimes" label="散客次卡" width="120">
                    <template slot-scope="scope">
                        <el-input :disabled="!isAdmin" type="number" v-model="scope.row.validTimes"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="integral" label="积分" width="120">
                    <template slot-scope="scope">
                        <el-input :disabled="!isAdmin" type="number" v-model="scope.row.integral"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="cash" label="余额" width="120">
                    <template slot-scope="scope">
                        <el-input :disabled="!isAdmin" type="number" v-model="scope.row.cash"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100" v-if="isAdmin">
                    <template slot-scope="scope">
                        <el-button @click="handleUpdate(scope)" size="mini">保存</el-button>
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
import dateFormat from "dateformat";
import vue from "../main"
var _ = require('lodash');
import { Message, Loading } from 'element-ui';
import XLSX from 'xlsx';

const db = vue.$app.database();
const COLLECTION = 'members'
const PAGE_SIZE = 20
const MAX_LIMIT = 5

export default {
    name: "other",
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
            remark: '',
            filterParams: {
                phoneNum: '',
            },
            isAdmin: false
        };
    },
    async created() {
        const countResult = await db.collection(COLLECTION).count()
        const total = countResult.total
        this.$data.totalCount = total
        var members = await this.getCurrenPageCollections(this.$data.currentPage)
        this.$data.originDatas = _.cloneDeep(members)
        members = members.map((item) => {
            item.createdFormat = dateFormat(item.created, 'yyyy-mm-dd HH:MM')
            return item
        })
        this.$data.datas = members
    },
    mounted() {
        console.log(vue.$user)
        if (vue.$user === 'admin') {
            this.$data.isAdmin = true
        }
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
        formatDatas(datas) {
            datas = datas.map((item) => {
                item.createdFormat = dateFormat(item.created, 'yyyy-mm-dd HH:MM')
                return item
            })
            return datas
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
                const { createdFormat, phoneNum, validTimes, integral, cash } = item
                const sheetData = {
                    '注册日期': createdFormat,
                    '电话号码': phoneNum,
                    '散客次卡': validTimes,
                    '积分': integral,
                    '余额': cash
                }
                sheetDatas.push(sheetData)
                return item
            })
            let wb = XLSX.utils.book_new()
            let sheet = XLSX.utils.json_to_sheet(sheetDatas)
            XLSX.utils.book_append_sheet(wb, sheet, '用户信息')
            // 创建工作薄blob
            XLSX.writeFile(wb, 'output.xlsx');
        },
        async generateFilterOptions() {
            const filter = this.$data.filterParams
            const filterArr = []
            if (filter.phoneNum.length > 0) {
                filterArr.push({
                    phoneNum: filter.phoneNum,
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
            console.log("获取数据", res)
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
        }
    }
};
</script>

<style>

</style>
