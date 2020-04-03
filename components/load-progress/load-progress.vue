<template>
  <view
    class="load-progress"
    :class="loadProgress != 100 ? 'show' : 'hide'"
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
    <view
      v-if="loadProgress < 100"
      class="load-progress-spinner text-green"
    ></view>
  </view>
</template>

<script>
export default {
  props: { loadProgress: { type: Number, default: 0 } },
  data() {
    return {
      CustomBar: this.CustomBar,
    };
  },
};
</script>

<style></style>
