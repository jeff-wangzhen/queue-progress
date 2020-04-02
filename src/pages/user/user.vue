<template>
  <view :class="[isDark ? 'dark' : 'light']">
    <cu-custom :bgColor="isDark ? 'bg-black' : 'bg-gradual-green'">
      <block slot="content">
        我的
      </block>
    </cu-custom>
    <view class="tui-set-box container ">
      <view>
        <tui-list-cell
          padding="0"
          :line-left="false"
          :arrow="true"
          @tap="goPage('./user-info')"
        >
          <view class="tui-list-cell tui-info-box">
            <image src="https://dummyimage.com/64" class="tui-avatar" />
            <view>
              <!-- #ifdef MP-WEIXIN -->
              <button
                v-ifv-if="!logined"
                class=""
                open-type="getUserInfo"
                @getuserinfo="wxGetUserInfo"
                withCredentials="true"
              >
                登录
              </button>
              <!-- #endif -->
            </view>
          </view>
        </tui-list-cell>
      </view>
      <!-- <tui-list-cell padding="0" :lineLeft="false" :arrow="true" @click="href(2)">
      <view class="tui-list-cell">
        地址管理
      </view>
    </tui-list-cell>-->
      <view class="tui-mtop">
        <tui-list-cell
          padding="0"
          :line-left="false"
          :arrow="true"
          @tap="goPage('./created-queue-list')"
        >
          <view class="tui-list-cell">
            我创建的队列
          </view>
        </tui-list-cell>
        <tui-list-cell
          padding="0"
          :line-left="false"
          :arrow="true"
          @tap="goPage('./joined-queue-list')"
        >
          <view class="tui-list-cell">
            我加入的队列
          </view>
        </tui-list-cell>
        <tui-list-cell padding="0" :line-left="false" :arrow="true">
          <view class="tui-list-cell">
            消息提醒设置
          </view>
        </tui-list-cell>
        <tui-list-cell padding="0" :line-left="false" :arrow="false">
          <view class="tui-list-cell dark-select">
            <view class="text">
              夜间模式
            </view>
            <view class="switch">
              <async-switch :checked="checked" @change="onChangeSwitch" />
            </view>
          </view>
        </tui-list-cell>
      </view>
      <view class="tui-mtop">
        <tui-list-cell
          padding="0"
          :line-left="false"
          @tap="goPage('./about')"
          :arrow="true"
        >
          <view class="tui-list-cell">
            关于
          </view>
        </tui-list-cell>
        <tui-list-cell
          padding="0"
          :line-left="false"
          @tap="goPage('./feedback')"
          :arrow="true"
        >
          <view class="tui-list-cell">
            意见反馈
          </view>
        </tui-list-cell>
      </view>
      <view class="tui-exit">
        <button type="warn" plain="true" @click="logout">
          退出登录
        </button>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import tuiListCell from "@/components/list-cell.vue";
import asyncSwitch from "@/components/helang-asyncSwitch.vue";

@Component({
  components: { asyncSwitch, tuiListCell },
})
export default class extends Vue {
  loading = false;
  checked = this.$store.state.others.isDark;
  logined = false;
  get isDark(): boolean {
    return this.$store.state.others.isDark;
  }
  onChangeSwitch() {
    // console.log(this.$store.state.others);
    console.log(this.$store.state);
    this.$store.dispatch("others/changeDark", !this.$data.checked);
    this.$data.checked = !this.$data.checked;

    uni.setTabBarStyle({
      backgroundColor: this.$data.checked ? "#333" : "#eee",
    });
  }
  wxGetUserInfo(res: any) {
    if (!res.detail.iv) {
      uni.showToast({
        title: "您取消了授权,登录失败",
        icon: "none",
      });
      return false;
    }
    console.log("-------用户授权，并获取用户基本信息和加密数据------");
    console.log(res.detail);
  }
  logout() {
    console.log("logout");
  }
  goPage(url: string) {
    console.log(url);
    uni.navigateTo({
      url: url,
    });
  }
}
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
