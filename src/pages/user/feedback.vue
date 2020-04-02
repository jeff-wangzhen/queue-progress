<template>
  <view :class="[isDark ? 'dark' : 'light']">
    <!-- <cu-custom :bgColor="isDark ? 'bg-black' : 'bg-gradual-green'" isBack>
      <block slot="content">
        意见反馈
      </block>
    </cu-custom> -->

    <view class="uni-padding-wrap container">
      <form @submit="commitComments" class="form">
        <textarea
          class="contentTextArea"
          name="commentContent"
          :value="commentContent"
          @input="commentContentChange"
          placeholder="请输入您的意见或建议"
        ></textarea>
        <input
          type="text"
          :value="contactWay"
          class="contact-input"
          placeholder="您的联系方式（微信/QQ/邮箱，可不填）"
        />
        <button
          class="commitButton "
          :class="commentContent.length > 0 ? 'sendable' : ''"
          formType="submit"
        >
          提交
        </button>
      </form>
      <view class="uni-comment">
        <view
          class="uni-comment-list"
          v-for="(commentsList, index) in commentsList"
          :key="index"
        >
          <view class="uni-comment-face">
            <image :src="commentsList.creator.avatar" mode="widthFix"></image>
          </view>
          <view class="uni-comment-body">
            <view class="uni-comment-top">
              <text v-text="commentsList.creator.name"></text>
            </view>

            <view class="uni-comment-content">{{ commentsList.content }}</view>
            <view class="uni-comment-date">
              <text
                v-text="
                  $options.filters.formatDateTime(
                    commentsList.time,
                    'yyyy年M月D日 hh:mm'
                  )
                "
              ></text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { formatDateTime } from "../../common/js/helpers";

@Component({
  components: {},
  filters: { formatDateTime },
})
export default class extends Vue {
  commentsList = [];
  index = "";
  nickname = "";
  created_user_id = "";
  commentContent = "";
  contactWay = "";
  get isDark(): boolean {
    return this.$store.state.others.isDark;
  }
  get isSendable() {
    return this.commentContent.length > 0;
  }
  mounted() {
    let that = this;
    this.$http
      .get("/feedback/query", {
        data: { latest: true, length: 10 },
      })
      .then((res: any) => {
        console.log(res);
        if (res.data.code === 0) {
          that.commentsList = res.data.data;
        }
      });
  }
  onPullDownRefresh() {
    let that = this;
    // console.log("pul");
    this.$http
      .get("/feedback/query", {
        data: { latest: true, length: 10 },
      })
      .then((res: any) => {
        console.log(res);
        if (res.data.code === 0) {
          that.commentsList = res.data.data;
        }
      });
  }
  onReachBottom() {
    let that = this;
    this.$http
      .get("/feedback/query", {
        data: { first: true, length: 10 },
      })
      .then((res: any) => {
        console.log(res);
        if (res.data.code === 0) {
          that.commentsList = res.data.data;
        }
      });
  }
  commentContentChange(e: any) {
    this.commentContent = e.detail.value;
  }
  commitComments() {
    //这里定义你自己要请求添加留言接口带的值，我是从接口获取到了
    // var created_user_id = this.created_user_id;
    var content = this.commentContent;
    // var nickname = this.nickname;
    var commentsList = this.commentsList as any;
    uni.showLoading({
      title: "正在提交",
      mask: true,
    });
    let that = this;
    let data = {
      content: content,
      creator: {
        id: that.$store.state.user.id,
        name: that.$store.state.user.name,
        avatar: that.$store.state.user.avatar,
      },
      contactWay: this.contactWay,
      time: Date.now(),
    };
    this.$http
      .post("/feedback/add", {
        data,
      })
      .then((res: any) => {
        if (res.data.code === 0) {
          uni.showToast({
            icon: "success",
            title: "留言成功",
          });
          //这是重点，意思是动态添加，使用unshift就插在前面，也可以用push
          commentsList.total += 1;
          commentsList.unshift(data);
        } else {
          uni.showToast({
            title: "提交失败，请重试",
            icon: "none",
          });
        }
      });
  }
}
</script>
<style lang="scss" scoped>
.uni-padding-wrap {
  margin: 10rpx auto;
  padding: 0;
}

view {
  font-size: 28upx;
}
.form {
  margin: 0 10rpx;
}
.uni-comment {
  padding: 5rpx 0;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  margin-top: 20rpx;
  border-bottom: 1rpx solid #e9e7ef;
}

.uni-comment-list {
  flex-wrap: nowrap;
  padding: 10rpx 0;
  margin: 10rpx 0;
  width: 100%;
  display: flex;
  border-bottom: 1rpx solid #e9e7ef;
}

.uni-comment-face {
  width: 70upx;
  height: 70upx;
  border-radius: 100%;
  margin-right: 20upx;
  flex-shrink: 0;
  overflow: hidden;
}

.uni-comment-face image {
  width: 100%;
  border-radius: 100%;
}

.uni-comment-body {
  width: 100%;
}

.uni-comment-top {
  line-height: 1.5em;
  justify-content: space-between;
}

.uni-comment-top text {
  font-size: 24upx;
}

.uni-comment-date {
  line-height: 38upx;
  flex-direction: row;
  justify-content: space-between;
  display: flex !important;
  flex-grow: 1;
  color: gray;
}

.uni-comment-date view {
  color: #666666;
  font-size: 24upx;
  line-height: 38upx;
}

.uni-comment-content {
  line-height: 1.6em;
  font-size: 28upx;
  padding: 8rpx 0;
}

.uni-comment-replay-btn {
  background: #fff;
  font-size: 24upx;
  line-height: 28upx;
  padding: 5rpx 20upx;
  border-radius: 30upx;
  color: #333 !important;
  margin: 0 10upx;
}
.commitButton {
  color: white;
  width: 100%;
  margin: 0rpx auto;
  height: 75rpx;
  line-height: 75rpx;
  font-size: 37rpx;
  background: rgb(176, 239, 253);
}
.contact-input {
  padding: 0 20rpx;
  margin: 20rpx 0;
  border: 1px solid #e9e7ef;
  height: 40px;
  border-radius: 20px;
  line-height: 40px;
}
.sendable {
  background: rgb(0, 202, 252);
}
.contentTextArea {
  font-size: 30rpx;
  height: 300rpx;
  border: 1rpx solid #e9e7ef;
  width: 100%;
  margin: 0rpx auto;
  margin-bottom: 15rpx;
  padding: 20rpx 0 0 20rpx;
  border-radius: 6rpx;
}
</style>
