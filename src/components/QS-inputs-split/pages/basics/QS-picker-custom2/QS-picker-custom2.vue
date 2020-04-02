<template>
  <view>
    <QSPickerCustom2
      ref="pickerCustom1"
      :name="formName"
      variableName="custom"
      title="自定义"
      :steps="steps"
    />

    <QSPickerCustom2
      ref="pickerCustom2"
      :name="formName"
      variableName="custom_1"
      title="自定义1"
      :steps="steps1"
      linkage
      linkageNum="2"
      pickerTitle="picker-custom2"
    />

    <QSPickerCustom2
      ref="pickerCustom3"
      :name="formName"
      variableName="custom_2"
      title="自定义2"
      :steps="steps2"
      linkage
      linkageNum="3"
      pickerTitle="picker-custom2"
    />

    <QSPickerCustom2
      ref="pickerCustom4"
      :name="formName"
      variableName="custom_3"
      title="自定义3"
      :steps="steps3"
      linkage
      linkageNum="2"
      :customId3="customId3"
      async
      pickerTitle="picker-custom2"
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
        step_1_value: "name", //第一级显示的属性名
      },

      steps1: {
        step_1_value: "name", //第一级显示的属性名
      },

      steps2: {
        step_1_value: "name", //第一级显示的属性名
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
      const data1 = [
        [
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
        ],
        [
          {
            name: "d",
            value: "d",
          },
          {
            name: "e",
            value: "e",
          },
          {
            name: "f",
            value: "f",
          },
        ],
      ];

      const data2 = {
        step_1: [
          {
            name: "蔬菜",
            value: "001",
          },
          {
            name: "荤菜",
            value: "002",
          },
        ],
        step_2: [
          ["青菜", "白菜"], //对应step_1的蔬菜
          ["猪肉", "牛肉"], //对应step_1的荤菜
        ],
      };

      const data3 = {
        step_1: [
          {
            name: "江西",
          },
          {
            name: "山东",
          },
        ],
        step_2: [
          ["南昌", "九江"], //对应step_1的江西
          ["济南", "青岛"], //对应step_1的山东
        ],
        step_3: [
          [
            [
              //对应step_2的南昌
              "东湖",
            ],
            [
              //对应step_2的九江
              "德安",
            ],
          ],
          [
            [
              //对应step_2的济南
              "历下",
            ],
            [
              //对应step_2的青岛
              "市南",
            ],
          ],
        ],
      };

      const data4 = {
        step_1: [
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
        ],
      };

      this.setPickerDatac("pickerCustom1", data1);
      this.setPickerDatac("pickerCustom2", data2);
      this.setPickerDatac("pickerCustom3", data3);
      this.setPickerDatac("pickerCustom4", data4);
    },
    setPickerDatac(name, data) {
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
