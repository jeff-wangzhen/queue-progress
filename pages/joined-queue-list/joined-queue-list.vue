<template>
  <view :class="[isDark ? 'dark' : 'light']">
    <cu-custom :bgColor="isDark ? 'bg-black' : 'bg-gradual-green'" isBack>
      <block slot="backText">返回</block>
      <block slot="content">我加入的队列</block>
    </cu-custom>
    <LoadProgress
      v-if="loadProgressValue < 100"
      :loadProgress="loadProgressValue"
    ></LoadProgress>
    <view v-if="reload" style="text-align: center;margin: 20px 0;">
      左滑条块操作
    </view>

    <uni-swipe-action>
      <uni-swipe-action-item
        v-for="(item, index) in itemList"
        :options="basicActions"
        :key="item.queueId"
        @click="handlerButton($event, item)"
      >
        <view class="item" @tap.stop="goPage(item)">
          <view v-text="showState(item)"></view>
          <view class="title" v-text="item.title"></view>
          <view v-if="item.joinState === 'LEAVE'">已完成</view>
          <view v-else>
            <view v-if="item.joinState === 'DOING'">正在处理</view>
            <view v-else v-text="'前面有 ' + (item.rank - 1) + ' 人'"></view>
          </view>
        </view>
      </uni-swipe-action-item>
    </uni-swipe-action>
    <!-- <view class="" v-for="item in itemList" :key="item.queueId">
      <tui-swipe-action
        :actions="basicActions"
        @click="handlerButton"
        :params="item"
      >
        <template v-slot:content>
          
        </template>
      </tui-swipe-action>
    </view> -->
    <view class="none" v-if="itemList.length === 0 && !reload">无记录</view>
    <view v-if="itemList.length > 0" @tap.stop="loadMore">
      <uni-load-more :status="status" />
    </view>
  </view>
</template>
<script>
import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue';
import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue';
import LoadProgress from '@/components/load-progress/load-progress.vue';

import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
export default {
  components: { uniSwipeAction, uniSwipeActionItem, LoadProgress, uniLoadMore },
  data() {
    return {
      loadModal: false,
      loadProgressValue: 0,
      itemList: [],
      status: 'more',
      reload: false,
      basicActions: [
        {
          text: '退出',
          style: {
            color: '#fff',
            backgroundColor: '#dd524d',
          },
        },
      ],
    };
  },

  computed: {
    isDark() {
      // goPage(9);
      return this.$store.state.others.isDark;
    },
  },
  watch: {
    '$store.state.user.userId': {
      handler() {
        this.loadProgress();
        this.reload = true;
        this.setItemList('TOP');
      },
    },
  },

  mounted() {
    this.loadProgress();
    this.reload = true;
    this.setItemList('TOP');
  },

  onPullDownRefresh() {
    //console.log('下拉刷新');
    this.reload = true;
    this.setItemList('TOP');
  },
  onReachBottom() {
    this.loadMore();
  },
  methods: {
    loadMore() {
      if (this.status === 'NO_MORE') return;

      //console.log('触底加载');
      this.setItemList('BOTTOM');
    },
    showState(item) {
      if (item.queueState === 'STOP') {
        return '停止';
      }
      if (item.queueState === 'DELETED') {
        return '已删除';
      }
      if (item.queueState === 'OK') {
        if (item.number === item.maxPeopleCount) {
          return '满号';
        }
        if (item.startTime > Date.now()) {
          return '未开始';
        }
        return '正常';
      }
    },
    goPage(item) {
      uni.navigateTo({
        url: '../queue-information/queue-information?queueId=' + item.queueId,
      });
    },
    handlerButton(e, item) {
      let that = this;
      let index = e.index;
      //console.log(index, item);
      if (item.queueState === 'DELETED') {
        uni.showModal({
          showCancel: false,
          content: '该队列已被删除，无法操作',
        });
      }
      if (index === 0) {
        uni.showModal({
          content: '您确定退出该队列吗？',
          success(res) {
            if (res.confirm) {
              uni.showLoading({ title: '加载中' });
              uniCloud
                .callFunction({
                  name: 'joinQueue',
                  data: {
                    queueId: parseInt(item.queueId),
                    userId: that.$store.state.user.userId,
                    token: that.$store.state.user.token,
                    type: 'QUIT',
                  },
                })
                .then(res => {
                  uni.hideLoading();
                  if (res.result.code === 0) {
                    uni.showToast({
                      title: '操作成功',
                      icon: 'success',
                    });
                    that.itemList = that.itemList.filter(
                      value => value.queueId !== item.queueId
                    );
                  } else {
                    uni.showToast({
                      title: res.result.msg,
                      icon: 'none',
                    });
                  }
                });
            }
          },
        });
      }
    },

    setItemList(type) {
      let that = this;
      this.status = 'LOADING';
      let params = {
        type: 'GETJOINED',
        userId: this.$store.state.user.userId,
        length: 5,
        token: this.$store.state.user.token,
      };
      if (type === 'BOTTOM') {
        params.lastTime =
          this.itemList.length > 0
            ? this.itemList[this.itemList.length - 1].time
            : Date.now();
      }
      if (this.reload) {
        that.itemList = [];
      }
      //console.log('params', params);

      this.$getQueueList(params).then(res => {
        uni.stopPullDownRefresh();
        //console.log('getdata ', res);
        that.showSkeleton = false;
        that.reload = false;
        that.loadProgressValue = 100;
        that.status = res.result && res.result.hasMore ? 'MORE' : 'NO_MORE';
        if (res.result.code !== 0) {
          if (res.result.msg) {
            uni.showToast({
              title: res.result.msg,
              icon: 'none',
            });
          }
          return;
        }

        that.itemList = that.itemList.concat(res.result.data);

        //console.log(that.itemList);
      });
    },
    loadProgress() {
      this.loadProgressValue = this.loadProgressValue + 3;
      if (this.loadProgressValue < 90) {
        setTimeout(() => {
          this.loadProgress();
        }, 100);
      }
    },
  },
};
</script>
<style lang="scss">
.tui-swipeout-wrap {
  margin: 10px 0;
  background-color: transparent;
}
.item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 10px;
  background: $my-bg-color-light;
}
.title {
  overflow: hidden;
  max-width: 70%;
  text-overflow: ellipsis;
  padding-left: 1em;
}
.none {
  height: 200rpx;
  line-height: 200rpx;
  text-align: center;
}
.dark {
  .item {
    background-color: $my-view-bg-color-dark;
  }
}
</style>
