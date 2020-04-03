<template>
  <view :class="[isDark ? 'dark' : 'light']">
    <cu-custom :bgColor="isDark ? 'bg-black' : 'bg-gradual-green'" isBack>
      <block slot="backText">返回</block>
      <block slot="content">队列成员管理</block>
    </cu-custom>
    <LoadProgress
      v-if="loadProgressValue < 100"
      :loadProgress="loadProgressValue"
    ></LoadProgress>
    <view v-if="reload" style="text-align: center;margin: 20px 0;">
      左滑条块操作
    </view>

    <view v-if="!reload && current.userId" style="margin: 10px 0;">
      <view class="item">
        <view class="info">
          <image class="avatar" :src="current.avatar"></image>
          <view class="name" v-text="current.name"></view>
        </view>
        <view
          class="number"
          v-text="'已处理 ' + computeTime(current.doingTime) + ' 分钟'"
        ></view>
      </view>
    </view>
    <view v-if="!reload" style="text-align: center;margin: 20px 0;">
      <button v-if="doing" class="cu-btn line-green text-blue" @tap="end">
        结束
      </button>
      <button
        v-if="!doing && personList.length > 0"
        class="cu-btn line-green text-green"
        @tap="callNumber"
      >
        下一位
      </button>
    </view>

    <uni-swipe-action>
      <uni-swipe-action-item
        v-for="(item, index) in personList"
        :options="basicActions"
        :key="item.queueId"
        @click="handlerButton($event, item)"
      >
        <view class="item">
          <view class="info">
            <image class="avatar" :src="item.avatar"></image>
            <view class="name" v-text="item.name"></view>
          </view>
          <view class="number" v-text="'第 ' + item.number + ' 号'"></view>
        </view>
      </uni-swipe-action-item>
    </uni-swipe-action>

    <view class="none" v-if="personList.length === 0 && !reload">队列为空</view>
  </view>
</template>
<script>
import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue';
import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue';
import LoadProgress from '@/components/load-progress/load-progress.vue';

export default {
  components: { uniSwipeAction, uniSwipeActionItem, LoadProgress },
  data() {
    return {
      queueId: 0,
      loadModal: false,
      loadProgressValue: 0,
      personList: [],
      current: {},
      status: 'more',
      reload: false,
      doing: false,
      basicActions: [
        {
          text: '移除',
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
      return this.$store.state.others.isDark;
    },
  },
  watch: {
    '$store.state.user.userId': {
      handler() {
        this.loadProgress();
        this.reload = true;
        this.setPersonList('TOP');
      },
    },
  },
  created() {},
  mounted() {
    this.loadProgress();
    this.reload = true;
    this.setPersonList('TOP');
  },
  onLoad(e) {
    this.queueId = parseInt(e.queueId, 10);
  },

  onPullDownRefresh() {
    //console.log('下拉刷新');
    this.reload = true;
    this.setPersonList('TOP');
  },
  onReachBottom() {
    this.setPersonList('BOTTOM');
  },
  methods: {
    computeTime(time) {
      return Math.floor(new Date(Date.now() - new Date(time)) / 60000);
    },
    end() {
      let that = this;
      uni.showLoading({ title: '加载中' });
      uniCloud
        .callFunction({
          name: 'joinQueue',
          data: {
            joinId: that.current.userId,
            userId: that.$store.state.user.userId,
            queueId: that.queueId,
            type: 'LEAVE',
            token: that.$store.state.user.token,
          },
        })
        .then(res => {
          uni.hideLoading();
          //console.log(res);
          if (res.result.code === 0) {
            uni.showToast({
              title: '操作成功',
              icon: 'success',
            });
            that.current = {};
            that.doing = false;
          } else {
            uni.showToast({
              title: res.result.msg,
              icon: 'none',
            });
          }
        });
    },
    callNumber() {
      let that = this;
      uni.showLoading({ title: '加载中' });
      uniCloud
        .callFunction({
          name: 'joinQueue',
          data: {
            joinId: that.personList[0].userId,
            userId: that.$store.state.user.userId,
            queueId: that.queueId,
            type: 'DOING',
            token: that.$store.state.user.token,
          },
        })
        .then(res => {
          uni.hideLoading();
          //console.log(res);
          if (res.result.code === 0) {
            uni.showToast({
              title: '已叫号',
              icon: 'success',
            });
            that.doing = true;
            that.loadProgress();
            that.reload = true;
            that.setPersonList('TOP');
          } else {
            uni.showToast({
              title: res.result.msg,
              icon: 'none',
            });
          }
        });
    },
    handlerButton(e, item) {
      let that = this;
      let index = e.index;

      //console.log(index, item);
      if (index === 0) {
        uni.showLoading({ title: '加载中' });
        uniCloud
          .callFunction({
            name: 'joinQueue',
            data: {
              joinId: item.userId,
              queueId: this.queueId,
              userId: that.$store.state.user.userId,
              token: that.$store.state.user.token,
              type: 'DELETE',
            },
          })
          .then(res => {
            //console.log(res);
            if (res.result.code === 0) {
              uni.hideLoading();
              uni.showToast({
                title: '操作成功',
                icon: 'success',
              });
              that.personList = that.personList.filter(
                value => value && value.userId !== item.userId
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

    async getQueuePersonList(queryParams) {
      return await uniCloud.callFunction({
        name: 'getQueuePerson',
        data: queryParams,
      });
    },
    setPersonList(type) {
      let that = this;
      if (this.status === 'NO_MORE') return;
      this.status = 'LOADING';
      let lastTime = 0;
      if (type === 'BOTTOM' && that.personList.length > 0) {
        lastTime = that.personList[that.personList.length - 1].time;
      }

      let params = {
        queueId: this.queueId,
        userId: this.$store.state.user.userId,
        length: 5,
        token: this.$store.state.user.token,
        lastTime,
      };

      if (this.reload) {
        that.personList = [];
      }
      //console.log('params', params);
      that.personList = [];
      this.getQueuePersonList(params).then(res => {
        uni.stopPullDownRefresh();
        //console.log('getdata ', res);
        that.showSkeleton = false;
        that.status = res.result.status;
        if (res.result.code !== 0) {
          if (res.result.msg) {
            uni.showToast({
              title: res.result.msg,
              icon: 'none',
            });
          }
          return;
        }
        that.personList = res.result.data;
        that.current = res.result.current;
        //console.log('per', that.personList);

        //console.log(that.personList);
        that.reload = false;
        this.loadProgressValue = 100;
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
.info {
  max-width: 270rpx;
}
.avatar {
  margin-right: 30rpx;
  vertical-align: middle;
  border-radius: 50%;
  max-width: 100rpx;
  max-height: 100rpx;
  line-height: 100rpx;
}
.name {
  display: inline-block;
}
.name,
.number {
  line-height: 100rpx;
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
