<template>
  <view class="sketch">
    <view v-for="i in this.num" :key="i" class="item-card">
      <view class="first-line">
        <view class="queue-id"></view>
        <view class="person-num"></view>
        <view class="start-time">
          <text></text>
        </view>
      </view>

      <view class="">
        <view class="title"></view>
      </view>
      <view class="description"></view>

      <view class="last-line">
        <view class="creator">
          <image class="avatar" src=""></image>

          <view class="name"></view>
        </view>

        <view class="action">
          <button class="button"></button>
          <button class="button button-join"></button>
        </view>
      </view>
      <view class="create-time"></view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
@Component
export default class abc extends Vue {
  @Prop({ type: Number, default: 1 }) num!: number;
}
</script>
<style lang="scss" scoped>
@import "../common/css/item-list-view.scss";

.title,
.description,
.avatar,
.name,
.person-num,
.start-time,
.queue-id,
.button,
.create-time {
  animation: light-animation 1s ease-in-out infinite alternate;
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
  .button,
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
    background-color: $my-view-bg-color-dark-from;
  }
  to {
    background-color: $my-view-bg-color-dark-to;
  }
}
</style>
