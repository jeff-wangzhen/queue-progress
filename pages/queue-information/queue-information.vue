<template>
  <view :class="[isDark ? 'dark' : 'light']">
    <cu-custom :bgColor="isDark ? 'bg-black' : 'bg-gradual-green'" isBack>
      <block slot="backText">返回</block>
      <block slot="content">队列详情</block>
    </cu-custom>
    <skeleton v-if="showSkeleton" :num="1" />
    <view v-else class="info">
      <item-card
        :queueItem="queue"
        :isInfo="true"
        :showPromptProp="showPromptProp"
        @confirm="confirm"
      />
      <view class="questions-view" v-if="queue.joinCondition.type !== 'NO'">
        <view class="solids-bottom padding-xs flex align-center title">
          <view class="flex-sub text-center">
            <text :class="['text-bold ', isDark ? 'text-white' : 'text-black']">
              验证信息
            </text>
          </view>
        </view>
        <view
          v-for="(questionItem, index) in questions"
          :key="questionItem.queueId"
        >
          <view class="cu-form-group" v-text="questionItem.question"></view>

          <textarea
            v-if="!isCreator"
            class="textarea"
            maxlength="1000"
            v-model="answers[index]"
            placeholder="请输入"
          ></textarea>
        </view>
        <view
          v-if="!isCreator && queue.state !== 'STOP'"
          class="padding flex flex-direction submit-view"
        >
          <button class="cu-btn bg-blue lg " @tap="submit">
            <text
              class="cuIcon-loading2 cuIconfont-spin"
              v-if="submitting"
            ></text>
            申请加入队列
          </button>
        </view>
      </view>

      <view class="time-line">
        <view class="solids-bottom padding-xs flex align-center title">
          <view class="flex-sub text-center">
            <text
              :class="['text-bold ', isDark ? 'text-white' : 'text-black']"
            ></text>
          </view>
        </view>
        <view v-if="queueHistory.length === 0" class="no-history">
          <view class="flex-sub text-center">
            <view class="solid-bottom text-sm padding">
              <text class="text-gray">暂无记录</text>
            </view>
          </view>
        </view>
        <view
          class="cu-timeline"
          v-for="(historyItem, historyIndex) in queueHistory"
          :key="historyItem.time"
        >
          <view
            class="cu-time"
            v-text="
              historyIndex > 0 &&
              monthdate[historyIndex] === monthdate[historyIndex - 1]
                ? ''
                : monthdate[historyIndex]
            "
          ></view>
          <view class="cu-item" :class="'text-' + historyColor[historyIndex]">
            <view class="content">
              <view class="cu-capsule radius">
                <view
                  class="cu-tag line-cyan "
                  v-text="hourMinites[historyIndex]"
                ></view>
              </view>
              <view class="margin-top">
                <text v-text="historyItem.username + ' '"></text>

                <text v-text="historyAction[historyIndex]"></text>
              </view>
            </view>
          </view>
        </view>
        <view v-if="queueHistory.length > 0" @tap.stop="loadMore">
          <uni-load-more :status="status" />
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import skeleton from '@/components/skeleton/skeleton.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import itemCard from '@/components/item-card/item-card.vue';

