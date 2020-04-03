<template>
  <view :class="[isDark ? 'dark' : 'light']">
    <cu-custom :bgColor="isDark ? 'bg-black' : 'bg-gradual-green'" isBack>
      <block slot="backText">返回</block>
      <block slot="content">我创建的队列</block>
    </cu-custom>
    <LoadProgress
      v-if="loadProgressValue < 100"
      :loadProgress="loadProgressValue"
    ></LoadProgress>
    <view v-if="reload" style="text-align: center;margin: 20px 0;">
      左滑条块操作
    </view>
    <!-- <view class="" v-for="item in itemList" :key="item.queueId"> -->
    <uni-swipe-action>
      <uni-swipe-action-item
        v-for="item in itemList"
        :options="getActions(item.queueState)"
        :key="item.queueId"
        @click="handlerButton($event, item)"
      >
        <view class="item" @tap.stop="goPage(item)">
          <view v-text="showState(item)"></view>
          <view class="title" v-text="item.title"></view>
          <view
            style="text-align: right;"
            v-text="(item.personNum || 0) + ' 人'"
          ></view>
        </view>
      </uni-swipe-action-item>
    </uni-swipe-action>
    <!-- </view> -->
    <view
      class="none"
      v-if="
        (itemList.length === 0 && !reload) || $store.state.user.userId === ''
      "
    >
      无记录
    </view>
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
      status: 'MORE',
      reload: false,
      basicActions: [
        {
          text: '修改',
          style: { color: '#fff', backgroundColor: '#4cd964' },
        },
        {
          text: '成员管理',
          style: { color: '#fff', backgroundColor: '#007aff' },
        },
        {
          text: '删除',
          style: { color: '#fff', backgroundColor: '#dd524d' },
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
      this.setItemList('bottom');
    },
    goPage(item) {
      uni.navigateTo({
        url: '../queue-information/queue-information?queueId=' + item.queueId,
      });
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
    getActions(state) {
      let actionsTemp = JSON.parse(JSON.stringify(this.basicActions));
      if (state === 'OK') {
        actionsTemp.unshift({
          text: '停止',
          style: { color: '#fff', backgroundColor: '#f0ad4e' },
        });
      } else {
        actionsTemp.unshift({
          text: '继续',
          style: { color: '#fff', backgroundColor: '#f0ad4e' },
        });
      }

      return actionsTemp;
    },
    async updateState(item, state) {
      let that = this;
      uni.showLoading({ title: '加载中' });
      //console.log('3453454', state);
      return uniCloud
        .callFunction({
          name: 'changeQueueState',
          data: {
            queueId: parseInt(item.queueId),
            userId: that.$store.state.user.userId,
            token: that.$store.state.user.token,
            state: state,
          },
        })
        .then(res => {
          uni.hideLoading();
          if (res.result.code === 0) {
            that.itemList.map(temp => {
              if (temp.queueId === item.queueId) {
                temp.queueState = state;
                //console.log(that.itemList);

                uni.showToast({
                  title: '操作成功',
                  icon: 'success',
                });
              }
            });
          }
          return new Promise(function(resolve, reject) {
            //console.log('res', res);
            resolve(res);
          });
        });
    },

    handlerButton(e, item) {
      let that = this;
      let index = e.index;
      //console.log(index, item);
      if (index === 0) {
        if (item.queueState === 'OK') {
          this.updateState(item, 'STOP').then(res => {
            //console.log('handle', res);
          });
        } else {
          this.updateState(item, 'OK').then(res => {
            //console.log('handle', res);
          });
        }
      } else if (index === 1) {
        uni.navigateTo({
          url: '/pages/add-queue/add-queue?queueId=' + item.queueId,
        });
      } else if (index === 2) {
        uni.navigateTo({
          url: '/pages/manager-queue/manager-queue?queueId=' + item.queueId,
        });
      } else if (index === 3) {
        uni.showModal({
          content: '是否确认删除该队列？',
          success(res) {
            if (res.confirm) {
              that.updateState(item, 'DELETED').then(res => {
                that.itemList = that.itemList.filter(
                  value => value.queueId !== item.queueId
                );
              });
            }
          },
        });
      }
    },
    setItemList(type) {
      let that = this;
      let params = {
        type: 'GETCREATED',
        userId: this.$store.state.user.userId,
        length: 5,
        token: this.$store.state.user.token,
      };
      if (type === 'bottom') {
        params.lastId =
          this.itemList.length > 0
            ? this.itemList[this.itemList.length - 1].queueId
            : Date.now();
      }
      if (this.reload) {
        that.itemList = [];
      }
      //console.log('params', params);
      that.status = 'LOADING';
      this.$getQueueList(params).then(res => {
        uni.stopPullDownRefresh();
        //console.log('getdata9 ', res);
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
        // uni.showToast({
        //   title: "操作成功",
        //   icon: "success",
        //   duration: 1000,
        // });
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
