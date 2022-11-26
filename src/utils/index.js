import { resetRouter } from "@/router";
import vue from "../main";

export function resetTokenAndClearUser() {
    // 退出登陆 清除用户资料
    vue.$app
        .auth()
        .signOut()
        .then(() => {
            console.log("sign out");
            vue.$router.push({ path: "/login" });
        });
    // 重设路由
    resetRouter();
}

export const defaultDocumentTitle = "荟晟体育";
export function getDocumentTitle(pageTitle) {
    if (pageTitle) return `${defaultDocumentTitle} - ${pageTitle}`;
    return `${defaultDocumentTitle}`;
}

export function getTokenWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
        return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    return item.token;
}
