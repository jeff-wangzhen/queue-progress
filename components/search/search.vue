<template>
  <view class="search-box">
    <view class="input-box">
      <input
        v-model="keyword"
        type="text"
        :placeholder="defaultKeyword"
        placeholder-class="placeholder-class"
        confirm-type="search"
        @confirm="goSearchResult"
      />
    </view>
    <view
      class="search-btn"
      hover-class="navigator-hover"
      @tap="goSearchResult"
    >
      搜索
    </view>

    <!-- 原样式3 end -->
  </view>
</template>

<script>
export default {
  components: {},
  props: { keywordProp: { type: String, default: '' } },
  data() {
    return {
      index: 2,
      btn: {
        text: '颜色：黄',
        backgroundColor: 'yellow',
        opacity: 0.6,
      },
      defaultKeyword: '请输入队列名或者完整编号',
      keyword: '',
    };
  },
  mounted() {
    //console.log(this.$props);
    this.keyword = this.keywordProp;
  },
  methods: {
    search(keyword) {
      //console.log(keyword);
      this.$emit('search', keyword);
    },
    blur() {
      uni.hideKeyboard();
    },
    //监听输入
    inputChange(event) {
      //console.log(event);
    },
    goSearchResult() {
      if (this.keyword === '') return false;
      const url = '../search-result/search-result?keyword=' + this.keyword;
      if (this.keywordProp !== '') {
        uni.redirectTo({
          url,
        });
      } else {
        uni.navigateTo({
          url,
        });
      }
    },
  },
};
</script>
<style lang="scss">
view {
  display: block;
}
.search-box {
  background-color: rgb(242, 242, 242);
  padding: 15upx 2.5%;
  display: flex;
  justify-content: space-between;
}
.search-box .input-box {
  width: 85%;
  flex-shrink: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.search-box .search-btn {
  width: 15%;
  margin: 0 0 0 2%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  font-size: 16px;
  color: #fff;
  background: linear-gradient(to right, #b3e5fc, #4fc3f7);
  border-radius: 60upx;
}
.search-box .input-box > input {
  width: 100%;
  height: 60upx;
  font-size: 16px;
  border: 0;
  border-radius: 60upx;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding: 0 3%;
  margin: 0;
  background-color: #fff;
}
.placeholder-class {
  color: #9e9e9e;
}
.dark {
  .search-box {
    background-color: #111;
  }
  .search-box .search-btn {
    color: #ccc;
    background: linear-gradient(
      to right,
      $my-view-bg-color-dark-from,
      $my-view-bg-color-dark-to
    );
  }

  .placeholder-class {
    color: #9e9e9e;
  }

  .search-box .input-box > input {
    color: #fff;
    background-color: #333;
  }
}
</style>
