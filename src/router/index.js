import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const commonRoutes = [
    {
        path: '/login',
        name: 'login',
        meta: { title: '登录' },
        component: () => import('../components/Login.vue'),
    },
    {
        path: '/404',
        name: '404',
        meta: { title: '404' },
        component: () => import('../components/404.vue'),
    },
    { path: '/', redirect: '/date' },
]

// 本地所有的页面 需要配合后台返回的数据生成页面
export const asyncRoutes = {
    date: {
        path: '/date',
        name: 'date',
        meta: { title: '当日概况' },
        component: () => import('../views/Date.vue'),
    },
    home: {
        path: 'home',
        name: 'home',
        meta: { title: '主页' },
        component: () => import('../views/Home.vue'),
    },
    shoot: {
        path: 'shoot',
        name: 'shoot',
        meta: { title: '投篮机' },
        component: () => import('../views/Shoot.vue'),
    },
    other: {
        path: '/other', // 点击侧边栏跳到一个单独的路由页面，需要定义，层级和其他顶级路由一样
        name: 'other',
        meta: { title: '会员信息' },
        component: () => import('../views/Other.vue'),
    },
    approach: {
        path: '/approach', // 点击侧边栏跳到一个单独的路由页面，需要定义，层级和其他顶级路由一样
        name: 'approach',
        meta: { title: '入场记录' },
        component: () => import('../views/Approach.vue'),
    },
    court: {
        path: '/court', // 点击侧边栏跳到一个单独的路由页面，需要定义，层级和其他顶级路由一样
        name: 'court',
        meta: { title: '包场订单' },
        component: () => import('../views/CourtOrders.vue'),
    },
    recharge: {
        path: '/recharge', // 点击侧边栏跳到一个单独的路由页面，需要定义，层级和其他顶级路由一样
        name: 'recharge',
        meta: { title: '散客卡配置' },
        component: () => import('../views/Recharge.vue'),
    },
    cash: {
        path: '/cash', // 点击侧边栏跳到一个单独的路由页面，需要定义，层级和其他顶级路由一样
        name: 'cash',
        meta: { title: '现金充值' },
        component: () => import('../views/Cash.vue'),
    },
    rechargeorders: {
        path: '/rechargeorders', // 点击侧边栏跳到一个单独的路由页面，需要定义，层级和其他顶级路由一样
        name: 'rechargeorders',
        meta: { title: '野球卡订单' },
        component: () => import('../views/RechargeOrders.vue'),
    },
    cashorders: {
        path: '/cashorders', // 点击侧边栏跳到一个单独的路由页面，需要定义，层级和其他顶级路由一样
        name: 'cashorders',
        meta: { title: '现金充值订单' },
        component: () => import('../views/CashOrders.vue'),
    },
    week: {
        path: '/week', // 点击侧边栏跳到一个单独的路由页面，需要定义，层级和其他顶级路由一样
        name: 'week',
        meta: { title: '日期' },
        component: () => import('../views/Week.vue'),
    },
    member_record: {
        path: '/member_record', // 点击侧边栏跳到一个单独的路由页面，需要定义，层级和其他顶级路由一样
        name: 'member_record',
        meta: { title: '修改用户信息记录' },
        component: () => import('../views/MemberRecord.vue'),
    },
    t1: {
        path: 't1',
        name: 't1',
        meta: { title: '表格' },
        component: () => import('../views/T1.vue'),
    },
    password: {
        path: 'password',
        name: 'password',
        meta: { title: '修改密码' },
        component: () => import('../views/Password.vue'),
    },
    msg: {
        path: 'msg',
        name: 'msg',
        meta: { title: '通知消息' },
        component: () => import('../views/Msg.vue'),
    },
    userinfo: {
        path: 'userinfo',
        name: 'userinfo',
        meta: { title: '用户信息' },
        component: () => import('../views/UserInfo.vue'),
    },
}

const createRouter = () => new Router({
    routes: commonRoutes,
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

export default router