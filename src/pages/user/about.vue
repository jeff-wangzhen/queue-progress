<template>
  <view :class="[isDark ? 'dark' : 'light']">
    <!-- <cu-custom :bgColor="isDark ? 'bg-black' : 'bg-gradual-green'" isBack>
      <block slot="content">
        关于
      </block>
    </cu-custom> -->

    <view class=" container">
      <view>
        <p class="p">
          这是我的毕业设计，本计划做得尽善尽美，给大学四年的学习画上一个圆满的句号。奈何世事难料，我在寒假期间经历了诸多波折，心绪不宁，本程序也未能完善，便已停止开发。
        </p>
        <p class="p">
          倘若将来得空，想起此不甘心一事，可能继续开发。
        </p>
        <p class="p">
          源代码: https://github.com/kill370354/queue-progress
        </p>
        <p class="inscribe">
          王振
        </p>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {},
})
export default class extends Vue {
  get isDark(): boolean {
    return this.$store.state.others.isDark;
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin: 50rpx 50rpx 0;
}
.p {
  text-indent: 2em;
}
.inscribe {
  text-align: right;
}

.dark {
  background: $my-bg-color-dark;
}
</style>
