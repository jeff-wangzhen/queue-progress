<template>
  <view class=" sketch " :class="isDark ? 'dark' : 'light'">
    <view v-for="i in num" :key="i" class="item-card">
      <view class="first-line">
        <view class="queue-id"></view>
        <view class="person-num"></view>
        <view class="start-time"><text></text></view>
      </view>

      <view class=""><view class="title"></view></view>
      <view class="description"></view>

      <view class="last-line">
        <view class="creator">
          <image class="avatar" src=""></image>

          <view class="name"></view>
        </view>

        <view class="action">
          <view class="buttons">
            <view class="button"></view>
            <view class="button button-join"></view>
          </view>
        </view>
      </view>
      <!-- <view class="create-time"></view> -->
    </view>
  </view>
</template>

<script>
export default {
  props: { num: { type: Number, default: 1 } },
  computed: {
    isDark() {
      return this.$store.state.others.isDark;
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../common/css/item-list-view.scss';
.name {
  width: 100rpx;
  height: 20px;
}
.light {
  .title,
  .description,
  .avatar,
  .name,
  .person-num,
  .start-time,
  .queue-id,
  .buttons .button,
  .create-time {
    animation: light-animation 1s ease-in-out infinite alternate;
  }
}

.dark {
  .sketch {
    background-color: #000;
  }
  .title,
  .description,
  .avatar,
  .name,
  .person-num,
  .start-time,
  .queue-id,
  .buttons .button,
  .create-time {
    animation: dark-animation 1s ease-in-out infinite alternate;
  }
}
@keyframes light-animation {
  from {
    background-color: $my-view-bg-color-light-from;
  }
  to {
    background-color: $my-view-bg-color-light-to;
  }
}
@keyframes dark-animation {
  from {
    background-color: #111;
  }
  to {
    background-color: #151515;
  }
}
</style>
