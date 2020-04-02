<template>
  <view :class="[isDark ? 'dark' : 'light']">
    <!-- <cu-custom :bgColor="isDark ? 'bg-black' : 'bg-gradual-green'" isBack>
      <block slot="backText">返回</block>
      <block slot="content">
        队列详情
      </block>
    </cu-custom> -->
    <skeleton v-if="showSkeleton" :num="1" />
    <view v-else class="">
      <item-card
        :key="queue.id"
        :item="queue"
        :isInfo="true"
        @setShowTip="setShowTip"
      />
      <view class="questions-view" v-if="this.queue.joinCondition.type > 0">
        <view class="solids-bottom padding-xs flex align-center title">
          <view class="flex-sub text-center">
            <text :class="['text-bold ', isDark ? 'text-white' : 'text-black']">
              验证信息
            </text>
          </view>
        </view>
        <view
          v-for="questionItem in this.queue.joinCondition.questions"
          :key="questionItem.id"
        >
          <view class="cu-form-group" v-text="questionItem.question"></view>

          <textarea
            class="textarea"
            maxlength="1000"
            v-model="questionItem.answer"
            placeholder="请输入"
          ></textarea>
        </view>
        <view class="padding flex flex-direction submit-view">
          <button class="cu-btn bg-blue lg " @tap="submit">
            <text
              class="cuIcon-loading2 cuIconfont-spin"
              v-if="submitLoading"
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
                <text v-text="historyItem.subject"></text>

                <text v-text="historyAction[historyIndex]"></text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { Queue, JoinConditionType, QueueHistory } from "../../interface/queue";
import skeleton from "@/components/skeleton.vue";

import itemCard from "@/components/item-card.vue";
@Component({
  components: { itemCard, skeleton },
})
export default class extends Vue {
  queue: Queue = {
    title: "",
    description: "",
    joinCondition: { type: JoinConditionType.NO, questions: [] },
    state: "ok",
  };
  showSkeleton = true;
  submitLoading = false;
  showQuestions = false;
  queueHistory: Array<QueueHistory> = [];
  monthdate: Array<string> = [];
  hourMinites: Array<string> = [];
  historyColor: Array<string> = [];
  historyAction: Array<String> = [];
  get isDark(): boolean {
    return this.$store.state.others.isDark;
  }
  @Watch("queueHistory")
  queueHistorychanged(val: Array<QueueHistory>) {
    val.forEach((item: QueueHistory) => {
      this.setTime(item.time);
      this.setColorAndAction(item.type);
    });
  }

  onLoad(e: any) {
    console.log(e);
    this.queue.id = e.id;
    this.$http
      .get("/queue-information", { data: { id: e.id } })
      .then((res: any) => {
        console.log(res);
        this.queue = res.data;
        this.showSkeleton = false;
      });
    this.$http
      .get("/queue-history", { data: { id: e.id } })
      .then((res: any) => {
        console.log(res);
        this.queueHistory = res.data;
      });
    if (e.showquestions === "true") {
      uni.showToast({ title: "请输入验证信息后申请加入", icon: "none" });
    }
  }

  submit() {
    console.log(this.queue.joinCondition);
    let flag = true;
    this.queue.joinCondition.questions.map((item) => {
      if (item.answer.trim() === "") {
        console.log(item.answer.trim());
        uni.showToast({ title: "请完善答案", icon: "none", duration: 1000 });
        flag = false;
        console.log("return");
        return false;
      }
    });
    if (flag) {
      console.log("1");
      uni.showToast({ title: "提交成功", icon: "success", duration: 1000 });
    }
  }

  setColorAndAction(type: QueueHistory["type"]) {
    if (type === "out") {
      this.historyColor.push("gray");
      this.historyAction.push("已叫号");
    } else if (type === "pass") {
      this.historyAction.push("已过号");
      this.historyColor.push("yellow");
    } else if (type === "quit") {
      this.historyAction.push("退出队列");
      this.historyColor.push("brown");
    } else if (type === "in") {
      this.historyAction.push("加入队列");
      this.historyColor.push("blue");
    } else if (type === "create") {
      this.historyAction.push("创建队列");
      this.historyColor.push("green");
    } else if (type === "continue") {
      this.historyAction.push("恢复排队");
      this.historyColor.push("cyan");
    } else if (type === "stop") {
      this.historyAction.push("停止排队");
      this.historyColor.push("red");
    } else {
      this.historyColor.push(" ");
    }
    console.log(this.historyColor);
  }

  setTime(timestamp: string) {
    const time = new Date(timestamp);
    const month = time.getMonth() + 1;
    const year = time.getFullYear();
    const currentYear = new Date().getFullYear();
    const date = time.getDate();
    this.monthdate.push(
      (currentYear > year ? (year % 100) + "-" : "") + month + "-" + date
    );
    let hour = time.getHours();
    // if (hour < 10) hour = "0" + hour;
    const minutes = time.getMinutes();
    this.hourMinites.push(
      (hour < 10 ? "0" : "") + hour + ":" + (minutes < 10 ? "0" : "") + minutes
    );
  }
}
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
  .cu-item,
  .cu-item .content {
    background-color: #666;
  }
}
</style>
