<template>
  <view :class="[isDark ? 'dark' : 'light']">
    <!-- <cu-custom
      :bgColor="isDark ? 'bg-black' : 'bg-gradual-green'"
      isBack="true"
    >
      <block slot="content">
        创建队列
      </block>
    </cu-custom> -->
    <form>
      <view class="cu-form-group">
        <view class="title">
          <text>队列名称</text>
          <text class="important">*</text>
        </view>
        <input
          placeholder="请输入队列名称"
          v-model="title"
          placeholder-class="phcolor"
          maxlength="20"
          type="text"
        />
      </view>
      <view class="cu-form-group ">
        <view class="title"><text>队列详情</text></view>
        <textarea
          maxlength="1000"
          v-model="description"
          placeholder="请填写具体介绍"
        ></textarea>
      </view>
      <view class="cu-bar  ">
        <view class="action">
          <text>图片上传</text>
        </view>
        <view class="action">{{ imgList.length }}/4</view>
      </view>

      <view class="cu-form-group">
        <view class="grid col-4 grid-square flex-sub">
          <view
            class="bg-img"
            v-for="(item, index) in imgList"
            :key="index"
            @tap="ViewImage"
            :data-url="imgList[index]"
          >
            <image :src="imgList[index]" mode="aspectFill"></image>
            <view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
              <text class="cuIcon-close"></text>
            </view>
          </view>
          <view class="solids" @tap="ChooseImage" v-if="imgList.length < 4">
            <text class="cuIcon-cameraadd"></text>
          </view>
        </view>
      </view>
      <view class="cu-form-group">
        <view class="title"><text>人数上限</text></view>
        <input
          @blur="setMaxPeopleCount"
          v-model="maxPeopleCount"
          placeholder-class="phcolor"
          max="999"
          type="number"
        />
      </view>

      <view class="cu-form-group  ">
        <view class="title"><text>开始排队时间</text></view>
        <picker
          mode="date"
          :value="currentTime"
          :start="currentDate"
          end="2099-12-31"
          @change="DateChange"
        >
          <view class="picker">
            {{ currentDate }}
          </view>
        </picker>
        <picker
          mode="time"
          :value="currentTime"
          :start="currentTime"
          end="23:59"
          @change="TimeChange"
        >
          <view class="picker">
            {{ currentTime }}
          </view>
        </picker>
      </view>
      <view class="cu-form-group ">
        <view class="title"><text>允许首页列表显示</text></view>
        <switch
          @change="setShowIndex"
          :class="showOnIndex ? 'checked' : ''"
          :checked="showOnIndex"
        ></switch>
      </view>

      <view class="cu-form-group margin-top">
        <view class="title"><text>设置加入队列的验证信息</text></view>
        <picker
          @change="joinConditionTypePickerChange"
          :value="joinCondition.type"
          :range="joinConditionTypePicker"
        >
          <view class="picker">
            {{ joinConditionTypePicker[joinCondition.type] }}
          </view>
        </picker>
      </view>
      <view v-if="joinCondition.type > 0" class="">
        <tui-swipe-action
          :actions="actions"
          @click="handlerButton"
          v-for="(question, questionIndex) in joinCondition.questions"
          :key="questionIndex"
          :params="question"
        >
          <template v-slot:content>
            <view class="question-block">
              <view class="cu-form-group">
                <view class="title"><text>问题类型</text></view>
                <picker
                  @change="joinConditionQuestionTypePickerChange"
                  :value="joinCondition.questions[questionIndex].type"
                  :range="joinConditionQuestionTypePicker"
                >
                  <view class="picker">
                    {{
                      joinConditionQuestionTypePicker[
                        joinCondition.questions[questionIndex].type
                      ]
                    }}
                  </view>
                </picker>
              </view>
              <view class="cu-form-group">
                <view class="title">
                  <text class="important">*</text>
                  <text>问题描述</text>
                </view>

                <textarea
                  maxlength="1000"
                  placeholder="请输入问题描述"
                  placeholder-class="phcolor"
                  v-model="joinCondition.questions[questionIndex].question"
                  :name="'question-title-' + questionIndex"
                ></textarea>
              </view>
              <view class="cu-form-group" v-if="joinCondition.type === 1">
                <view class="title">
                  <text class="important">*</text>
                  <text>正确答案</text>
                </view>

                <textarea
                  maxlength="1000"
                  placeholder="请输入正确答案"
                  placeholder-class="phcolor"
                  v-model="joinCondition.questions[questionIndex].answer"
                  :name="'question-right-answer-' + questionIndex"
                ></textarea>
              </view>
            </view>
          </template>
        </tui-swipe-action>
        <view class="center">
          <button class="cu-btn bg-cyan lg " @tap="addQuestion">
            添加问题
          </button>
        </view>
      </view>

      <!-- <button class="cu-bar round button bg-blue" @tap="submit">
        提交
      </button> -->
      <view class="padding flex flex-direction">
        <button class="cu-btn bg-blue lg " @tap="submit">
          <text
            class="cuIcon-loading2 cuIconfont-spin"
            v-if="submitLoading"
          ></text>
          提交
        </button>
      </view>
    </form>
  </view>
</template>

<script src="./add-queue.ts"></script>

<style lang="scss" scoped>
.important {
  color: #f00;
}
.cu-form-group .title {
  min-width: calc(4em + 15px);
}

.container {
  background: #fff;
  padding-bottom: env(safe-area-inset-bottom);
}

.list-item {
  padding: 30upx 30upx;
  display: flex;
  align-items: item;
}

.item-img {
  height: 120upx;
  width: 120upx;
  margin-right: 20upx;
  display: block;
}

.item-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-title {
  font-size: 32upx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-time {
  color: #999;
  font-size: 24upx;
}
.center {
  display: flex;
  justify-content: center;
  padding-top: 10px;
}
.question-block {
  border-top: 1px dotted #555;
}
.dark {
  .cu-form-group {
    background-color: $my-view-bg-color-dark;
  }
}
</style>
