<template>
  <view :class="[isDark ? 'dark' : 'light']">
    <!-- <cu-custom :bgColor="isDark ? 'bg-black' : 'bg-gradual-green'">
      <block slot="content">
        消息列表
      </block>
    </cu-custom> -->
    <view class="container">
      <block v-for="(item, index) in msgList" :key="index">
        <view @tap="detail()">
          <tui-list-cell :last="true">
            <view class="tui-msg-box">
              <image
                :src="item.avatar"
                class="tui-msg-pic"
                mode="widthFix"
              ></image>
              <view class="tui-msg-item">
                <view class="tui-msg-name">{{ item.nickname }}</view>
                <view class="tui-msg-content">{{ item.msg }}</view>
              </view>
            </view>
            <view
              class="tui-msg-right"
              :class="[item.level == 3 ? 'tui-right-dot' : '']"
            >
              <view class="tui-msg-time">{{ item.time }}</view>
              <tui-badge
                :type="item.level == 2 ? 'gray' : 'danger'"
                :dot="item.level == 3 ? true : false"
                v-if="item.msgNum > 0"
              >
                {{ item.level != 3 ? item.msgNum : "" }}
              </tui-badge>
            </view>
          </tui-list-cell>
        </view>
      </block>
      <view class="tui-safearea-bottom"></view>
    </view>
  </view>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import tuiIcon from "@/components/icon/icon.vue";
import tuiBadge from "@/components/badge/badge.vue";
import tuiListCell from "@/components/list-cell.vue";
@Component({
  components: { tuiIcon, tuiBadge, tuiListCell },
})
export default class abc extends Vue {
  current = 0;

  msgList = [
    {
      nickname: "系统提示",
      avatar: "https://dummyimage.com/64",
      msg: "队列【】您前方还有 12 人",
      msgNum: 0,
      time: "10:27",
      level: 1,
    },
    {
      nickname: "张新旺",
      avatar: "https://dummyimage.com/64",
      msg: "[图片]",
      msgNum: 0,
      time: "10:27",
      level: 1,
    },
    {
      nickname: "曾少敏",
      avatar: "https://dummyimage.com/64",
      msg: "对方已同意你的好友请求对方已同意你的好友请求",
      msgNum: 0,
      time: "10:27",
      level: 1,
    },
  ];

  get isDark() {
    return this.$store.state.others.isDark;
  }

  detail() {
    console.log(9);
    uni.navigateTo({
      url: "./chat",
    });
  }
}
</script>

<style lang="scss">
page {
  background: #f5f6fa;
}

.container {
  padding-bottom: 10px;
  min-height: 100%;
}

/*tabbar*/

.tui-tabbar {
  width: 100%;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 99999;
  background: #fff;
  height: 100upx;
  left: 0;
  bottom: 0;
  padding-bottom: env(safe-area-inset-bottom);
}

.tui-safearea-bottom {
  width: 100%;
  height: env(safe-area-inset-bottom);
}

.tui-tabbar::before {
  content: "";
  width: 100%;
  border-top: 1upx solid #d2d2d2;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.tui-tabbar-item {
  flex: 1;
  width: 25%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  font-size: 24upx;
  color: #666;
  height: 80upx;
}

.tui-ptop-4 {
  padding-top: 4upx;
}

.tui-scale {
  font-weight: bold;
  transform: scale(0.8);
  transform-origin: center 100%;
  line-height: 30upx;
}

.tui-item-active {
  color: #00c0fb !important;
}

/*tabbar*/

/*searchbox*/

.tui-searchbox {
  width: 100%;
  height: 100upx;
  padding: 0 30upx;
  box-sizing: border-box;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.tui-search-input {
  width: 100%;
  height: 72upx;
  background: #f5f6fa;
  border-radius: 36upx;
  font-size: 30upx;
  color: #a8abb8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tui-search-text {
  padding-left: 16upx;
}

/*searchbox*/

.tui-msg-box {
  display: flex;
  align-items: center;
}

.tui-msg-pic {
  width: 100upx;
  height: 100upx;
  border-radius: 50%;
  display: block;
  margin-right: 24upx;
}

.tui-msg-item {
  max-width: 500upx;
  min-height: 80upx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.tui-msg-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 34upx;
  line-height: 1;
  color: #262b3a;
}

.tui-msg-content {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 28upx;
  line-height: 1;
  color: #9397a4;
}

.tui-msg-right {
  max-width: 120upx;
  height: 88upx;
  margin-left: auto;
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}

.tui-msg-right.tui-right-dot {
  height: 76upx;
  padding-bottom: 10upx;
}

.tui-msg-time {
  width: 100%;
  font-size: 24upx;
  line-height: 24upx;
  color: #9397a4;
}

.tui-badge {
  width: auto;
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

  .tui-msg-name {
    color: #fff;
  }

  .tui-msg-content {
    color: rgb(142, 141, 145);
  }

  .tui-msg-time {
    color: rgb(133, 132, 137);
  }
}
</style>
