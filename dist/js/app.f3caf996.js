(function(e){function t(t){for(var c,a,u=t[0],i=t[1],h=t[2],d=0,l=[];d<u.length;d++)a=u[d],Object.prototype.hasOwnProperty.call(r,a)&&r[a]&&l.push(r[a][0]),r[a]=0;for(c in i)Object.prototype.hasOwnProperty.call(i,c)&&(e[c]=i[c]);s&&s(t);while(l.length)l.shift()();return o.push.apply(o,h||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],c=!0,a=1;a<n.length;a++){var u=n[a];0!==r[u]&&(c=!1)}c&&(o.splice(t--,1),e=i(i.s=n[0]))}return e}var c={},a={app:0},r={app:0},o=[];function u(e){return i.p+"js/"+({}[e]||e)+"."+{"chunk-11fc475a":"e2916f49","chunk-146c7137":"727aa529","chunk-1b9e353d":"60772648","chunk-1cf9fbbe":"23003064","chunk-2d0aba9c":"4cbbe2d3","chunk-2d0c1074":"d422cb05","chunk-2d229803":"c732215e","chunk-2d230cb3":"96230ea9","chunk-2e9a6ce7":"3b49159f","chunk-35eeef5a":"6b18ea21","chunk-42fabd72":"45307e86","chunk-5963ff04":"0fea2be3","chunk-871f0c36":"84b9ee41","chunk-947cc830":"7b78a915","chunk-bb428cc2":"e18b746c","chunk-db6b5bc6":"6a759f73","chunk-de46333c":"765359bf","chunk-ecd56d56":"184af5a5"}[e]+".js"}function i(t){if(c[t])return c[t].exports;var n=c[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.e=function(e){var t=[],n={"chunk-146c7137":1,"chunk-1b9e353d":1,"chunk-1cf9fbbe":1,"chunk-2e9a6ce7":1,"chunk-5963ff04":1,"chunk-947cc830":1,"chunk-bb428cc2":1};a[e]?t.push(a[e]):0!==a[e]&&n[e]&&t.push(a[e]=new Promise((function(t,n){for(var c="css/"+({}[e]||e)+"."+{"chunk-11fc475a":"31d6cfe0","chunk-146c7137":"8feabdb4","chunk-1b9e353d":"82c1f9b7","chunk-1cf9fbbe":"a22df8f4","chunk-2d0aba9c":"31d6cfe0","chunk-2d0c1074":"31d6cfe0","chunk-2d229803":"31d6cfe0","chunk-2d230cb3":"31d6cfe0","chunk-2e9a6ce7":"93dc73c5","chunk-35eeef5a":"31d6cfe0","chunk-42fabd72":"31d6cfe0","chunk-5963ff04":"4b16b1df","chunk-871f0c36":"31d6cfe0","chunk-947cc830":"c272ab1f","chunk-bb428cc2":"fc8daaf6","chunk-db6b5bc6":"31d6cfe0","chunk-de46333c":"31d6cfe0","chunk-ecd56d56":"31d6cfe0"}[e]+".css",r=i.p+c,o=document.getElementsByTagName("link"),u=0;u<o.length;u++){var h=o[u],d=h.getAttribute("data-href")||h.getAttribute("href");if("stylesheet"===h.rel&&(d===c||d===r))return t()}var l=document.getElementsByTagName("style");for(u=0;u<l.length;u++){h=l[u],d=h.getAttribute("data-href");if(d===c||d===r)return t()}var s=document.createElement("link");s.rel="stylesheet",s.type="text/css",s.onload=t,s.onerror=function(t){var c=t&&t.target&&t.target.src||r,o=new Error("Loading CSS chunk "+e+" failed.\n("+c+")");o.code="CSS_CHUNK_LOAD_FAILED",o.request=c,delete a[e],s.parentNode.removeChild(s),n(o)},s.href=r;var f=document.getElementsByTagName("head")[0];f.appendChild(s)})).then((function(){a[e]=0})));var c=r[e];if(0!==c)if(c)t.push(c[2]);else{var o=new Promise((function(t,n){c=r[e]=[t,n]}));t.push(c[2]=o);var h,d=document.createElement("script");d.charset="utf-8",d.timeout=120,i.nc&&d.setAttribute("nonce",i.nc),d.src=u(e);var l=new Error;h=function(t){d.onerror=d.onload=null,clearTimeout(s);var n=r[e];if(0!==n){if(n){var c=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src;l.message="Loading chunk "+e+" failed.\n("+c+": "+a+")",l.name="ChunkLoadError",l.type=c,l.request=a,n[1](l)}r[e]=void 0}};var s=setTimeout((function(){h({type:"timeout",target:d})}),12e4);d.onerror=d.onload=h,document.head.appendChild(d)}return Promise.all(t)},i.m=e,i.c=c,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var c in e)i.d(n,c,function(t){return e[t]}.bind(null,c));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i.oe=function(e){throw console.error(e),e};var h=window["webpackJsonp"]=window["webpackJsonp"]||[],d=h.push.bind(h);h.push=t,h=h.slice();for(var l=0;l<h.length;l++)t(h[l]);var s=d;o.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"034f":function(e,t,n){"use strict";n("85ec")},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var c=n("2b0e"),a=n("bc3a"),r=n.n(a),o=n("f825"),u=n.n(o),i=n("5c96"),h=n.n(i),d=n("b9b9"),l=n.n(d),s=n("d148"),f=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("router-view"),n("div",{directives:[{name:"show",rawName:"v-show",value:e.isShowLoading,expression:"isShowLoading"}],staticClass:"global-loading"},[n("Spin",{attrs:{size:"large"}})],1)],1)},p=[],m=n("5530"),b=n("2f62"),g={name:"App",data:function(){return{keepAliveData:["manage"]}},computed:Object(m["a"])({},Object(b["b"])(["isShowLoading"]))},k=g,v=(n("034f"),n("2877")),y=Object(v["a"])(k,f,p,!1,null,null,null),w=y.exports,x=n("2909");c["default"].use(b["a"]);var S=new b["a"].Store({state:{isShowLoading:!1,menuItems:[{name:"date",size:18,type:"md-home",text:"当日概况"},{name:"other",size:18,type:"ios-egg-outline",text:"会员信息"},{name:"approach",size:18,type:"ios-egg-outline",text:"入场记录"},{text:"订单",size:18,type:"ios-add-circle",children:[{name:"court",size:18,type:"ios-apps",text:"包场订单"},{name:"rechargeorders",size:18,type:"ios-add-circle",text:"野球卡订单"},{name:"cashorders",size:18,type:"ios-add-circle",text:"现金充值订单"}]},{text:"设置",size:18,type:"ios-albums",children:[{name:"home",size:18,type:"md-home",text:"球场信息"},{name:"recharge",size:18,type:"ios-albums",text:"充值信息"},{name:"cash",size:18,type:"ios-albums",text:"现金充值"},{text:"日期",size:18,type:"ios-calendar",name:"week"}]},{text:"VIP通道",size:18,type:"ios-basketball",children:[{name:"vipcourt",size:18,type:"ios-apps",text:"VIP包场"}]}]},mutations:{setMenus:function(e,t){e.menuItems=Object(x["a"])(t)},setLoading:function(e,t){e.isShowLoading=t}}}),j=S,O=n("a18c"),z=(n("f8ce"),n("96cf"),n("1da1"));n("4160"),n("b0c0"),n("d3b7"),n("159b");function E(e){var t=[],c=[];return t.push({path:"/",component:function(){return n.e("chunk-947cc830").then(n.bind(null,"86d6"))},children:c}),e.forEach((function(e){L(c,e)})),t.push({path:"*",redirect:"/404"}),t}function L(e,t){t.name?O["a"][t.name]&&e.push(O["a"][t.name]):t.children&&t.children.forEach((function(t){L(e,t)}))}var I=n("ed08"),P=!1;O["b"].beforeEach(function(){var e=Object(z["a"])(regeneratorRuntime.mark((function e(t,n,c){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(document.title=Object(I["a"])(t.meta.title),o["LoadingBar"].start(),localStorage.getItem("token"))if("/login"===t.path)c({path:"/"});else if(P)c();else try{a=E(j.state.menuItems),O["b"].addRoutes(a),P=!0,c({path:t.path||"/"})}catch(n){Object(I["b"])(),c("/login?redirect=".concat(t.path))}else P=!1,"/login"===t.path?c():(console.log("abcd"),c("/login?redirect=".concat(t.path)));case 3:case"end":return e.stop()}}),e)})));return function(t,n,c){return e.apply(this,arguments)}}()),O["b"].afterEach((function(){o["LoadingBar"].finish()}));n("0fae");c["default"].config.productionTip=!1,c["default"].use(u.a),c["default"].use(h.a);var _=s["a"].init({env:"props-5gyd9ji1143b3cf0"});c["default"].prototype.$app=_,c["default"].prototype.$axios=r.a,c["default"].prototype.$dateFormat=l.a;var A=_.auth({persistence:"local"});A.hasLoginState()?(console.log("haslogin"),localStorage.setItem("token","abcd")):console.log("has not login");var C=new c["default"]({el:"#app",router:O["b"],store:j,render:function(e){return e(w)}});t["default"]=C},"85ec":function(e,t,n){},a18c:function(e,t,n){"use strict";n.d(t,"a",(function(){return o})),n.d(t,"c",(function(){return h}));n("d3b7");var c=n("2b0e"),a=n("8c4f");c["default"].use(a["a"]);var r=[{path:"/login",name:"login",meta:{title:"登录"},component:function(){return n.e("chunk-bb428cc2").then(n.bind(null,"578a"))}},{path:"/404",name:"404",meta:{title:"404"},component:function(){return n.e("chunk-1cf9fbbe").then(n.bind(null,"7746"))}},{path:"/",redirect:"/date"}],o={date:{path:"/date",name:"date",meta:{title:"当日概况"},component:function(){return n.e("chunk-42fabd72").then(n.bind(null,"3a43"))}},home:{path:"home",name:"home",meta:{title:"主页"},component:function(){return n.e("chunk-2e9a6ce7").then(n.bind(null,"bb51"))}},other:{path:"/other",name:"other",meta:{title:"会员信息"},component:function(){return n.e("chunk-871f0c36").then(n.bind(null,"d180"))}},approach:{path:"/approach",name:"approach",meta:{title:"入场记录"},component:function(){return n.e("chunk-db6b5bc6").then(n.bind(null,"e03e"))}},court:{path:"/court",name:"court",meta:{title:"包场订单"},component:function(){return n.e("chunk-11fc475a").then(n.bind(null,"5aea"))}},recharge:{path:"/recharge",name:"recharge",meta:{title:"充值信息"},component:function(){return n.e("chunk-1b9e353d").then(n.bind(null,"fae6"))}},cash:{path:"/cash",name:"cash",meta:{title:"现金充值"},component:function(){return n.e("chunk-5963ff04").then(n.bind(null,"3db0"))}},rechargeorders:{path:"/rechargeorders",name:"rechargeorders",meta:{title:"野球卡订单"},component:function(){return n.e("chunk-35eeef5a").then(n.bind(null,"1e98"))}},cashorders:{path:"/cashorders",name:"cashorders",meta:{title:"现金充值订单"},component:function(){return n.e("chunk-de46333c").then(n.bind(null,"04db"))}},week:{path:"/week",name:"week",meta:{title:"日期"},component:function(){return n.e("chunk-146c7137").then(n.bind(null,"d968"))}},vipcourt:{path:"/vipcourt",name:"vipcourt",meta:{title:"VIP"},component:function(){return n.e("chunk-ecd56d56").then(n.bind(null,"234c"))}},t1:{path:"t1",name:"t1",meta:{title:"表格"},component:function(){return n.e("chunk-2d0aba9c").then(n.bind(null,"15df"))}},password:{path:"password",name:"password",meta:{title:"修改密码"},component:function(){return n.e("chunk-2d0c1074").then(n.bind(null,"43fe"))}},msg:{path:"msg",name:"msg",meta:{title:"通知消息"},component:function(){return n.e("chunk-2d229803").then(n.bind(null,"de5a"))}},userinfo:{path:"userinfo",name:"userinfo",meta:{title:"用户信息"},component:function(){return n.e("chunk-2d230cb3").then(n.bind(null,"ee96"))}}},u=function(){return new a["a"]({routes:r})},i=u();function h(){var e=u();i.matcher=e.matcher}t["b"]=i},ed08:function(e,t,n){"use strict";n.d(t,"b",(function(){return a})),n.d(t,"a",(function(){return o}));var c=n("a18c");function a(){localStorage.setItem("token",""),localStorage.setItem("userImg",""),localStorage.setItem("userName",""),Object(c["c"])()}var r="HWSouth";function o(e){return e?"".concat(r," - ").concat(e):"".concat(r)}}});
//# sourceMappingURL=app.f3caf996.js.map