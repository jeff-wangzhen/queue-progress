<template>
  <view>
    <QSInfinitePics
      ref="infinitePics"
      name="infinitePics"
      variableName="infinitePics"
      title="上传图片"
      v-model="picsData"
    ></QSInfinitePics>
    <QSInfinitePics
      ref="infinitePics_sort"
      name="infinitePics"
      variableName="infinitePics_sort"
      title="开启排序选择模式"
      sortSelection
      v-model="sortSelectionData"
    ></QSInfinitePics>
    <button type="primary" @tap="getUpload">上传图片</button>
    <button type="primary" @tap="getUploadAll">上传多项</button>
    <button type="primary" @tap="getForm">获取表单</button>
  </view>
</template>

<script>
import QSApp from "@/components/QS-inputs-split/js/app.js";
export default {
  data() {
    return {
      picsData: [],
      sortSelectionData: [],
    };
  },
  methods: {
    getUpload() {
      const upload = this.$refs.infinitePics.getUpLoadPromiseArray();
      upload
        .then((res) => {
          console.log("上传成功:" + JSON.stringify(res));
        })
        .catch((err) => {
          console.log("上传失败:" + JSON.stringify(err));
        });
    },
    getUploadAll() {
      const upload1 = this.$refs.infinitePics.getUpLoadPromiseArray();
      const upload2 = this.$refs.infinitePics_sort.getUpLoadPromiseArray();
      const promiseArr = [upload1, upload2];
      Promise.all(promiseArr)
        .then((res) => {
          console.log("上传成功:" + JSON.stringify(res));
        })
        .catch((err) => {
          console.log("上传失败:" + JSON.stringify(err));
        });
    },
    getForm() {
      QSApp.getForm("infinitePics")
        .then((res) => {
          console.log("获取表单数据成功:" + JSON.stringify(res));
        })
        .catch((err) => {
          console.log("获取表单数据失败:" + JSON.stringify(err));
        });
    },
  },
};
</script>

<style></style>
