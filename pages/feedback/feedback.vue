<template>
  <view :class="[isDark ? 'dark' : 'light']">
    <cu-custom :bgColor="isDark ? 'bg-black' : 'bg-gradual-green'" isBack>
      <block slot="content">意见反馈</block>
    </cu-custom>
    <LoadProgress :loadProgress="loadProgressValue"></LoadProgress>
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
          @input="contactWayChange"
          :value="contactWay"
          class="contact-input"
          placeholder="您的联系方式（微信/QQ/邮箱，选填）"
        />
        <button
          class="commitButton "
          :class="commentContent.trim().length > 0 ? 'sendable' : ''"
          formType="submit"
        >
          提交
        </button>
      </form>
      <view class="uni-comment">
        <view
          class="uni-comment-list"
          v-for="(comment, index) in commentsList"
          :key="index"
        >
          <view class="uni-comment-face">
            <image :src="comment.creator.avatar" mode="widthFix"></image>
          </view>
          <view class="uni-comment-body">
            <view class="uni-comment-top">
              <text v-text="comment.creator.name"></text>
            </view>

            <view class="uni-comment-content" v-text="comment.content"></view>
            <view class="uni-comment-date">
              <text
                v-text="
                  $options.filters.formatDateTime(
                    comment.time,
                    'yyyy年M月D日 hh:mm'
                  )
                "
              ></text>
            </view>
          </view>
        </view>
      </view>
      <view class="none" v-if="commentsList.length === 0 && !reload">
        无记录
      </view>
      <view @tap.stop="loadMore"><uni-load-more :status="status" /></view>
    </view>
  </view>
</template>
<script>
import { formatDateTime } from '../../common/js/common.js';

import LoadProgress from '@/components/load-progress/load-progress.vue';

import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
export default {
  filters: { formatDateTime },
  components: { LoadProgress, uniLoadMore },
  data() {
    return {
      reload: false,
      loadProgressValue: 0,
      status: 'MORE',
      submitting: false,
      commentsList: [],
      index: '',
      nickname: '',
      created_user_id: '',
      commentContent: '',
      contactWay: '',
    };
  },
  computed: {
    isDark() {
      return this.$store.state.others.isDark;
    },
    isSendable() {
      return this.commentContent.length > 0;
    },
  },

  mounted() {
    this.reload = true;
    this.setItemList('TOP');
    this.loadProgress();
  },
  onPullDownRefresh() {
    this.reload = true;
    this.setItemList('TOP');
    this.loadProgress();
  },
  onReachBottom() {
    this.setItemList('BOTTOM');
  },
  methods: {
    setItemList(type) {
      let that = this;

      if (this.status === 'NO_MORE' && type !== 'TOP') {
        return;
      }

      this.status = 'LOADING';
      let lastTime = Date.now();
      if (type === 'BOTTOM' && that.commentsList.length > 0) {
        lastTime = that.commentsList[that.commentsList.length - 1].time;
      }

      uniCloud
        .callFunction({
          name: 'feedback',
          data: { type: 'GET', lastTime },
        })

        .then(res => {
          //console.log(99, res);
          this.reload = false;
          uni.stopPullDownRefresh();

          this.loadProgressValue = 100;
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
          if (type === 'TOP') {
            that.commentsList = [];
          }
          that.commentsList = that.commentsList.concat(res.result.data);
        });
    },
    loadMore() {
      this.setItemList('BOTTOM');
    },
    commentContentChange(e) {
      this.commentContent = e.detail.value;
    },
    contactWayChange(e) {
      this.contactWay = e.detail.value;
    },
    commitComments() {
      let that = this;
      if (this.submitting) return;
      //这里定义你自己要请求添加留言接口带的值，我是从接口获取到了
      // var created_user_id = this.created_user_id;
      var content = this.commentContent;
      if (content.trim() === '') {
        uni.showToast({
          title: '请输入内容',
          icon: 'none',
        });
        return false;
      }
      var commentsList = this.commentsList;

      this.submitting = true;

      let data = {
        content: content,
        creator: {
          userId: that.$store.state.user.userId,
          name: that.$store.state.user.name,
          avatar: that.$store.state.user.avatar,
        },
        contactWay: that.contactWay,
        time: Date.now(),
        type: 'ADD',
      };
      //console.log(9,data)
      uni.showLoading({
        title: '提交中',
      });
      uniCloud
        .callFunction({
          name: 'feedback',
          data,
        })

        .then(res => {
          that.submitting = false;
          uni.hideLoading();
          if (res.result.code === 0) {
            uni.showToast({
              icon: 'success',
              title: '留言成功',
            });
            that.commentsList = '';
            //这是重点，意思是动态添加，使用unshift就插在前面，也可以用push
            that.commentsList.total += 1;
            that.commentsList.unshift(data);
          } else {
            uni.showToast({
              title: '提交失败，请重试',
              icon: 'none',
            });
          }
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
.none {
  height: 200rpx;
  line-height: 200rpx;
  text-align: center;
}
</style>
