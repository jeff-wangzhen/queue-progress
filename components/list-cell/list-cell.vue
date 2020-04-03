<template>
  <view
    class="tui-cell-class tui-list-cell"
    :class="{
      'tui-cell-arrow': arrow,
      'tui-cell-last': last,
      'tui-line-left': lineLeft,
      'tui-line-right': lineRight,
      'tui-radius': radius,
    }"
    :hover-class="hover ? 'tui-cell-hover' : ''"
    :style="{
      fontSize: size + 'rpx',
      padding: padding,
    }"
    :hover-stay-time="150"
    @tap="handleTap"
    @click="handleClick"
  >
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'TuiListCell',
  props: {
    //是否有箭头
    arrow: {
      type: Boolean,
      default: false,
    },
    //是否有点击效果
    hover: {
      type: Boolean,
      default: true,
    },
    //left 30rpx
    lineLeft: {
      type: Boolean,
      default: true,
    },
    //right 30rpx
    lineRight: {
      type: Boolean,
      default: false,
    },
    padding: {
      type: String,
      default: '26rpx 30rpx',
    },
    last: {
      type: Boolean,
      default: false, //最后一条数据隐藏线条
    },
    radius: {
      type: Boolean,
      default: false,
    },
    bgcolor: {
      type: String,
      default: '#fff', //背景颜色
    },
    size: {
      type: Number,
      default: 32, //字体大小
    },
    color: {
      type: String,
      default: '#333', //字体颜色
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    handleClick(e) {
      this.$emit('tap', e);
      this.$emit('click', e);
    },
    handleTap(e) {
      this.$emit('tap', e);
      this.$emit('click', e);
    },
  },
};
</script>

<style lang="scss">
.tui-list-cell {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  align-items: center;
  background-color: $uni-bg-color;
}
.tui-radius {
  border-radius: 12rpx;
  overflow: hidden;
}

.tui-cell-hover {
  background: $my-view-bg-color-light-hover;
}

.tui-list-cell::after {
  content: '';
  position: absolute;
  border-bottom: 1rpx solid $my-border-color-light;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  bottom: 0;
  right: 0;
  left: 0;
}
.tui-line-left::after {
  left: 30rpx !important;
}

.tui-line-right::after {
  right: 30rpx !important;
}

.tui-cell-last::after {
  border-bottom: 0 !important;
}

.tui-list-cell.tui-cell-arrow:before {
  content: ' ';
  height: 11px;
  width: 11px;
  border-width: 2px 2px 0 0;
  border-color: $my-border-color-light;
  border-style: solid;
  -webkit-transform: matrix(0.5, 0.5, -0.5, 0.5, 0, 0);
  transform: matrix(0.5, 0.5, -0.5, 0.5, 0, 0);
  position: absolute;
  top: 50%;
  margin-top: -7px;
  right: 30rpx;
}

.dark {
  .tui-cell-hover {
    background-color: $my-view-bg-color-dark-hover !important;
  }
  .tui-list-cell {
    background-color: $my-view-bg-color-dark;
  }
  .tui-list-cell.tui-cell-arrow:before {
    border-color: $my-border-color-dark;
  }

  .tui-list-cell::after {
    border-bottom: 1rpx solid $my-border-color-dark;
  }
}
</style>
