<template>
  <view
    :class="['item-card ']"
    @longtap.stop="longtap"
    @tap.stop="tap"
    :data-queueId="item.queueId"
  >
    <view class="first-line">
      <view class="queue-id"><text v-text="item.queueId" /></view>
      <view class="person-number">
        <text v-text="item.personNum + '人'"></text>
      </view>
      <view class="start-time">
        <text
          v-text="
            $options.filters.formatDateTime(
              item.startTime,
              'yyyy年M月D日 hh:mm'
            ) + ' 开始'
          "
        />
      </view>
    </view>
    <view class="title" v-text="item.title"></view>
    <view class="description"><text v-text="item.description"></text></view>
    <view class="images" v-if="isInfo">
      <block v-for="img in item.imgList" :key="img">
        <image
          class="image"
          :src="img"
          @tap.stop="ViewImage"
          :data-url="img"
        ></image>
      </block>
    </view>
    <view class="last-line">
      <view class="creator" v-if="item.creator">
        <image class="avatar" :src="item.creator.avatar" />
        <view class="name">
          <text v-text="item.creator.name" class="name-text" />
        </view>
      </view>
      <view class="action">
        <view v-if="isCreator" class="buttons">
          <button class="cu-btn round button bg-blue" @tap.stop="modify">
            修改
          </button>
          <button
            class="cu-btn round button button-join bg-cyan"
            @tap.stop="manage"
          >
            管理
          </button>
        </view>
        <view v-else>
          <button
            class="cu-btn round button "
            :class="watchButton.type"
            @tap.stop="watch"
          >
            <text
              :class="
                watchButton.loading ? 'cuIcon-loading2 cuIconfont-spin' : ''
              "
              v-text="watchButton.loading ? '' : watchButton.text"
            ></text>
          </button>
          <button
            v-if="joinEnable"
            class="cu-btn round button button-join "
            :class="joinButton.type"
            @tap.stop="join"
          >
            <text
              :class="
                joinButton.loading ? 'cuIcon-loading2 cuIconfont-spin' : ''
              "
              v-text="joinButton.loading ? '' : joinButton.text"
            ></text>
          </button>
        </view>
      </view>
    </view>
    <view class="create-time" v-if="isInfo">
      <text
        v-text="
          '创建于 ' +
            $options.filters.formatDateTime(
              item.createTime,
              'yyyy年M月D日 hh:mm'
            )
        "
      ></text>
    </view>

    <tui-actionsheet
      :show="showActionSheet"
      :item-list="itemList"
      @click="itemTap"
      @cancel="closeActionSheet"
    ></tui-actionsheet>

    <view @tap.stop="" v-if="showPrompt">
      <prompt
        @input="promptInput"
        @onConfirm="onConfirm"
        @onCancel="onCancel"
        title="提示"
        :text="promptText"
      ></prompt>
    </view>

    <view v-if="showModal" class="cu-modal show" @tap.stop="">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">请说明举报理由</view>
          <view class="action" @tap="hideModal">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding-xl">
          <textarea
            class="textarea"
            maxlength="1000"
            placeholder-class="phcolor"
            v-model="reportReason"
          ></textarea>
        </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action">
            <button class="cu-btn line-green text-green" @tap="hideModal">
              取消
            </button>
            <button class="cu-btn bg-green margin-left" @tap="postReport">
              提交
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { formatDateTime } from '../../common/js/common.js';
import tuiActionsheet from '@/components/actionsheet/actionsheet.vue';
import prompt from '@/components/prompt/prompt.vue';
export default {
  components: { tuiActionsheet, prompt },
  filters: { formatDateTime },
  props: {
    showPromptProp: { type: Boolean, default: false },
    promptTextProp: { type: String, default: '' },
    queueItem: { type: Object, default: () => ({}) },
    isInfo: { type: Boolean, default: false },
  },
  data() {
    return {
      item: { joinCondition: {} },
      showPrompt: false,
      promptText: '',
      watchNotifyNumber: 2,
      joinNotifyNumber: 2,
      watchAddButton: {
        type: 'bg-cyan',
        text: '关注',
        loading: false,
        status: -1,
      },
      joinAddButton: {
        type: 'bg-blue',
        text: '加入',
        loading: false,
        status: -1,
      },
      watchCancelButton: {
        type: 'bg-grey',
        text: '已关注',
        loading: false,
        status: 0,
      },
      joinCancelButton: {
        type: 'bg-grey',
        text: '已加入',
        loading: false,
        status: 0,
      },
      showModal: false,
      showActionSheet: false,
      reportReason: '',
      itemList: [
        {
          text: '举报',
          color: '#1a1a1a',
        },
      ],
      isWatched: this.queueItem.isWatched,
      isJoined: this.queueItem.isJoined,
    };
  },
  watch: {
    queueItem: {
      handler(newVal) {
        this.item = newVal;
      },
      deep: true,
    },
    showPromptProp: {
      handler(newVal) {
        this.showPrompt = newVal;
        this.promptText = '当排第几位时通知您？';
      },
    },
  },
  computed: {
    joinEnable() {
      return (
        this.item.state === 'OK' &&
        this.item.startTime <= Date.now() &&
        this.item.number < this.item.maxPeopleCount
      );
    },
    isCreator() {
      return (
        this.item.creator &&
        this.$store.state.user.userId === this.item.creator.userId
      );
    },
    watchButton() {
      return this.isWatched ? this.watchCancelButton : this.watchAddButton;
    },
    joinButton() {
      return this.isJoined ? this.joinCancelButton : this.joinAddButton;
    },
  },
  onShow() {
    //console.log(8);
    uni.hideLoading();
  },
  mounted() {
    this.item = this.queueItem;
    //console.log(
    //   'item',
    //   this.item,
    //   this.$store.state.user.userId,
    //   this.item.creatorId,
    //   this.$store.state.user.userId === this.item.creatorId
    // );
  },
  methods: {
    modify() {
      //console.log('modify');
      let that = this;
      uni.navigateTo({
        url:
          '/pages/add-queue/add-queue?isModify=true&queueId=' +
          that.item.queueId,
      });
    },
    manage() {
      //console.log('manage');
      uni.navigateTo({
        url:
          '/pages/manager-queue/manager-queue?queueId=' +
          this.queueItem.queueId,
      });
    },
    addWatch(sendable) {
      let that = this;
      that.watchAddButton.loading = true;
      let clientId;
      try {
        var info = plus.push.getClientInfo();
        clientId = info.clientId;
      } catch (e) {}
      uniCloud
        .callFunction({
          name: 'watchQueue',
          data: {
            userId: that.$store.state.user.userId,
            queueId: that.item.queueId,
            type: 'ADD',
            token: that.$store.state.user.token,
            watchNotifyNumber: that.watchNotifyNumber,
            clientId,sendable
          },
        })
        .then(res => {
          //console.log(res);
          if (res.result.code === 0) {
            that.isWatched = true;
            // //console.log(());
          } else {
            uni.showToast({
              title: res.result.msg,
              icon: 'none',
            });
          }

          that.watchAddButton.loading = false;
        });
    },
    removeJoin() {
      let that = this;
      uni.showModal({
        content: '是否退出该队列？',
        success(res) {
          if (res.confirm) {
            that.joinCancelButton.loading = true;
            uniCloud
              .callFunction({
                name: 'joinQueue',
                data: {
                  userId: that.$store.state.user.userId,
                  queueId: that.item.queueId,
                  type: 'QUIT',
                  token: that.$store.state.user.token,
                },
              })
              .then(res => {
                //console.log(res);
                if (res.result.code === 0) {
                  that.isJoined = false;
                  that.item.personNum--;
                } else {
                  uni.showToast({
                    title: res.result.msg,
                    icon: 'none',
                  });
                }

                that.joinCancelButton.loading = false;
              });
          }
        },
      });
    },
    removeWatch() {
      let that = this;
      uni.showModal({
        content: '是否取消关注该队列？',
        success(res) {
          if (res.confirm) {
            that.watchCancelButton.loading = true;
            uniCloud
              .callFunction({
                name: 'watchQueue',
                data: {
                  userId: that.$store.state.user.userId,
                  queueId: that.item.queueId,
                  type: 'DELETE',
                  token: that.$store.state.user.token,
                },
              })
              .then(res => {
                //console.log(res);
                if (res.result.code === 0) {
                  that.isWatched = false;
                  // //console.log(());
                } else {
                  uni.showToast({
                    title: res.result.msg,
                    icon: 'none',
                  });
                }

                that.watchCancelButton.loading = false;
              });
          }
        },
      });
    },
    addJoin(sendable) {
      let that = this;
      if (that.isInfo && that.item.joinCondition.type !== 'NO')
        return that.$emit('confirm', _cost);
      that.joinAddButton.loading = true;
      let clientId;
      try {
        var info = plus.push.getClientInfo();
        clientId = info.clientId;
      } catch (e) {}
      uniCloud
        .callFunction({
          name: 'joinQueue',
          data: {
            userId: that.$store.state.user.userId,
            queueId: that.item.queueId,
            type: 'ADD',
            token: that.$store.state.user.token,
            joinNotifyNumber: that.joinNotifyNumber,
            clientId,
            sendable,
          },
        })
        .then(res => {
          //console.log(res);
          if (res.result.code === 0) {
            that.isJoined = true;
            that.item.personNum++;
          } else {
            uni.showToast({
              title: res.result.msg,
              icon: 'none',
            });
          }
          that.joinAddButton.loading = false;
        });
    },
    watch() {
      // console.log('watchQueue');
      let that = this;
      if (this.$store.state.user.userId === '') {
        uni.showToast({ title: '请登录', icon: 'none' });
        return;
      }
      if (this.isWatched) {
        that.removeWatch();
      } else {
        that.showPrompt = true;
        that.promptText = '当队列人数为多少时通知您？';
      }

      //console.log(this.item.queueId);
    },
    join() {
      const that = this;
      //console.log('join');
      if (this.$store.state.user.userId === '') {
        uni.showToast({ title: '请登录', icon: 'none' });
        return;
      }

      if (this.isJoined) {
        that.removeJoin();
      } else {
        if (this.item.joinCondition.type !== 'NO') {
          if (this.isInfo) {
            uni.showToast({ title: '请提交验证信息', icon: 'none' });

            return false;
          } else {
            uni.navigateTo({
              url:
                '../queue-information/queue-information?showquestions=true&queueId=' +
                this.item.queueId,
            });
          }
        } else {
          that.showPrompt = true;
          that.promptText = '当排在第几位时通知您？';
        }
      }
      //console.log(this.item.queueId);
    },
    tap() {
      if (this.showActionSheet) {
        return false;
      }
      //console.log(5555, getCurrentPages());
      // uni.showLoading({ mask: true,title:"正在跳转" });

      uni.navigateTo({
        url:
          '../queue-information/queue-information?queueId=' + this.item.queueId,
      });
    },
    selectReport() {
      this.showModal = true;
      //console.log('举报');
    },
    hideModal() {
      this.showModal = false;
      return false;
    },
    ViewImage(e) {
      uni.previewImage({
        urls: this.item.imgList,
        current: e.currentTarget.dataset.url,
      });
    },
    postReport() {
      let that = this;
      //console.log('提交', this.$data, this.reportReason.trim() == '');
      if (this.reportReason.trim() == '') {
        uni.showToast({
          title: '内容不能为空',
          icon: 'none',
        });
        return false;
      }
      uni.showLoading({ title: '加载中' });
      uniCloud
        .callFunction({
          name: 'postReport',
          data: {
            token: that.$store.state.user.token,
            userId: that.$store.state.user.userId,
            queueId: that.item.queueId,
            reportReason: that.reportReason,
          },
        })
        .then(res => {
          //console.log(res);
          uni.hideLoading();
          if (res.result.code === 0) {
            that.reportReason = '';
            uni.showToast({
              title: '提交成功',
              icon: 'success',
            });
            this.showModal = false;
          } else {
            uni.showToast({ icon: 'none', title: res.result.msg });
          }
        });
    },
    longtap(e) {
      //console.log('long', e);
      this.showActionSheet = true;
    },
    closeActionSheet() {
      //console.log(9);
      this.showActionSheet = false;
      // return false;
    },
    itemTap(e) {
      //console.log('itemTap', e);
      if (e.index === 0) {
        this.selectReport();
      }
      this.closeActionSheet();
      // return false;
    },

    onConfirm(e) {
      let that = this;
      //console.log(e);
      let _cost = parseInt(e);
      if (Object.is(_cost, NaN)) {
        return;
      } else {
        if (
          that.promptText.includes('队列人数') &&
          _cost === that.queueItem.personNum
        ) {
          uni.showModal({
            content: '不能恰好为当前人数',
            showCancel: false,
          });
          return;
        }

        that.showPrompt = false;
        if (that.promptText.includes('队列人数')) {
          that.watchNotifyNumber = _cost;
          // #ifdef MP-WEIXIN
          that.subscribe('WATCH');
          // #endif
          // #ifndef MP-WEIXIN

          that.addWatch(false);
          // #endif
        } else {
          that.joinNotifyNumber = _cost;

          // #ifdef MP-WEIXIN
          that.subscribe('JOIN');
          // #endif
          // #ifndef MP-WEIXIN

          that.addJoin(false);
          // #endif
        }
      }
    },
    subscribe(type) {
      let that = this;
      wx.getSetting({
        withSubscriptions: true,
        success(res) {
          if (
            res.subscriptionsSetting &&
            res.subscriptionsSetting.itemSettings &&
            res.subscriptionsSetting.itemSettings
              .WXR393UHeqYRLpWstLPH73Yoj9yPtunFx76tt9AYb7Y === 'accept'
          ) {
            console.log('已经授权');
            if (type === 'WATCH') that.addWatch(true);
            else that.addJoin(true);
          } else {
            wx.requestSubscribeMessage({
              tmplIds: ['WXR393UHeqYRLpWstLPH73Yoj9yPtunFx76tt9AYb7Y'],
              success(res) {
                // console.log(res);
                if (
                  res.WXR393UHeqYRLpWstLPH73Yoj9yPtunFx76tt9AYb7Y === 'accept'
                ) {
                  uni.showToast({
                    title: '订阅成功',
                  });
                  console.log('订阅成功');
                  if (type === 'WATCH') that.addWatch(true);
                  else that.addJoin(true);
                } else {
                  uni.showModal({
                    content: '授权失败，请设为允许或进入小程序查看进度',
                    showCancel: false,
                  }); if (type === 'WATCH') that.addWatch(false);
                  else that.addJoin(false);
                }
              },
            });
          }
        },
      });
    },
    onCancel() {
      this.showPrompt = false;
    },
    promptInput(e) {
      // console.log(e);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../common/css/item-list-view.scss';
.textarea {
  text-align: left;
}
.person-number {
  display: inline-block;
}
.images {
  text-align: center;
  margin-bottom: 20px;
}
</style>
