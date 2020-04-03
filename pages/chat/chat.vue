<template>
  <view :class="[isDark ? 'dark' : 'light']">
    <cu-custom
      :bgColor="isDark ? 'bg-black' : 'bg-gradual-green'"
      isBack="true"
    >
      <block slot="content">聊天</block>
    </cu-custom>
    <view class="container">
      <!--tabbar-->
      <view class="tui-operation tui-chat-operation">
        <view class="tui-right-flex tui-input-box">
          <input class="tui-chat-input" :value="value" @input="inputChange" />
        </view>
        <!-- <view hover-class="tui-opcity" :hover-stay-time="150">
          <tui-icon name="imface" :size="26" color="#333"></tui-icon>
        </view> -->
        <view
          hover-class="tui-opcity"
          :hover-stay-time="150"
          class="tui-pr"
          @tap="selectImage"
        >
          <tui-icon name="add" :ize="30" color="#333"></tui-icon>
        </view>
        <view
          hover-class="tui-opcity"
          :hover-stay-time="150"
          class="tui-pr sendBtn "
          :class="isSendable ? 'sendable' : ''"
          @tap="send"
        >
          发送
        </view>
      </view>
      <!--tabbar-->
      <view
        class="content"
        id="content"
        :style="{ height: style.contentViewHeight + 'px' }"
      >
        <scroll-view
          id="scrollview"
          class="tui-chat-content"
          scroll-y="true"
          :style="{ height: style.contentViewHeight + 'px' }"
          :scroll-with-animation="true"
          :scroll-top="scrollTop"
        >
          <!-- <scroll-view class="tui-chat-content"> -->

          <view v-if="messages.length > 0" @tap.stop="loadMore">
            <uni-load-more :status="status" />
          </view>
          <view v-show="show" class="scroll-area">
            <!-- <view class="tui-label">对方已通过您的好友请求</view> -->
            <view
              class=""
              v-for="(message, index) in messages"
              :key="message.time"
            >
              <view
                class="tui-chat-center"
                v-if="messageChange && isTimeIntervalBig(message, index)"
                v-text="
                  $options.filters.formatDateTime(
                    message.time,
                    'yyyy年M月D日 hh:mm'
                  )
                "
              ></view>
              <view>
                <block v-if="message.sender.userId !== userId">
                  <view class="tui-chat-left">
                    <image
                      :src="fromUser.avatar"
                      class="tui-user-pic tui-right"
                    ></image>

                    <view
                      class="tui-chatbox tui-chatbox-left"
                      v-if="message.type === 'TEXT'"
                    >
                      <view v-text="message.content"></view>

                      <view v-if="message.href">
                        <navigator class="navigator" :url="message.href">
                          查看详情
                        </navigator>
                      </view>
                    </view>
                    <view
                      class="tui-img-chatbox"
                      v-if="message.type === 'image'"
                    >
                      <image
                        :src="message.content"
                        class="tui-chat-img"
                        mode="widthFix"
                      ></image>
                    </view>
                  </view>
                </block>
                <block v-else>
                  <view class="tui-chat-right">
                    <view
                      class="tui-chatbox tui-chatbox-right"
                      v-text="message.content"
                      v-if="message.type === 'TEXT'"
                    ></view>
                    <view
                      class="tui-chatbox tui-chatbox-right"
                      v-html="message.content"
                      v-if="message.href"
                    ></view>
                    <view
                      class="tui-img-chatbox"
                      v-if="message.type === 'image'"
                    >
                      <image
                        :src="message.content"
                        class="tui-chat-img"
                        mode="widthFix"
                      ></image>
                    </view>
                    <image
                      :src="message.sender.avatar"
                      class="tui-user-pic tui-left"
                    ></image>
                  </view>
                </block>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <view class="tui-safearea-bottom"></view>
    </view>
  </view>
</template>

<script>
import tuiIcon from '@/components/icon/icon.vue';
import tuiBadge from '@/components/badge/badge.vue';
import { formatDateTime } from '../../common/js/common.js';

