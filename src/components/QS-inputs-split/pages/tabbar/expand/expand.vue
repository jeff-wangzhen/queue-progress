<template>
  <view>
    <textView :content="content" />
    <itemList :itemList="items" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      content: "",
      items: [],
    };
  },
  methods: {},
};
</script>

<style></style>
