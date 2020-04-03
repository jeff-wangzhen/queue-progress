<template>
  <view :class="[isDark ? 'dark' : 'light']">
    <search-result-page
      keyword=""
      titleProp="首页"
      :scrollTopProp="scrollTop"
      :pullDownRefreshProp="pullDownRefreshCount"
      :reachBottomProp="reachBottomCount"
      v-if="PageCur == 'index'"
    ></search-result-page>
    <!-- <messages-page v-if="PageCur == 'message'"></messages-page>
    <user-page v-if="PageCur == 'user'"></user-page> -->
    <!-- <navigator url="../add-queue/index" open-type="navigate"> -->
    <navigator url="../add-queue/add-queue" open-type="navigate">
      <image src="../../static/images/add.png" class="image" />
    </navigator>
    <!-- <view class="cu-bar tabbar bg-white shadow foot">
      <view class="action" @tap="NavChange" data-cur="index">
        <view class="cuIcon-cu-image">
          <image
            :src="
              PageCur == 'index'
                ? '/static/images/tabbar/home-active.png'
                : '/static/images/tabbar/home.png'
            "
          ></image>
        </view>
        <view :class="PageCur == 'index' ? 'text-blue' : 'text-gray'">
          首页
        </view>
      </view>
      <view class="action" @tap="NavChange" data-cur="message">
        <view class="cuIcon-cu-image">
          <image
            :src="
              PageCur == 'message'
                ? '/static/images/tabbar/message-active.png'
                : '/static/images/tabbar/message.png'
            "
          ></image>
        </view>
        <view :class="PageCur == 'message' ? 'text-blue' : 'text-gray'">
          消息
        </view>
      </view>
      <view class="action" @tap="NavChange" data-cur="user">
        <view class="cuIcon-cu-image">
          <image
            :src="
              PageCur == 'user'
                ? '/static/images/tabbar/me-active.png'
                : '/static/images/tabbar/me.png'
            "
          ></image>
        </view>
        <view :class="PageCur == 'user' ? 'text-blue' : 'text-gray'">
          我的
        </view>
      </view>
    </view> -->
  </view>
</template>
<script>
import searchResultPage from '@/pages/search-result/search-result.vue';

// import messagesPage from "@/pages/message/message.vue";

// import userPage from "@/pages/user/user.vue";

export default {
  components: { searchResultPage },
  data() {
    return {
      scrollTop: 0,
      PageCur: 'index',
      pullDownRefreshCount: 0,
      reachBottomCount: 0,
    };
  },

  computed: {
    isDark() {
      return this.$store.state.others.isDark;
    },
  },
  onReady() {
    this.pullDownRefreshCount++;
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  onPullDownRefresh() {
    //console.log(this.$data);
    this.pullDownRefreshCount++;
    // searchResult.setItemList("top");
  },
  onReachBottom() {
    //console.log(this.$data, this.reachBottomCount);
    this.reachBottomCount++;
  },
  methods: {
    // NavChange(e) {
    //   //console.log(e);
    //   this.$data.PageCur = e.currentTarget.dataset.cur;
    // },
  },
};
</script>

<style lang="scss" scoped>
.cuIcon-cu-image {
  line-height: 1;
}
.image {
  position: fixed;
  bottom: 130rpx;
  width: 76rpx;
  height: 76rpx;
  right: 20rpx;
}
</style>
