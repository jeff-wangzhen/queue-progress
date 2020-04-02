<template>
  <view
    :class="['item-card ', this.isInfo ? '' : ' ellipsis ']"
    @longtap="longtap"
    @tap.stop="tap"
  >
    <view class="first-line">
      <view class="queue-id">
        <text v-text="item.id" />
      </view>
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
    <view class="description">
      <text v-text="item.description" />
    </view>
    <view class="last-line">
      <view class="creator">
        <image class="avatar" :src="item.creator.avatar" />
        <view class="name">
          <text v-text="item.creator.name" class="name-text" />
        </view>
      </view>
      <view class="action">
        <button
          class="cu-btn round button"
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
          class="cu-btn round button button-join"
          :class="joinButton.type"
          @tap.stop="join"
        >
          <text
            :class="joinButton.loading ? 'cuIcon-loading2 cuIconfont-spin' : ''"
            v-text="joinButton.loading ? '' : joinButton.text"
          ></text>
        </button>
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
      @tap="itemTap"
      @cancel="closeActionSheet"
    ></tui-actionsheet>

    <view class="cu-modal" :class="modalName == 'DialogModal' ? 'show' : ''">
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
            placeholder=""
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

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { formatDateTime } from "../common/js/helpers";
import { IitemList } from "../interface/query";
import tuiActionsheet from "@/components/actionsheet.vue";
@Component({
  components: { tuiActionsheet },
  filters: { formatDateTime },
})
export default class extends Vue {
  @Prop({ default: () => {} }) readonly item!: IitemList;
  @Prop({ type: Boolean, default: false }) readonly isInfo?: boolean;

  watchButton = { type: "bg-cyan", text: "关注", loading: false, status: -1 };
  joinButton = { type: "bg-blue", text: "加入", loading: false, status: -1 };
  modalName = "";
  showActionSheet = false;
  reportReason = "";
  nkAction = {
    actions: [
      {
        name: "主标题01",
        subName: "副标题01",
        value: "1",
      },
      {
        name: "主标题02",
        subName: "副标题02",
        value: "2",
      },
      {
        name: "主标题03",
        subName: "",
        value: "3",
      },
    ],
    show: false,
  };
  itemList = [
    {
      text: "关注",
      color: "#1a1a1a",
    },
    {
      text: "加入",
      color: "#1a1a1a",
    },
  ];
  mounted() {
    if (this.isInfo) {
      this.itemList.push({
        text: "举报",
        color: "#1a1a1a",
      });
    }
  }
  watch() {
    this.watchButton.loading = true;
    console.log("watch");
    if (this.watchButton.status === -1) {
      this.$http
        .post("/queue/watch", { data: { id: this.item.id } })
        .then((res: any) => {
          console.log(res);
          if (res.data.code === 0) {
            console.log(9);
            this.watchButton = {
              type: "bg-gray",
              text: "已关注",
              loading: false,
              status: 0,
            };
            // console.log(());
          }
        });
    } else {
      this.$http
        .delete("/queue/watch", { data: { id: this.item.id } })
        .then((res: any) => {
          console.log(res);
          if (res.data.code === 0) {
            console.log(9);
            this.watchButton = {
              type: "bg-gray",
              text: "关注",
              loading: false,
              status: -1,
            };
            // console.log(());
          }
        });
    }

    console.log(this.item.id);
  }
  join() {
    this.joinButton.loading = true;
    console.log("join");
    if (this.joinButton.status === -1) {
      if (this.item.joinCondition.type > 0) {
        if (this.isInfo) {
          uni.showToast({ title: "请输入验证信息后申请加入", icon: "none" });
          this.joinButton.loading = false;
          return false;
        } else {
          uni.navigateTo({
            url:
              "../queue-information/queue-information?showquestions=true&id=" +
              this.item.id,
          });
          // uni.showToast({
          //   title: "需要验证信息，请进入详情页操作",
          //   duration: 3000,
          //   icon: "none",
          // });
        }
      }
      this.$http
        .post("/queue/join", { data: { id: this.item.id } })
        .then((res: any) => {
          console.log(res);
          if (res.data.code === 0) {
            console.log(9);
            this.joinButton = {
              type: "default",
              text: "已加入",
              loading: false,
              status: 0,
            };
            // console.log(());
          }
        });
    } else {
      this.$http
        .delete("http://localhost/a.json", {
          data: { id: this.item.id },
        })
        .then((res: any) => {
          console.log(res);
          if (res.data.code === 0) {
            console.log(9);
            this.joinButton = {
              type: "primary",
              text: "加入",
              loading: false,
              status: -1,
            };
          }
        });
    }
    console.log(this.item.id);
  }
  tap() {
    if (this.isInfo) {
      return false;
    }
    uni.navigateTo({
      url: "../queue-information/queue-information?id=" + this.item.id,
    });
  }
  longtap() {
    this.showActionSheet = true;
  }
  closeActionSheet() {
    this.showActionSheet = false;
    return false;
  }
  selectReport() {
    this.modalName = "DialogModal";
    console.log("举报");
  }
  hideModal() {
    this.modalName = "";
    return false;
  }
  postReport() {
    console.log("提交", this.reportReason, this.reportReason.trim() == "");
    if (this.reportReason.trim() == "") {
      return false;
    }
    this.hideModal();
    uni.showToast({
      title: "已提交，感谢反馈！",
      icon: "success",
      duration: 1000,
    });
  }
  itemTap(e: any) {
    console.log("itemTap", e);
    if (e.index === 0) {
      this.watch();
    } else if (e.index === 1) {
      this.join();
    } else if (e.index === 2) {
      this.selectReport();
    }
    this.closeActionSheet();
    return false;
  }
}
</script>
<style lang="scss" scoped>
@import "../common/css/item-list-view.scss";
.textarea {
  text-align: left;
}
.person-number {
  display: inline-block;
}
</style>
