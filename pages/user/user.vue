<template>
  <view :class="[isDark ? 'dark' : 'light']">
    <cu-custom :bgColor="isDark ? 'bg-black' : 'bg-gradual-green'">
      <block slot="content">我的</block>
    </cu-custom>
    <view class="tui-set-box container ">
      <view>
        <navigator
          url="/pages/user/user-info"
          animation-type="pop-out"
          animation-duration="300"
        >
          <tui-list-cell padding="0" :line-left="false" :arrow="true">
            <view class="tui-list-cell tui-info-box">
              <view v-if="!logined" @tap.stop="">
                <!-- #ifndef MP-WEIXIN -->
                <navigator
                  url="/pages/user/login"
                  animation-type="pop-out"
                  animation-duration="300"
                >
                  <button class="bottom" type="primary">登录</button>
                </navigator>
                <!-- #endif -->

                <!-- #ifdef MP-WEIXIN -->
                <button
                  type="primary"
                  open-type="getUserInfo"
                  @getuserinfo="wxGetUserInfo"
                  withCredentials="true"
                >
                  登录
                </button>
                <!-- #endif -->
              </view>
              <view v-else>
                <image :src="user.avatar" class="tui-avatar" />
                <text v-text="user.name"></text>
              </view>
            </view>
          </tui-list-cell>
        </navigator>
      </view>
      <!-- <tui-list-cell padding="0" :lineLeft="false" :arrow="true" @click="href(2)">
      <view class="tui-list-cell">
        地址管理
      </view>
    </tui-list-cell>-->
      <view class="tui-mtop">
        <navigator
          url="/pages/created-queue-list/created-queue-list"
          animation-type="pop-out"
          animation-duration="300"
        >
          <tui-list-cell padding="0" :line-left="false" :arrow="true">
            <view class="tui-list-cell">我创建的队列</view>
          </tui-list-cell>
        </navigator>
        <navigator
          url="/pages/joined-queue-list/joined-queue-list"
          animation-type="pop-out"
          animation-duration="300"
        >
          <tui-list-cell padding="0" :line-left="false" :arrow="true">
            <view class="tui-list-cell">我加入的队列</view>
          </tui-list-cell>
        </navigator>
        <navigator
          url="/pages/watched-queue-list/watched-queue-list"
          animation-type="pop-out"
          animation-duration="300"
        >
          <tui-list-cell padding="0" :line-left="false" :arrow="true">
            <view class="tui-list-cell">我关注的队列</view>
          </tui-list-cell>
        </navigator>
        <!-- <tui-list-cell padding="0" :line-left="false" :arrow="true">
          <view class="tui-list-cell">消息提醒设置</view>
        </tui-list-cell> -->
        <tui-list-cell padding="0" :line-left="false" :arrow="false">
          <view class="tui-list-cell dark-select" @tap.stop="onChangeSwitch">
            <view class="text">夜间模式</view>
            <view class="switch"><async-switch :checked="checked" /></view>
          </view>
        </tui-list-cell>
      </view>
      <view class="tui-mtop">
        <navigator
          url="/pages/feedback/feedback"
          animation-type="pop-out"
          animation-duration="300"
        >
          <tui-list-cell padding="0" :line-left="false" :arrow="true">
            <view class="tui-list-cell">意见反馈</view>
          </tui-list-cell>
        </navigator>
        <navigator
          url="/pages/about/about"
          animation-type="pop-out"
          animation-duration="300"
        >
          <tui-list-cell padding="0" :line-left="false" :arrow="true">
            <view class="tui-list-cell">关于</view>
          </tui-list-cell>
        </navigator>
      </view>
      <view class="tui-exit">
        <button v-if="logined" type="warn" plain="true" @click="logout">
          退出登录
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import tuiListCell from '@/components/list-cell/list-cell.vue';
import asyncSwitch from '@/components/helang-asyncSwitch/helang-asyncSwitch.vue';

export default {
  components: { asyncSwitch, tuiListCell },
  data() {
    return {
      user: this.$store.state.user,
      loading: false,
      checked: this.$store.state.others.isDark,
    };
  },
  computed: {
    logined() {
      return this.$store.state.user && this.$store.state.user.userId !== '';
    },
    isDark() {
      return this.$store.state.others.isDark;
    },
  },
  watch: {
    '$store.state.user.userId': {
      handler(val) {
        //console.log(34545345, val);
        this.user = this.$store.state.user;
      },
    },
  },
  onLoad() {
    //console.log(this.$store.state.user);
  },
  methods: {
    onChangeSwitch() {
      // //console.log(this.$store.state.others);
      //console.log(this.$store.state);
      this.$store.dispatch('others/changeDark', !this.$data.checked);
      this.$data.checked = !this.$data.checked;

      uni.setTabBarStyle({
        backgroundColor: this.$data.checked ? '#333' : '#eee',
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
    logout() {
      let that = this;
      let user = { userId: '', name: '', avatar: '', token: '' };
      this.$store.commit('user/logout', user);
      uni.setStorage({
        key: 'user',
        data: user,
        success: function() {
          //console.log('success', that.$store);
        },
      });
      //console.log('logout', this.$store.state.user);
    },
    goPage(url) {
      if (this.$store.state.user.userId === '') {
        uni.showToast({ title: '请登录', icon: 'none' });
        return;
      }
      //console.log(44444, url);
    },
  },
};
</script>

<style lang="scss">
.tui-set-box {
  padding-bottom: 20rpx;
}

.tui-list-cell {
  display: flex;
  align-items: center;
  padding: 24rpx 30rpx;
  font-size: 30rpx;
}

.tui-info-box {
  font-size: 34rpx;
}

.tui-avatar {
  width: 140rpx;
  height: 140rpx;
  margin-right: 20rpx;
  vertical-align: middle;
  border-radius: 50%;
}

.tui-mtop {
  margin-top: 20rpx;
}

.tui-exit {
  padding: 100rpx 24rpx;
}
.dark-select {
  width: 100%;
  /* display: flex; */
  justify-content: space-between;
}
.dark {
  background: $my-bg-color-dark;
  .container {
    min-height: calc(100vh - 50px);
    background: $my-bg-color-dark;
  }
  page {
    background: $my-bg-color-dark;
  }
  .tui-list-cell {
    background-color: $my-view-bg-color-dark;
  }
  .tui-list-cell-hover {
    background-color: $my-view-bg-color-dark-hover;
  }
}
</style>
