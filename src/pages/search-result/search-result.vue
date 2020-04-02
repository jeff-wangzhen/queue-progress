<template>
  <view :class="[isDark ? 'dark' : 'light']">
    <!-- <search @search="search" :keywordProp="keyword" /> -->
    <!-- <view class="cu-bar bg-white" v-if="scrollTopProp == -1">
      <view class="action">
        <text class="cuIcon-back text-gray"></text>
        返回
      </view>
      <view class="search-form round">
        <text class="cuIcon-search"></text>
        <input
          :adjust-position="false"
          type="text"
          placeholder="搜索图片、文章、视频"
          confirm-type="search"
          @confirm="search"
          v-model="keyword"
          @keyup.enter.native="search"
        />
      </view>
    </view> -->
    <!-- <cu-custom
      :bgColor="isDark ? 'bg-black' : 'bg-gradual-green'"
      :isBack="scrollTopProp === -1"
    >
      <block slot="backText" v-if="scrollTopProp === -1">返回</block>
      <block slot="content">
        {{ titleProp !== "" ? titleProp : "搜索结果" }}
      </block>
    </cu-custom> -->
    <view class="container">
      <view class="cu-bar search  " :class="isDark ? 'bg-black' : 'bg-white'">
        <view class="search-form round">
          <text class="cuIcon-search"></text>
          <input
            :style="isDark ? 'bg-black' : 'bg-white'"
            :adjust-position="false"
            type="text"
            placeholder="输入编号或队列名搜索"
            confirm-type="search"
            @confirm="search"
            v-model="keyword"
            @keyup.enter.native="search"
          />
        </view>
      </view>

      <view class="item-list-view">
        <skeleton v-if="showSkeleton" :num="10" />
        <template v-for="item in itemList">
          <item-card :key="item.id" :item="item" />
        </template>
      </view>
      <tui-scroll-top
        :scrollTop="scrollTopProp !== -1 ? scrollTopProp : scrollTop"
        :bottom="210"
        :right="20"
      />
      <uni-load-more
        :status="status"
        :icon-size="16"
        :content-text="contentText"
      />
    </view>
  </view>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import search from "@/components/search.vue";
import itemCard from "@/components/item-card.vue";
import skeleton from "@/components/skeleton.vue";
import uniLoadMore from "@/components/uni-load-more.vue";
// eslint-disable-next-line no-unused-vars1
import { Status } from "../../interface/queue";
import { IitemList, queryParamsType } from "../../interface/query";
import tuiScrollTop from "@/components/scroll-top.vue";

@Component({
  components: {
    itemCard,
    search,
    skeleton,
    uniLoadMore,
    tuiScrollTop,
  },
})
export default class abc extends Vue {
  @Prop({ type: Number, default: -1 }) scrollTopProp!: Number;
  @Prop({ type: String, default: "" }) titleProp!: String;
  @Prop({ type: Number, default: 0 }) pullDownRefreshProp!: Number;
  @Prop({ type: Number, default: 0 }) reachbottomProp!: Number;

  itemList: Array<IitemList> = [
    // {
    //   id: "1234567890123",
    //   title: "Lorem eu adipisicing sit",
    //   createTime: 1865936007354,
    //   personNum: 43,
    //   description: "dolore dolor",
    //   creator: "deserunt velit Lorem tempor occaecat",
    //   avatar: "https://dummyimage.com/64",
    // },
    // {
    //   id: "fgdgfd",
    //   title: "fdgfd",
    //   createTime: 1165936007354,
    //   personNum: 676,
    //   description: "dfdgfdgr",
    //   creator: "mhj",
    //   avatar: "https://dummyimage.com/64",
    // },
  ];
  showSkeleton = true;
  isShowTip = false;
  status: Status = Status.MORE;
  contentText = {
    contentdown: "上拉加载更多",
    contentrefresh: "加载中",
    contentnomore: "没有更多",
  };
  reload = false;
  tipOptions = {
    position: "bottom",
    msg: "已加载",
    duration: 1500,
    type: "primary",
  };
  keyword = "";
  queryParams?: queryParamsType = {};
  scrollTop = 0;
  @Watch("pullDownRefreshProp")
  pullDownRefreshPropchange() {
    // console.log(val, oldVal);
    this.pullDownRefreshHandler();
  }
  @Watch("reachbottomProp")
  reachbottomPropchange() {
    // console.log("sta1", val, oldVal);
    this.reachBottomHandler();
  }
  onPullDownRefresh() {
    // console.log("pul");
    this.pullDownRefreshHandler();
  }
  pullDownRefreshHandler() {
    this.reload = true;
    this.setItemList("top");
  }
  onReachBottom() {
    this.reachBottomHandler();
  }
  reachBottomHandler() {
    // console.log("sta", this.status);
    if (this.status === Status.NO_MORE) return;
    this.status = Status.MORE;
    this.setItemList("bottom");
  }
  mounted() {
    this.setItemList("initial");
  }

  onLoad(params: { keyword: string }) {
    //option为object类型，会序列化上个页面传递的参数
    console.log(params);
    this.keyword = params.keyword;
  }
  onPageScroll(e: any) {
    console.log("scroll-result");
    this.scrollTop = e.scrollTop;
  }
  get isDark(): boolean {
    return this.$store.state.others.isDark;
  }
  search(keyword: string) {
    this.getData({ keyword }).then((res: any) => {
      if (this.keyword === "") return false;
      const url = "../search-result/search-result?keyword=" + this.keyword;
      if (this.scrollTopProp === -1) {
        uni.redirectTo({
          url,
        });
      } else {
        uni.navigateTo({
          url,
        });
      }
      console.log(res);
    });
    console.log(keyword);
  }

  getData(queryParams?: queryParamsType): any {
    return this.$http.get("/queue/list", { data: queryParams });
  }
  setItemList(type: "top" | "bottom" | "initial") {
    this.status = Status.LOADING;
    let params: { firstId?: String; lastId?: String; length: Number } = {
      length: 10,
    };
    if (type === "top") {
      params.firstId = this.itemList[0].id;
    } else if (type === "bottom") {
      params.lastId = this.itemList[this.itemList.length - 1].id;
      console.log(params);
    }
    this.getData(params).then((res: any) => {
      uni.stopPullDownRefresh();
      console.log("qwe");
      this.showSkeleton = false;
      this.status = res.status;
      this.itemList = this.reload ? res.data.concat(this.itemList) : res.data;
      this.reload = false;
      // uni.showToast({
      //   title: "操作成功",
      //   icon: "success",
      //   duration: 1000,
      // });
    });
  }
}
</script>

<style lang="scss" scoped>
.item-list {
  padding: 8rpx;
}
// .dark {
//   background: $my-bg-color-dark;
//   .container {
//     min-height: 100vh;
//     background: $my-bg-color-dark;
//   }
//   page {
//     background: $my-bg-color-dark;
//   }
// }
</style>