export default {
  components: { itemCard, skeleton, uniLoadMore },
  data() {
    return {
      queueId: 0,
      submitting: false,
      showPromptProp: false,
      queue: {
        title: '',
        description: '',
        joinCondition: { type: 'NO', questions: [] },
        state: 'OK',
      },
      questions: [],
      answers: [],
      showSkeleton: true,
      showQuestions: false,
      queueHistory: [],
      monthdate: [],
      hourMinites: [],
      historyColor: [],
      historyAction: [],
      status: 'MORE',
    };
  },
  computed: {
    isDark() {
      return this.$store.state.others.isDark;
    },
    isCreator() {
      //console.log(
      //   'ggfhgfhfgh',
      //   this.queue,
      //   this.$store.state.user.userId,
      //   this.$store.state.user.userId === this.queue && this.queue.creatorId
      // );
      return (
        this.queue && this.$store.state.user.userId === this.queue.creatorId
      );
    },
  },
  watch: {
    '$store.state.user.userId': {
      handler() {
        this.getInfo();
      },
    },
  },
  onPullDownRefresh() {
    Object.assign(this.$data, {
      queue: {
        title: '',
        description: '',
        joinCondition: { type: 'NO', questions: [] },
        state: 'OK',
      },
      queueHistory: [],
      monthdate: [],
      hourMinites: [],
      historyColor: [],
      historyAction: [],
    });
    //console.log('pullrefresh', this.$data.historyAction.length);
    this.getInfo();
  },
  onReachBottom() {
    this.loadMore();
  },
  onLoad(e) {
    // //console.log(getCurrentPages())
    this.queueId = parseInt(e.queueId);
    this.queue.queueId = parseInt(e.queueId);

    if (e.showquestions === 'true') {
      uni.showToast({ title: '请提交验证信息', icon: 'none' });
    }
    //console.log('ffffffffffffffffffff');
    this.getInfo();
  },
  methods: {
    loadMore() {
      if (this.status === 'NO_MORE') return;
      //console.log('loadmore');
      this.getHistory({
        lastUserId: this.queueHistory[this.queueHistory.length - 1].userId,
        lastTime: this.queueHistory[this.queueHistory.length - 1].time,
      });
    },
    getHistory(params) {
      let that = this;
      this.status = 'LOADING';
      if (params.lastTime) {
      }
      uniCloud
        .callFunction({
          name: 'getQueueHistory',
          data: {
            lastUserId: params.lastUserId,
            lastTime: params.lastTime,
            queueId: parseInt(that.queueId),
          },
        })
        .then(res => {
          //console.log('queue history555', res, params);
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

          let temp = that.queueHistory.concat(res.result.data);
          //console.log(546546, that.queueHistory);
          let hash = {};
          that.queueHistory = temp.reduce((preVal, curVal) => {
            hash[curVal.time]
              ? ''
              : (hash[curVal.time] = true && preVal.push(curVal));
            return preVal;
          }, []);
          that.queueHistory.forEach(item => {
            that.setTime(item.time);
            that.setColorAndAction(item.type);
          });
          // if (params.lastUserId) {

          // } else {
          //   that.queueHistory = res.result.data;
          // }
        });
    },
    getInfo() {
      this.getHistory({});
      let that = this;
      //console.log(this);
      this.showSkeleton = true;
      this.$getQueueList({
        userId: that.$store.state.user.userId,
        queueId: parseInt(that.queueId),
        type: 'GETBYID',
      }).then(res => {
        uni.stopPullDownRefresh();
        //console.log('getQueue', res);
        if (res.result.code !== 0) {
          uni.showToast({
            title: res.result.msg,
            icon: 'none',
          });
          // return false;
        }
        that.queue = res.result.data[0];
        if (!that.queue) {
          uni.showModal({
            showCancel: false,
            content: '该队列不存在或已被删除',
          });
          uni.navigateBack();
          return false;
        }
        that.questions =
          (that.queue && that.queue.joinCondition.questions) || [];
        //console.log('ques', that.questions);
        for (let i = 0; i < that.questions.length; i++) {
          that.questions[i].answer = '';
        }

        that.showSkeleton = false;

        //console.log(that);
      });
    },
    submit() {
      //console.log(this.answers);
      if (this.submitting) return false;
      if (this.$store.state.user.userId === '') {
        uni.showToast({ title: '请登录', icon: 'none' });
        return;
      }
      //console.log(this.queue.joinCondition, this.questions);
      let flag = true;
      let that = this;
      this.questions.map((item, i) => {
        // //console.log(that.answers[i].trim());
        if (!that.answers[i] || that.answers[i].trim() === '') {
          uni.showToast({ title: '请完善答案', icon: 'none', duration: 1000 });
          flag = false;
          //console.log('return');
          return false;
        } else {
          that.questions[i].answer = that.answers[i];
        }
      });
      if (flag) {
        this.showPromptProp = true;
      }
    },
    async confirm(joinNotifyNumber) {
      if (!this.showPromptProp) return;
      this.showPromptProp = false;
      this.submitting = true;
      let that = this;
      let data = {
        name: that.$store.state.user.name,
        userId: that.$store.state.user.userId,
        queueId: that.queue.queueId,
        answers: that.questions,
        token: that.$store.state.user.token,
        joinNotifyNumber,
      };
      //console.log('提交验证，', data);
      await uniCloud
        .callFunction({
          name: 'addAnswerToQuestion',
          data,
        })
        .then(res => {
          //console.log(res);
          this.submitting = false;
          if (res.result.code === 0) {
            uni.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 1000,
            });
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
            });
          }
        });
      return 'OK';
    },
    setColorAndAction(type) {
      if (type === 'DOING') {
        this.historyColor.push('gray');
        this.historyAction.push('已叫号');
      } else if (type === 'LEAVE') {
        this.historyAction.push('处理完成');
        this.historyColor.push('yellow');
      } else if (type === 'DELETE') {
        this.historyAction.push('被移出队列');
        this.historyColor.push('yellow');
      } else if (type === 'QUIT') {
        this.historyAction.push('退出队列');
        this.historyColor.push('brown');
      } else if (type === 'ADD') {
        this.historyAction.push('加入队列');
        this.historyColor.push('blue');
      } else if (type === 'INIT') {
        this.historyAction.push('创建队列');
        this.historyColor.push('green');
      } else if (type === 'OK') {
        this.historyAction.push('恢复排队');
        this.historyColor.push('cyan');
      } else if (type === 'STOP') {
        this.historyAction.push('停止排队');
        this.historyColor.push('red');
      } else {
        this.historyColor.push(' ');
      }
    },
    setTime(timestamp) {
      const time = new Date(timestamp);
      const month = time.getMonth() + 1;
      const year = time.getFullYear();
      const currentYear = new Date().getFullYear();
      const date = time.getDate();
      this.monthdate.push(
        (currentYear > year ? (year % 100) + '-' : '') + month + '-' + date
      );
      let hour = time.getHours();
      // if (hour < 10) hour = "0" + hour;
      const minutes = time.getMinutes();
      this.hourMinites.push(
        (hour < 10 ? '0' : '') +
          hour +
          ':' +
          (minutes < 10 ? '0' : '') +
          minutes
      );
    },
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
.cu-form-group {
  background-color: $my-view-bg-color-light;
  margin: 10px 0;
}
.textarea {
  background-color: $my-input-bg-color-light;
  margin: 0;
  padding: 20rpx;
  width: auto;
}
.title {
  background-color: $uni-bg-color;
  margin-top: 10px;
}
.no-history {
  background-color: $uni-bg-color;
  text-align: center;
  margin: 0 auto 10px;
}
.time-line {
  padding-bottom: 20px;
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
  .cu-item {
    background-color: #222;
  }
  .cu-item .content {
    color: #eee;
    background-color: #333;
  }
  .no-history {
    background-color: $my-view-bg-color-dark;
  }
}
</style>
