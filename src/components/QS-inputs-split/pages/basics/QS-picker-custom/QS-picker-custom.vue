<template>
  <view>
    <QSPickerCustom
      ref="pickerCustom1"
      :name="formName"
      variableName="custom"
      title="自定义"
    />

    <QSPickerCustom
      ref="pickerCustom2"
      :name="formName"
      variableName="custom_1"
      title="自定义1"
      :steps="steps"
      linkage
      linkageNum="2"
      pickerTitle="picker-custom"
    />

    <QSPickerCustom
      ref="pickerCustom3"
      :name="formName"
      variableName="custom_2"
      title="自定义2"
      :steps="steps2"
      linkage
      linkageNum="3"
      pickerTitle="picker-custom"
    />

    <QSPickerCustom
      ref="pickerCustom4"
      :name="formName"
      variableName="custom_3"
      title="自定义3"
      :steps="steps3"
      linkage
      linkageNum="2"
      :customId3="customId3"
      async
      pickerTitle="picker-custom"
    />

    <button type="primary" style="margin-top: 50rpx;" @tap="getData">
      获取输入
    </button>
  </view>
</template>

<script>
import QSApp from "@/components/QS-inputs-split/js/app.js";
export default {
  data() {
    return {
      formName: "picker_custom",
      steps: {
        step_1_value: "value_1",
        step_2_item: "item_2",
      },
      steps2: {
        step_1_value: "value_1",
        step_2_value: "value_2",
        step_2_item: "item_2",
        step_3_item: "item_3",
      },
      steps3: {
        step_1_value: "name",
        step_2_value: "name",
      },
      customId3: {
        id: "001",
      },
    };
  },
  onReady() {
    this.setPickerData();
  },
  methods: {
    setPickerData() {
      const data1 = [["美食", "娱乐"]];

      const data2 = [
        {
          value_1: "蔬菜",
          item_2: ["青菜"],
        },
        {
          value_1: "荤菜",
          item_2: ["猪肉"],
        },
      ];

      const data3 = [
        {
          value_1: "浙江", //value_1变量名需与下方steps.step_1_value相同
          /*
					可添加多项自定义想要的数据
					*/
          item_2: [
            {
              //item_2变量名需与下方steps.step_2_item相同
              value_2: "金华", //value_2变量名需与下方steps.step_2_value相同
              /*
						可添加多项自定义想要的数据
						*/
              item_3: ["婺城区"], //item_3变量名需与下方steps.step_3_item相同
            },
            {
              value_2: "绍兴",
              item_3: ["越城区"],
            },
          ],
        },
        {
          value_1: "江苏",
          item_2: [
            {
              value_2: "南京",
              item_3: ["玄武区"],
            },
            {
              value_2: "无锡",
              item_3: ["锡山区"],
            },
          ],
        },
      ];

      const data4 = [
        {
          name: "a",
          value: "a",
        },
        {
          name: "b",
          value: "b",
        },
        {
          name: "c",
          value: "c",
        },
      ];

      this.setPickerDataFc("pickerCustom1", data1);
      this.setPickerDataFc("pickerCustom2", data2);
      this.setPickerDataFc("pickerCustom3", data3);
      this.setPickerDataFc("pickerCustom4", data4);
    },
    setPickerDataFc(name, data) {
      console.log("准备 调用setData");
      this.$refs[name].setData(data);
    },
    getData() {
      QSApp.getForm(this.formName)
        .then((res) => {
          console.log("获取FORM数据成功: " + JSON.stringify(res));
          uni.showToast({ title: "获取数据成功" });
        })
        .catch((err) => {
          console.log("获取FORM数据失败: " + JSON.stringify(err));
          uni.showToast({ title: "获取数据异常" });
        });
    },
  },
};
</script>

<style></style>
