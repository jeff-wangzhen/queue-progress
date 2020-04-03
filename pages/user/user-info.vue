<template>
  <view :class="[isDark ? 'dark' : 'light']">
    <cu-custom :bgColor="isDark ? 'bg-black' : 'bg-gradual-green'" isBack>
      <block slot="backText">返回</block>
      <block slot="content">个人信息</block>
    </cu-custom>
    <view class="tui-userinfo-box container">
      <tui-list-cell padding="0" :arrow="true">
        <view class="tui-list-cell">
          <view>头像</view>
          <image :src="user.avatar" class="tui-avatar"></image>
        </view>
      </tui-list-cell>
      <tui-list-cell padding="0" :hover="false">
        <view class="tui-list-cell tui-pr30">
          <view>用户id</view>
          <view class="tui-content" v-text="user.userId">ThorUI</view>
        </view>
      </tui-list-cell>
      <tui-list-cell padding="0" :arrow="true">
        <view class="tui-list-cell">
          <view>昵称</view>
          <view class="tui-content" v-text="user.name">echo.</view>
        </view>
      </tui-list-cell>
    </view>
  </view>
</template>

<script>
import tuiListCell from '@/components/list-cell/list-cell.vue';

export default {
  components: { tuiListCell },
  data() {
    return { user: this.$store.state.user };
  },

  computed: {
    isDark() {
      return this.$store.state.others.isDark;
    },
  },
};
</script>

<style lang="scss">
.tui-userinfo-box {
  padding-bottom: 20rpx;
  color: #333;
}

.tui-list-cell {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 60rpx 24rpx 30rpx;
  font-size: 30rpx;
}

.tui-pr30 {
  padding-right: 30rpx;
}

.tui-avatar {
  width: 100rpx;
  height: 100rpx;
  display: block;
  border-radius: 50%;
}

.tui-content {
  font-size: 26rpx;
  color: #666;
}
.dark {
  .tui-list-cell {
    color: $my-text-color-dark;
    background-color: $my-view-bg-color-dark;
  }
}
</style>
