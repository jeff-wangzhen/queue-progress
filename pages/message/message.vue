<template>
  <view :class="[isDark ? 'dark' : 'light']">
    <cu-custom :bgColor="isDark ? 'bg-black' : 'bg-gradual-green'">
      <block slot="content">消息列表</block>
    </cu-custom>
    <view class="container">
      <view v-if="$store.state.user.userId !== ''">
        <view v-if="msgList.length > 0">
          <block v-for="(item, index) in msgList" :key="index">
            <view
              @tap="goPage(item)"
              :data-itemid="index"
              :data-fromid="item.fromUser && item.fromUser[0].userId"
            >
              <tui-list-cell class="tui-list-cell" :last="true">
                <view class="tui-msg-box">
                  <image
                    :src="item.fromUser && item.fromUser[0].avatar"
                    class="tui-msg-pic"
                    mode="widthFix"
                  ></image>
                  <view class="tui-msg-item">
                    <view
                      class="tui-msg-name"
                      v-text="item.fromUser && item.fromUser[0].name"
                    ></view>
                    <view class="tui-msg-content" v-text="item.content"></view>
                  </view>
                </view>
                <view
                  class="tui-msg-right"
                  :class="[item.level == 3 ? 'tui-right-dot' : '']"
                >
                  <view
                    class="tui-msg-time"
                    v-text="formatTime(item.time)"
                  ></view>
                  <tui-badge
                    type="danger"
                    :dot="true"
                    v-if="!item.read"
                  ></tui-badge>
                </view>
              </tui-list-cell>
            </view>
          </block>
        </view>
        <view v-else class="none">暂无消息</view>
      </view>
      <view v-else class="none">请登录</view>
      <view class="tui-safearea-bottom"></view>
    </view>
  </view>
</template>
<script>
import tuiIcon from '@/components/icon/icon.vue';
import tuiBadge from '@/components/badge/badge.vue';
import tuiListCell from '@/components/list-cell/list-cell.vue';

export default {
  components: { tuiIcon, tuiBadge, tuiListCell },
  data() {
    return {
      current: 0,
      user: this.$store.state.user,
      msgList: [],
    };
  },
  computed: {
    isDark() {
      return this.$store.state.others.isDark;
    },
  },
  watch: {
    msgList: {
      handler(val) {
        //console.log(34534,val)
        this.msgList = val;
      },
      deep: true,
    },
    '$store.state.user.userId': {
      handler() {
        this.setItem();
      },
    },
  },

  mounted() {
    this.setItem();
  },
  onPullDownRefresh() {
    this.setItem();
  },
  methods: {
    formatTime(timestamp) {
      function checkTime(i) {
        if (i < 10) {
          i = '0' + i;
        }
        return i;
      }
      //console.log(999, timestamp);
      if (!timestamp) return '';
      let d = new Date(timestamp);
      return (
        checkTime(d.getMonth() + 1) +
        '-' +
        checkTime(d.getDate()) +
        ' ' +
        checkTime(d.getHours()) +
        ':' +
        checkTime(d.getMinutes())
      );
    },
    async setItem() {
      let that = this;
      uni.showLoading({ title: '加载中' });
      uniCloud
        .callFunction({
          name: 'getMessage',
          data: {
            userId: that.$store.state.user.userId,
            type: 'GETLIST',
            token: that.$store.state.user.token,
          },
        })
        .then(res => {
          uni.hideLoading();
          uni.stopPullDownRefresh();
          //console.log(res);
          if (res.result.code !== 0) {
            if (res.result.msg) {
              uni.showToast({
                title: res.result.msg,
                icon: 'none',
              });
            }
            return;
          }

          that.msgList = res.result.data;
        });
    },
    goPage(item) {
      // //console.log(e);
      item.read = true;
      this.msgList[0].read = true;
      //console.log(4565454,this.msgList)
      uni.navigateTo({
        url: '/pages/chat/chat?fromId=' + item.fromId,
      });
    },
  },
};
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
  content: '';
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
.none {
  height: 200rpx;
  line-height: 200rpx;
  text-align: center;
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