import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
export default {
  components: { tuiIcon, tuiBadge, uniLoadMore },
  filters: { formatDateTime },
  data() {
    return {
      loading: false,
      status: 'MORE',
      show: true,
      bottom: 0,
      value: '',
      scrollTop: 0,
      fromId: '',
      fromUser: { avatar: '' },
      messages: [],
      user: this.$store.state.user,
      style: {
        pageHeight: 0,
        contentViewHeight: 0,
        footViewHeight: 90,
        mitemHeight: 0,
      },
    };
  },
  // @Prop({ type: Boolean, default: false }) isDark!: Boolean;
  computed: {
    isDark() {
      return this.$store.state.others.isDark;
    },
    userId() {
      //console.log(this.$store.state.user.userId);
      return this.$store.state.user.userId;
    },
    isSendable() {
      return this.value.length > 0;
    },
    messageChange() {
      return this.messages;
    },
  },
  watch: {
    '$store.state.user.userId': {
      handler() {
        this.setList();
      },
    },
  },
  created() {
    const res = uni.getSystemInfoSync(); //获取手机可使用窗口高度     api为获取系统信息同步接口
    this.style.pageHeight = res.windowHeight;

    let screenWidth = uni.getSystemInfoSync().screenWidth;
    if (screenWidth !== undefined)
      this.style.contentViewHeight =
        res.windowHeight - (screenWidth / 750) * 100 - 70; //像素   因为给出的是像素高度 然后我们用的是upx  所以换算一下
    // }
  },
  onLoad(options) {
    //console.log(options);
    this.fromId = options.fromId;
    this.setList();
  },
  onPullDownRefresh() {
    this.setList();
  },
  onPageScroll(e) {
    //console.log(e);
    // this.scrollTop=e.scrollTop
    // if (e.scrollTop == 0 && !this.loading) {
    //   this.loading = true;
    //   setTimeout(() => {
    //     this.show = true;
    //     this.loading = false;
    //   }, 1000);
    // }
  },
  methods: {
    isTimeIntervalBig(message, index) {
      return (
        index === 0 ||
        Math.abs(message.time - this.messages[index - 1].time) > 60000
      );
    },
    setList() {
      let that = this;
      that.status = 'LOADING';
      uni.showLoading({ title: '加载中' });
      let params = {
        fromId: that.fromId,
        userId: that.$store.state.user.userId,
        type: 'GETBYID',
        token: that.$store.state.user.token,
        lastTime: that.messages[0] && that.messages[0].time,
      };

      uniCloud
        .callFunction({
          name: 'getMessage',
          data: params,
        })
        .then(res => {
          uni.stopPullDownRefresh();
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
          if (res.result.fromUser.userId) {
            that.fromUser = res.result.fromUser;
          }
          let temp = res.result.data.map(item => {
            return {
              type: 'TEXT',
              content: item.content,
              time: item.time,
              sender: this.fromUser,
              href: item.href,
            };
          });

          temp = temp.reverse().concat(that.messages);

          //console.log(546546, temp);
          let hash = {};
          that.messages = temp.reduce((preVal, curVal) => {
            hash[curVal.time]
              ? ''
              : (hash[curVal.time] = true && preVal.push(curVal));
            return preVal;
          }, []);

          that.status = res.result.hasMore ? 'MORE' : 'NO_MORE';
        });
    },
    inputChange(e) {
      this.value = e.detail.value;
      //console.log(this.value);
    },
    selectImage(e) {
      //console.log(e);
      uni.showToast({
        title: '暂不支持',
        icon: 'none',
        duration: 2000,
      });
    },
    send(e) {
      //console.log(e);
      if (this.value.length > 0) {
        let that = this;
        this.messages.push({
          type: 'TEXT',
          content: that.value,
          time: Date.now(),
          sender: this.$store.state.user,
        });
        this.value = '';
      }
    },
    loadMore() {
      if (this.status === 'NO_MORE') return;
      //console.log('loadmore');
      this.setList();
    },
    scrollToBottom() {
      let that = this;
      let query = uni.createSelectorQuery();
      query.selectAll('.scroll-area').boundingClientRect();
      query.select('#scrollview').boundingClientRect();
      query.exec(res => {
        that.style.mitemHeight = 0;
        res[0].forEach(
          rect =>
            (that.style.mitemHeight = that.style.mitemHeight + rect.height + 40)
        ); //获取所有内部子元素的高度 // 因为vue的虚拟DOM 每次生成的新消息都是之前的，所以采用异步setTimeout    主要就是添加了这红字

        setTimeout(() => {
          if (that.style.mitemHeight > that.style.contentViewHeight - 100) {
            //判断子元素高度是否大于显示高度
            that.scrollTop =
              that.style.mitemHeight - that.style.contentViewHeight + 99999999; //用子元素的高度减去显示的高度就获益获得序言滚动的高度
          }
        }, 100);
      });
    },
  },
};
</script>

<style lang="scss">
page {
  background: #ebedf6;
}

.container {
  padding-left: 20upx;
  padding-right: 20upx;
  padding-bottom: 146upx;
  box-sizing: border-box;
}

/*--tabbar--*/

.tui-operation {
  width: 100%;
  height: 100upx;
  overflow: hidden;
  background: #eff2fc;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 999;
}

.tui-safearea-bottom {
  width: 100%;
  height: env(safe-area-inset-bottom);
}

.tui-operation::before {
  content: '';
  position: absolute;
  top: 0px;
  right: 0;
  left: 0;
  border-top: 1upx solid #eaeef1;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.tui-chat-operation {
  background: #f6f6f6 !important;
  /* padding-right: 18upx; */
  /* box-sizing: border-box; */
}
.tui-pr {
  padding-right: 16rpx;
}

