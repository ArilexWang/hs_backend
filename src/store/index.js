import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        isShowLoading: false, // 全局 loading
        // 左侧菜单栏数据
        menuItems: [
            {
                name: 'date', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'md-home', // icon类型
                text: '当日概况', // 文本内容
            },
            {
                name: 'other', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-egg-outline', // icon类型
                text: '会员信息', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            },
            {
                name: 'approach',
                size: 18,
                type: 'ios-egg-outline',
                text: '入场记录',
            },
            {
                text: '订单',
                size: 18,
                type: 'ios-add-circle',
                children: [
                    {
                        name: 'court', // 要跳转的路由名称 不是路径
                        size: 18, // icon大小
                        type: 'ios-apps', // icon类型
                        text: '包场订单', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
                    },
                    {
                        name: 'rechargeorders', // 要跳转的路由名称 不是路径
                        size: 18, // icon大小
                        type: 'ios-add-circle', // icon类型
                        text: '散客卡订单', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
                    },
                    {
                        name: 'cashorders', // 要跳转的路由名称 不是路径
                        size: 18, // icon大小
                        type: 'ios-add-circle', // icon类型
                        text: '现金充值订单', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
                    },
                ],
            },
            {
                text: '设置',
                size: 18,
                type: 'ios-albums',
                children: [
                    {
                        name: 'home', // 要跳转的路由名称 不是路径
                        size: 18, // icon大小
                        type: 'md-home', // icon类型
                        text: '球场信息', // 文本内容
                    },
                    {
                        name: 'recharge', // 要跳转的路由名称 不是路径
                        size: 18, // icon大小
                        type: 'ios-albums', // icon类型
                        text: '散客卡配置', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
                    },
                    {
                        name: 'cash', // 要跳转的路由名称 不是路径
                        size: 18, // icon大小
                        type: 'ios-albums', // icon类型
                        text: '现金充值', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
                    },
                    {
                        text: '日期', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
                        size: 18, // icon大小
                        type: 'ios-calendar', // icon类型
                        name: 'week',
                    },
                ],
            },
            {
                text: '后台操作记录',
                size: 18,
                type: 'ios-albums',
                children: [
                    {
                        name: 'member_record', // 要跳转的路由名称 不是路径
                        size: 18, // icon大小
                        type: 'md-home', // icon类型
                        text: '用户信息', // 文本内容
                    },
                ],
            },
        ],
    },
    mutations: {
        setMenus(state, items) {
            state.menuItems = [...items]
        },
        setLoading(state, isShowLoading) {
            state.isShowLoading = isShowLoading
        },
    },
})

export default store