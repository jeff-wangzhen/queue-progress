<template>
  <view :class="[isDark ? 'dark' : 'light']">
    <!-- <cu-custom :bgColor="isDark ? 'bg-black' : 'bg-gradual-green'" isBack>
      <block slot="backText">返回</block>
      <block slot="content">
        查看详情
      </block>
    </cu-custom> -->
    <view class="container">
      <view class="">
        <view v-for="questionItem in this.questions" :key="questionItem.id">
          <view class="cu-form-group" v-text="questionItem.question"></view>

          <textarea
            class="textarea"
            maxlength="1000"
            v-model="questionItem.answer"
            placeholder="请输入"
            disabled
          ></textarea>
        </view>
        <view class="actions">
          <button class="cu-btn round button bg-cyan">通过</button>
          <button class="cu-btn round button bg-blue">拒绝</button>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Question } from "../../interface/queue";

@Component({
  components: {},
})
export default class extends Vue {
  questions: Question[] = [];
  get isDark(): boolean {
    return this.$store.state.others.isDark;
  }
  onLoad(e: any) {
    console.log(JSON.parse(e.id));
    // this.queue.id = e.id;
    this.$http
      .get("/queue-question-answer", { data: { id: e.id } })
      .then((res: any) => {
        console.log(res);
        this.questions = res.data.data;
      });
  }
}
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
  background-color: #fff;
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
