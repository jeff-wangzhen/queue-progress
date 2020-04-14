<template>
  <view :class="[isDark ? 'dark' : 'light']">
    <cu-custom :bgColor="isDark ? 'bg-black' : 'bg-gradual-green'" isBack>
      <block slot="backText">返回</block>
      <block slot="content">审核</block>
    </cu-custom>
    <LoadProgress :loadProgress="loadProgressValue"></LoadProgress>
    <view class="container">
      <view class="">
        <view v-for="questionItem in questions" :key="questionItem.queueId">
          <view class="cu-form-group" v-text="questionItem.question"></view>

          <textarea
            class="textarea"
            maxlength="1000"
            v-model="questionItem.answer"
            placeholder="请输入"
            disabled
          ></textarea>
        </view>
        <view v-if="loadProgressValue >= 100">
          <view class="actions" v-if="state === 'PENDING'">
            <button class="cu-btn round button bg-cyan" @tap.stop="resolve">
              通过
            </button>
            <button class="cu-btn round button bg-blue" @tap.stop="reject">
              拒绝
            </button>
          </view>
          <view v-if="state === 'RESOLVED'" class="not-pending">已批准</view>
          <view v-if="state === 'REJECTED'" class="not-pending">已拒绝</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import LoadProgress from '@/components/load-progress/load-progress.vue';
export default {
  components: { LoadProgress },
  data() {
    return {
      user: this.$store.state.user,
      state: '',
      answerId: '',
      joinId: '',
      loadProgressValue: 0,
      questions: [],
      joinNotifyNumber: 0,
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
        this.loadData();
      },
    },
  },
  onLoad(e) {
    this.answerId = e.answerId;
    this.loadProgress();
    this.loadData();
  },
  methods: {
    async loadData() {
      let that = this;
      await uniCloud
        .callFunction({
          name: 'getQuestionAnswer',
          data: {
            answerId: that.answerId,
            userId: that.$store.state.user.userId,
            token: that.$store.state.user.token,
          },
        })
        .then(res => {
          that.loadProgressValue = 100;
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

          that.questions = res.result.data[0].answers;
          that.joinId = res.result.data[0].userId;
          that.queueId = res.result.data[0].queueId;
          that.state = res.result.data[0].state;
          that.loadProgressValue = 100;
          that.joinNotifyNumber = res.result.data[0].joinNotifyNumber;
          //console.log(that.questions, that.state === 'REJECTED');
        });
    },
    async resolve() {
      let that = this;
      uni.showLoading({ title: '加载中' });
      await uniCloud
        .callFunction({
          name: 'joinQueue',
          data: {
            answerId: that.answerId,
            queueId: that.queueId,
            userId: that.$store.state.user.userId,
            token: that.$store.state.user.token,
            joinId: that.joinId,
            decision: 'OK',
            type: 'ADD',
            joinNotifyNumber: that.joinNotifyNumber,
          },
        })
        .then(res => {
          uni.hideLoading();
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

          this.state = 'RESOLVED';
          uni.showToast({
            title: '已批准',
          });
        });
    },
    async reject() {
      let that = this;
      uni.showLoading({ title: '加载中' });
      await uniCloud
        .callFunction({
          name: 'joinQueue',
          data: {
            answerId: this.answerId,
            queueId: this.queueId,
            userId: this.$store.state.user.userId,
            token: this.$store.state.user.token,
            joinId: this.joinId,
            decision: 'NO',
            type: 'ADD',
          },
        })
        .then(res => {
          uni.hideLoading();
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
          this.state = 'REJECTED';
          uni.showToast({
            title: '已拒绝',
          });
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

<style lang="scss" scoped>
.container {
  padding-bottom: 20px;
}
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
.actions {
  display: flex;
  justify-content: space-around;
  margin: 10px 0;
  padding: 20px 0;
  background-color: #fff;
}
.cu-form-group {
  background-color: $my-view-bg-color-light;
}

.textarea {
  background-color: $my-input-bg-color-light;
  margin: 0;
  padding: 20rpx;
  width: auto;
}
.cu-item,
.cu-item .content {
  background-color: #eee;
}
.not-pending {
  text-align: center;
}
.dark {
  .title,
  .cu-form-group,
  .cu-timeline,
  .submit-view {
    background-color: $my-view-bg-color-dark;
  }
  .textarea {
    background-color: $my-view-bg-color-dark-hover;
  }
  .cu-item,
  .cu-item .content {
    background-color: #666;
  }
  .actions {
    background-color: transparent;
  }
}
</style>
