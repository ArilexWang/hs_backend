import { LoadingBar } from 'view-design'
import createRoutes from '@/utils/createRoutes'
import router from './router'
import store from './store'
import { getDocumentTitle, resetTokenAndClearUser } from './utils'
import cloudbase from '@cloudbase/js-sdk'

// 是否有菜单数据

const app = cloudbase.init({
    env: 'test-7ggypkpn0dd471ba',
})
const auth = app.auth({
    persistence: 'local',
})
if (auth.hasLoginState()) {
    console.log('haslogin')
    // 此时已经登录
} else {
    console.log('has not login')
}

let hasMenus = false
router.beforeEach(async (to, from, next) => {
    document.title = getDocumentTitle(to.meta.title)
    LoadingBar.start()
    if (auth.hasLoginState()) {
        if (to.path === '/login') {
            next({ path: '/' })
        } else if (hasMenus) {
            next()
        } else {
            try {
                // 这里可以用 await 配合请求后台数据来生成路由
                // const data = await axios.get('xxx')
                // const routes = createRoutes(data)
                const routes = createRoutes(store.state.menuItems)
                router.addRoutes(routes)
                hasMenus = true
                next({ path: to.path || '/' })
            } catch (error) {
                auth.signOut().then(() => {
                    console.log("sign out")
                })
                resetTokenAndClearUser()
                next(`/login?redirect=${to.path}`)
            }
        }
    } else {
        hasMenus = false
        if (to.path === '/login') {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
        }
    }
})

router.afterEach(() => {
    LoadingBar.finish()
})