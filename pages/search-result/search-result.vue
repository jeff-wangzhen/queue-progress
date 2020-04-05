<template>
  <view :class="isDark ? 'dark' : 'light'">
    <cu-custom
      :bgColor="isDark ? 'bg-black' : 'bg-gradual-green'"
      :isBack="scrollTopProp === -1"
    >
      <block slot="backText" v-if="scrollTopProp === -1">返回</block>
      <block slot="content">
        {{ titleProp !== '' ? titleProp : '搜索结果' }}
      </block>
    </cu-custom>
    <view class="container">
      <view class="cu-bar search  " :class="isDark ? 'bg-black' : 'bg-white'">
        <view class="search-form round">
          <text class="cuIcon-search"></text>
          <input
            :style="isDark ? 'bg-black' : 'bg-white'"
            :adjust-position="false"
            type="text"
            placeholder="输入完整编号或队列名搜索"
            confirm-type="search"
            @confirm="search"
            v-model="keyword"
            @keyup.enter="search"
          />
        </view>
      </view>

      <view class="item-list-view">
        <skeleton v-if="showSkeleton" :num="10" />
        <view v-else>
          <view v-for="item in itemList" :key="item.queueId">
            <view class="item-card"><item-card :queueItem="item" /></view>
          </view>
          <tui-scroll-top
            :scrollTop="scrollTopProp !== -1 ? scrollTopProp : scrollTop"
            :bottom="210"
            :right="20"
          />
          <view @tap.stop="reachBottomHandler">
            <uni-load-more :status="status" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import search from '@/components/search/search.vue';
import itemCard from '@/components/item-card/item-card.vue';
import skeleton from '@/components/skeleton/skeleton.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import tuiScrollTop from '@/components/scroll-top/scroll-top.vue';

export default {
  components: { itemCard, search, skeleton, uniLoadMore, tuiScrollTop },
  props: {
    scrollTopProp: { type: Number, default: -1 },
    titleProp: { type: String, default: '' },
    pullDownRefreshProp: { type: Number, default: 0 },
    reachBottomProp: { type: Number, default: 0 },
  },
  data() {
    return {
      user: this.$store.state.user,
      itemList: [],
      showSkeleton: false,
      isShowTip: false,
      status: 'MORE',

      reload: false,
      tipOptions: {
        position: 'BOTTOM',
        msg: '已加载',
        duration: 1500,
        type: 'primary',
      },
      keyword: '',
      queryParams: {},
      scrollTop: 0,
    };
  },
  watch: {
    '$store.state.user.userId': {
      handler() {
        //console.log('userchange search-result');
        this.pullDownRefreshHandler();
      },
    },
    pullDownRefreshProp() {
      //console.log(99999999999999);
      this.pullDownRefreshHandler();
    },
    reachBottomProp(val) {
      //console.log('reach', val);
      this.reachBottomHandler();
    },
  },

  onLoad(params) {
    //option为object类型，会序列化上个页面传递的参数
    //console.log(77777777774, params);

    if (params && params.keyword) {
      this.keyword = params.keyword;
      this.setItemList('TOP');
    }
    // this.pullDownRefreshHandler();
  },
  onPageScroll(e) {
    //console.log('scroll-result');
    this.scrollTop = e.scrollTop;
  },
  onPullDownRefresh() {
    // //console.log("pul");
    this.pullDownRefreshHandler();
  },
  onReachBottom() {
    this.reachBottomHandler();
  },
  methods: {
    pullDownRefreshHandler() {
      this.reload = true;
      this.showSkeleton = true;
      this.setItemList('TOP');
    },
    reachBottomHandler() {
      //console.log('reachBottomHandler ', this.status);
      if (this.status === 'NO_MORE') return;

      this.setItemList('BOTTOM');
    },
    search() {
      if (this.keyword === '') return this.setItemList('TOP');
      const url = '../search-result/search-result?keyword=' + this.keyword;
      if (this.scrollTopProp === -1) {
        uni.redirectTo({
          url,
        });
      } else {
        uni.navigateTo({
          url,
        });
      }
      // //console.log(res);
      // });
    },

    setItemList(type) {
      let that = this;
      this.status = 'LOADING';
      let params = {
        userId: that.$store.state.user.userId,
        type: 'GETLIST',
      };
      if (this.keyword) {
        params.keyword = this.keyword;
      }
      if (type === 'BOTTOM' || !this.reload) {
        //console.log('BOTTOM');
        params.lastId =
          this.itemList.length > 0
            ? this.itemList[this.itemList.length - 1].queueId
            : Date.now();
      } else {
        //console.log('TOP');

        that.showSkeleton = true;
      }
      //console.log('params', params);

      this.$getQueueList(params).then(res => {
        uni.stopPullDownRefresh();
        //console.log('qwe', res);
        that.reload = false;
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
          that.itemList = [];
        }
        let temp = that.itemList.concat(res.result.data);

        let hash = {};
        that.itemList = temp.reduce((preVal, curVal) => {
          hash[curVal.createTime]
            ? ''
            : (hash[curVal.createTime] = true && preVal.push(curVal));
          return preVal;
        }, []);
        that.showSkeleton = false;
      });
    },
  },
  computed: {
    isDark() {
      return this.$store.state.others.isDark;
    },
  },
};
</script>

<style lang="scss" scoped>
.item-list {
  padding: 8rpx;
}
.container {
  background-color: #fff;
}
.item-card {border-radius:30rpx;
  margin: 20rpx 0;
  background-color: rgb(245, 245, 245);
}
.none {
  height: 200rpx;
  line-height: 200rpx;
  text-align: center;
}
.dark {
  .container {
    background-color: $my-bg-color-dark;
  }
  .item-card,
  .sketch {
    background-color: $my-view-bg-color-dark;
    color: $my-text-color-dark;
  }
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
