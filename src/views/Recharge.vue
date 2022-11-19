<template>
    <div class="home-container">
        <div class="home-content">
            <el-table :data="newData" fit border style="margin-top: 10px">
                <el-table-column prop="name" label="名称" width="120">
                    <template slot-scope="scope">
                        <el-input autocomplete="off" v-model="scope.row.name"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="价格" width="120">
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.price"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="value" label="次数" width="120">
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.value"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-popconfirm @confirm="handleAdd(scope.row)" title="确定新增吗？">
                            <el-button slot="reference" size="mini" type="primary">新增</el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-table :data="datas" :default-sort="{ prop: 'price' }" height="450" border style="margin-top: 10px">
                <el-table-column prop="name" label="名称" width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.name"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="价格" width="120">
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.price"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="value" label="次数" width="120">
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.value"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-popconfirm @confirm="handleEdit(scope.row)" title="确定保存吗？">
                            <el-button slot="reference" size="mini">保存</el-button>
                        </el-popconfirm>
                        <el-popconfirm @confirm="handleDelete(scope.row)" title="确定删除吗？">
                            <el-button slot="reference" size="mini" type="danger">删除</el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>

import { getDatas, updateInfo, deleteInfo, addInfo } from "@/api";
import { Message, Loading } from 'element-ui';

import vue from "../main"
const db = vue.$app.database();
const COLLECTION = 'recharge'

export default {
    name: "home",
    data() {
        return {
            datas: [],
            newData: [{}]
        };
    },
    created() {
        getDatas(COLLECTION).then(res => {
            console.log(res);
            this.$data.datas = res.data;
        });
    },
    methods: {
        async handleEdit(info) {
            console.log(info)
            const updateRes = await db.collection(COLLECTION).doc(info._id).update({
                name: info.name,
                price: parseInt(info.price),
                value: parseInt(info.value)
            })

            if (updateRes.updated === 1) {
                Message.success('更新成功')
                this.$router.go(0)
                return
            }
            if (updateRes.updated === 0) {
                Message.info('数据无变化')
                return
            }
            Message.error('更新失败')
        },
        async handleDelete(info) {
            const deleteRes = await db.collection(COLLECTION).doc(info._id).remove()
            console.log(deleteRes)
            if (deleteRes.deleted === 1) {
                Message.success('删除成功')
                return
            }
            Message.error('删除失败')
        },
        async handleAdd(info) {
            if (!info.name) {
                Message.error('请输入名称')
                return
            }
            if (!info.price) {
                Message.error('请输入价格')
                return
            }
            if (!info.value) {
                Message.error('请输入次数')
                return
            }
            info.price = parseInt(info.price)
            info.value = parseInt(info.value)
            console.log(info)
            const addRes = await db.collection(COLLECTION).add({
                name: info.name,
                price: info.price,
                value: info.value
            })
            console.log(addRes)
            if (addRes.id) {
                Message.success('新增成功')
                return
            }
            Message.error('新增失败')
        }
    }
};
</script>

<style scoped>
.home-container {
    padding: 10px;
    padding-top: 5px;
}

.home-content {
    padding: 10px;
    border-radius: 5px;
    background: #fff;
}
</style>
