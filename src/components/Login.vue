<template>
  <div class="login-vue" :style="bg">
    <div class="container">
      <p class="title">WELCOME</p>
      <div class="input-c">
        <a-input ref="userNameInput" v-model="account" placeholder="Basic usage">
          <a-icon slot="prefix" type="user" />
        </a-input>
        <p class="error">{{ accountError }}</p>
      </div>
      <div class="input-c">
        <a-input-password v-model="pwd" placeholder="input password" />
        <p class="error">{{ pwdError }}</p>
      </div>
      <a-button class="submit" type="primary" @click="submit">登录</a-button>
    </div>
  </div>
</template>

<script>
import vue from "../main"

export default {
  name: "login",
  data() {
    return {
      account: "",
      pwd: "",
      accountError: "",
      pwdError: "",
      isShowLoading: false,
      bg: {}
    };
  },
  created() {
    this.bg.backgroundImage = "url(" + require("../assets/imgs/bg0" + new Date().getDay() + ".jpg") + ")";
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    verifyAccount() {
      // if (this.account !== "admin") {
      //   this.accountError = "账号为admin";
      // } else {
      //   this.accountError = "";
      // }
    },
    verifyPwd() {
      // if (this.pwd !== "admin") {
      //   this.pwdError = "密码错误";
      // } else {
      //   this.pwdError = "";
      // }
    },
    register() {
      console.log(this.account);
      console.log(this.pwd);
      // this.$app
      //   .auth()
      //   .signUpWithEmailAndPassword(this.account, this.pwd)
      //   .then((res) => {
      //     console.log(res);
      //     // 发送验证邮件成功
      //   });
    },
    forgetPwd() { },
    submit() {
      vue.$app
        .auth()
        .signInWithEmailAndPassword(this.account, this.pwd)
        .then((loginState) => {
          console.log("wzzz", loginState)
          // this.$router.push({ path: "/" });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
};
</script>

<style>
.login-vue {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.login-vue .container {
  background: rgba(255, 255, 255, 0.5);
  width: 350px;
  text-align: center;
  border-radius: 10px;
  padding: 30px;
}

.login-vue .ivu-input {
  background-color: transparent;
  color: #fff;
  outline: #fff;
  border-color: #fff;
}

.login-vue ::-webkit-input-placeholder {
  /* WebKit, Blink, Edge */
  color: rgba(255, 255, 255, 0.8);
}

.login-vue :-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: rgba(255, 255, 255, 0.8);
}

.login-vue ::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: rgba(255, 255, 255, 0.8);
}

.login-vue :-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: rgba(255, 255, 255, 0.8);
}

.login-vue .title {
  font-size: 16px;
  margin-bottom: 20px;
}

.login-vue .input-c {
  margin: auto;
  width: 220px;
}

.login-vue .error {
  color: red;
  text-align: left;
  margin: 5px auto;
  font-size: 12px;
  padding-left: 30px;
  height: 20px;
}

.login-vue .submit {
  width: 200px;
}

.login-vue .account {
  margin-top: 30px;
}

.login-vue .account span {
  cursor: pointer;
}

.login-vue .ivu-icon {
  color: #eee;
}

.login-vue .ivu-icon-ios-close-circle {
  color: #777;
}
</style>
