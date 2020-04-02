<template>
  <view :class="[isDark ? 'dark' : 'light']">
    <!-- <cu-custom :bgColor="isDark ? 'bg-black' : 'bg-gradual-green'" isBack>
      <block slot="backText">返回</block>
      <block slot="content">
        我创建的队列
      </block>
    </cu-custom> -->
    <view
      class="load-progress"
      :class="loadProgress != 0 ? 'show' : 'hide'"
      :style="[{ top: CustomBar + 'px' }]"
    >
      <view
        class="load-progress-bar bg-green"
        :style="[
          {
            transform: 'translate3d(-' + (100 - loadProgress) + '%, 0px, 0px)',
          },
        ]"
      ></view>
      <view class="load-progress-spinner text-green"></view>
    </view>
    <view class="" v-for="item in itemList" :key="item.id">
      <tui-swipe-action
        :actions="getActions(item.state)"
        @click="handlerButton"
        :params="item"
      >
        <template v-slot:content>
          <view
            class="item"
            @tap.stop="
              $utils.goPage({
                url: '../queue-information/queue-information?id=' + item.id,
              })
            "
          >
            <view class="title" v-text="item.title"></view>
            <view v-text="item.personNum + ' 人'"></view>
          </view>
        </template>
      </tui-swipe-action>
    </view>
  </view>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Status } from "../../interface/queue";
import { queryParamsType, IitemList } from "../../interface/query";
import tuiSwipeAction from "@/components/swipe-action.vue";
@Component({
  components: { tuiSwipeAction },
})
export default class extends Vue {
  CustomBar: any = this.CustomBar;
  isLoad = false;
  loadModal = false;
  loadProgress = 0;
  itemList: Array<IitemList> = [];
  status: Status = Status.MORE;
  reload = false;
  basicActions = [
    {
      name: "删除",
      color: "#fff",
      fontsize: 30, //单位upx
      width: 80, //单位px
      //icon: 'like.png',//此处为图片地址
      background: "#dd524d",
    },
  ];
  get isDark(): boolean {
    // goPage(9);
    return this.$store.state.others.isDark;
  }
  created() {
    this.LoadProgress();
  }
  mounted() {
    this.setItemList("initial");
  }
  onPullDownRefresh() {
    console.log("下拉刷新");
    this.reload = true;
    this.setItemList("top");
  }
  onReachBottom() {
    console.log("触底加载");
    this.setItemList("bottom");
  }
  getActions(state: string) {
    let actionsTemp = JSON.parse(JSON.stringify(this.basicActions));
    if (state == "ok") {
      actionsTemp.unshift({
        name: "停止",
        color: "#fff",
        fontsize: 30, //单位upx
        width: 80, //单位px
        //icon: 'like.png',//此处为图片地址
        background: "#f0ad4e",
      });
    } else {
      actionsTemp.unshift({
        name: "继续",
        color: "#fff",
        fontsize: 30, //单位upx
        width: 80, //单位px
        //icon: 'like.png',//此处为图片地址
        background: "#007aff",
      });
    }

    return actionsTemp;
  }
  handlerButton(e: any) {
    let index = e.index;
    let item = e.item;
    console.log(index, item);
    if (index === 0) {
      if (item.state == "ok") {
        item.state = "stop";
      } else {
        item.state = "ok";
      }
    } else if (index === 1) {
      console.log(item.id);
      this.itemList = this.itemList.filter((value) => value.id !== item.id);
      item.state = "deleted";
    }
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
      this.loadProgress = 100;
      this.status = res.status;
      this.itemList = this.reload ? res.data.concat(this.itemList) : res.data;
      this.reload = false;
      uni.showToast({
        title: "操作成功",
        icon: "success",
        duration: 1000,
      });
    });
  }
  LoadProgress() {
    this.loadProgress = this.loadProgress + 3;
    if (this.loadProgress < 100) {
      setTimeout(() => {
        this.LoadProgress();
      }, 100);
    } else {
      this.loadProgress = 0;
    }
  }
}
</script>
<style lang="scss">
.tui-swipeout-wrap {
  margin: 10px 0;
  background-color: transparent;
}
.item {
  display: flex;
  justify-content: space-between;
  padding: 10px 10px;
  background: $my-bg-color-light;
}
.title {
  overflow: hidden;
  max-width: 70%;
  text-overflow: ellipsis;
}
.dark {
  .item {
    background-color: $my-view-bg-color-dark;
  }
}
</style>
