<template>
  <view :class="[isDark ? 'dark' : 'light']">
    <cu-custom :bgColor="isDark ? 'bg-black' : 'bg-gradual-green'" isBack>
      <block slot="backText">返回</block>
      <block slot="content">登录注册</block>
    </cu-custom>
    <view class="container">
      <view class="title"><text>登录</text></view>

      <view class="form">
        <input type="text" value="" placeholder="用户ID" v-model="userId" />
        <input
          type="text"
          value=""
          placeholder="密码"
          password="true"
          v-model="password"
        />
        <button type="primary" @click="signIn">登录</button>
        <button type="primary" @click="signUp">注册</button>
        <!-- #ifdef MP-WEIXIN -->
        <button
          type="primary"
          open-type="getUserInfo"
          @getuserinfo="wxGetUserInfo"
          withCredentials="true"
        >
          微信登录
        </button>
        <!-- #endif -->
        <!-- <button type="primary" @click="validateToken">token验证</button> -->
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userId: this.$store.state.user.userId || '',
      password: this.$store.state.user.password || '',
    };
  },
  computed: {
    isDark() {
      return this.$store.state.others.isDark;
    },
  },
  methods: {
    signUp() {
      let that = this;
      const { userId, password } = this;
      if (userId.length < 6 || password.length < 6) {
        uni.showModal({
          content: '用户名密码长度均不能小于6',
          showCancel: false,
        });
        return;
      }
      uni.showLoading({
        title: '注册中...',
      });
      uniCloud
        .callFunction({
          name: 'signUp',
          data: {
            userId,
            password,
          },
        })
        .then(res => {
          //console.log(res);
          uni.hideLoading();
          if (res.result.status !== 0) {
            return Promise.reject(new Error(res.result.msg));
          }
          uni.setStorageSync('token', res.result.token);
          uni.showToast({
            title: '注册成功',
          });
          that.$setUser(res.result.user);
          uni.navigateBack();
        })
        .catch(err => {
          //console.log(err);
          uni.hideLoading();
          uni.showModal({
            content: '注册失败，' + err.message,
            showCancel: false,
          });
        });
    },
    signIn() {
      let that = this;
      const { userId, password } = this;
      if (userId.length < 6 || password.length < 6) {
        uni.showModal({
          content: '用户名密码长度均不能小于6',
          showCancel: false,
        });
        return;
      }
      uni.showLoading({
        title: '登录中...',
      });
      uniCloud
        .callFunction({
          name: 'signIn',
          data: {
            userId,
            password,
          },
        })
        .then(res => {
          //console.log(res);
          uni.hideLoading();
          if (res.result.status !== 0) {
            return Promise.reject(new Error(res.result.msg));
          }
          uni.setStorageSync('token', res.result.token);
          uni.showToast({
            title: '登录成功',
          });
          that.$setUser(res.result.user);
          uni.navigateBack();
        })
        .catch(err => {
          // console.log(err);
          uni.hideLoading();
          uni.showModal({
            content: '登录失败，' + err.message,
            showCancel: false,
          });
        });
    },
    // #ifdef MP-WEIXIN
    getCode() {
      return new Promise((resolve, reject) => {
        uni.login({
          provider: 'weixin',
          success(e) {
            if (e.code) {
              resolve(e.code);
            } else {
              reject(new Error('微信登录失败'));
            }
          },
          fail(e) {
            reject(new Error('微信登录失败'));
          },
        });
      });
    },
    wxGetUserInfo(res) {
      if (!res.detail.iv) {
        uni.showToast({
          title: '登录失败',
          icon: 'none',
        });
        return false;
      }
      //console.log('wxGetUserInfo', res);

      let that = this;
      let user = {};
      let infoRes = res.detail;
      //console.log('uni.getUserInfo', infoRes);
      user.name = infoRes.userInfo.nickName;
      user.avatar = infoRes.userInfo.avatarUrl;
      uni.showLoading({ title: '加载中' });
      that
        .getCode()
        .then(code => {
          //console.log('code', code);
          return uniCloud.callFunction({
            name: 'login',
            data: {
              code,
              user,
            },
          });
        })
        .then(res => {
          uni.hideLoading();
          //console.log(res);
          if (res.result.status !== 0) {
            return Promise.reject(new Error(res.result.msg));
          }

          user.userId = res.result.userInfo.openid;
          user.token = res.result.token;
          that.$setUser(user);
          uni.showToast({
            title: '登录成功',
            duration: 1000,
          });
        })
        .catch(err => {
          uni.hideLoading();
          //console.log(err);
          uni.showToast({
            title: '出现错误，请稍后再试.' + err.message,
            duration: 2000,
          });
        });
    },
    // #endif
    validateToken() {
      uni.showLoading({ title: '加载中' });
      uniCloud
        .callFunction({
          name: 'validateToken',
          data: {
            token: this.$store.state.user.token, // token最好不要每次从storage内取，本示例为了简化演示代码才这么写
          },
        })
        .then(res => {
          //console.log(res);
          uni.hideLoading();
          uni.showModal({
            content: res.result.msg,
            showCancel: false,
          });
        })
        .catch(err => {
          uni.showModal({
            content: '请求云函数发生错误，' + err.message,
            showCancel: false,
          });
        });
    },
  },
};
</script>

<style>
.container {
  padding: 30px;
}

.title {
  text-align: center;
  font-size: 20px;
  padding: 20px 0px;
}

.desc {
  padding: 10px 0px;
  font-size: 14px;
  line-height: 22px;
  color: #999999;
}

.form input {
  height: 40px;
  border: solid 1px #dddddd;
  text-indent: 10px;
}

.form input,
.form button {
  width: 100%;
  margin-bottom: 10px;
}
</style>