.tui-right-flex {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tui-input-box {
  width: 70%;
  justify-content: flex-start;
}

.tui-chat-input {
  background: #fff;
  height: 72upx;
  border-radius: 6upx;
  padding-left: 20upx;
  padding-right: 20upx;
  flex: 1;
}

.tui-opcity {
  opacity: 0.5;
}

/*--tabbar--*/

/*chatbox*/
.tui-chat-content {
  width: 100%;
}

.tui-chatbox {
  max-width: 66%;
  border-radius: 10upx;
  position: relative;
  padding: 20upx 22upx;
  font-size: 32upx;
  color: #000;
  /* text-align: justify; */
  word-break: break-all;
  word-wrap: break-word;
}

.tui-chatbox::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  top: 20upx;
  border: 16upx solid;
}

.tui-chatbox-left {
  background: #fff;
  border: 1upx solid #fff;
  display: inline-block;
}

.tui-chatbox-left::before {
  right: 100%;
  border-color: transparent #fff transparent transparent;
}

.tui-chatbox-right {
  background: #a0d5f3;
  border: 1upx solid #a0d5f3;
}

.tui-chatbox-right::before {
  left: 100%;
  border-color: transparent transparent transparent #a0d5f3;
}

/*chatbox*/

.tui-chat-left,
.tui-chat-right {
  display: flex;
  align-items: flex-start;
  padding-top: 36upx;
}

.tui-user-pic {
  width: 80upx;
  height: 80upx;
  flex-shrink: 0;
  border-radius: 50%;
  display: block;
}

.tui-left {
  margin-left: 26upx;
}

.tui-right {
  margin-right: 26upx;
}

.tui-chat-right {
  justify-content: flex-end;
}

.tui-chat-center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28upx;
  font-size: 28upx;
  color: #666;
  padding-top: 36upx;
}

.tui-label {
  display: inline-block;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  font-size: 24upx;
  line-height: 24upx;
  margin-top: 36upx;
  padding: 12upx 16upx;
  text-align: center;
  border-radius: 8upx;
  margin-left: 50%;
  transform: translateX(-50%);
}

.tui-img-chatbox {
  position: relative;
}

.tui-img-chatbox::after {
  content: '';
  position: absolute;
  height: 200%;
  width: 200%;
  border: 1upx solid #eaeef1;
  transform-origin: 0 0;
  -webkit-transform-origin: 0 0;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  left: 0;
  top: 0;
  border-radius: 20upx;
}

.tui-chat-img {
  max-width: 200upx;
  /* min-height: 80upx; */
  display: block;
  border-radius: 10upx;
}

.tui-chat-flex {
  display: flex;
  align-items: center;
}

.tui-flex-center {
  display: flex;
  align-items: center;
}

.tui-chat-voice {
  width: 40upx;
  height: 40upx;
  display: block;
  flex-shrink: 0;
}

.tui-rotate {
  transform: rotate(180deg);
}

.tui-chat-fail {
  width: 50upx;
  height: 50upx;
  display: block;
  flex-shrink: 0;
}

.tui-mr {
  margin-right: 16upx;
}

.tui-ml {
  margin-left: 16upx;
}

.tui-flex-end {
  justify-content: flex-end;
}

.tui-flex-reverse {
  flex-direction: row-reverse;
}
.sendBtn {
  background: rgb(176, 239, 253);
  border-radius: 10rpx;
  padding: 10rpx 20rpx;
  color: #fff;
}
.sendable {
  background: rgb(0, 202, 252);
}
.navigator {
  color: rgb(0, 202, 252);
}
.dark {
  page {
    background: $my-bg-color-dark;
  }

  .tui-operation {
    background: #eff2fc;
  }

  .tui-operation::before {
    border-top: 1upx solid #eaeef1;
  }

  .tui-chat-operation {
    background: $my-bg-color-dark !important;
  }

  .tui-chat-input {
    background: $my-input-bg-color-dark;
  }

  .tui-chatbox {
    color: #fff;
  }

  .tui-chatbox-left {
    background: $my-view-bg-color-dark;
    border: 1upx solid $my-view-bg-color-dark;
  }

  .tui-chatbox-left::before {
    border-color: transparent $my-view-bg-color-dark transparent transparent;
  }

  .tui-chatbox-right {
    background: #a0d5f3;
    border: 1upx solid #a0d5f3;
  }

  .tui-chatbox-right::before {
    left: 100%;
    border-color: transparent transparent transparent #a0d5f3;
  }

  .tui-chat-center {
    color: #666;
  }

  .tui-label {
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
  }

  .tui-img-chatbox::after {
    border: 1upx solid #eaeef1;
  }
}
</style>
