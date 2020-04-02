<template>
  <view>
    <!-- input -->
    <QSInput
      :name="name"
      titleColor="#f1505c"
      variableName="input"
      required
      layout="column"
      title="input"
      v-model="form.input"
    ></QSInput>
    <!-- textarea -->
    <QSTextarea
      :name="name"
      titleStyle="color:#f1505c;"
      variableName="textarea"
      required
      layout="column"
      title="textarea"
      v-model="form.textarea"
    ></QSTextarea>
    <!-- switch -->
    <QSwitch
      :name="name"
      variableName="switch"
      required
      title="switch"
      v-model="form.switch"
    ></QSwitch>
    <!-- radio -->
    <QSRadio
      :name="name"
      variableName="radio"
      layout="column"
      title="radio"
      v-model="form.radio"
      :itemArray="radio_itemArray"
    ></QSRadio>
    <!-- checkbox -->
    <QSCheckbox
      :name="name"
      variableName="checkbox"
      layout="column"
      title="checkbox"
      v-model="form.checkbox"
      :itemArray="checkbox_itemArray"
    ></QSCheckbox>
    <!-- pics -->
    <QSPics
      :name="name"
      variableName="pics"
      title="pics"
      v-model="form.pics"
    ></QSPics>
    <!-- infinitePics -->
    <QSInfinitePics
      :name="name"
      variableName="infinitePics"
      title="infinitePics"
      v-model="form.infinitePics"
    ></QSInfinitePics>
    <!-- infinitePics 排序选择模式 -->
    <QSInfinitePics
      :name="name"
      variableName="infinitePics_sort"
      title="排序上传"
      v-model="form.infinitePics_sort"
      sortSelection
    ></QSInfinitePics>
    <!-- picker-date -->
    <QSPickerDate
      :name="name"
      variableName="picker_date"
      title="picker-date"
      v-model="form.picker_date"
    ></QSPickerDate>
    <!-- picker-city -->
    <QSPickerCity
      :name="name"
      variableName="picker_city"
      title="picker-city"
      v-model="form.picker_city"
    ></QSPickerCity>
    <!-- picker_custom -->
    <QSPickerCustom
      ref="pickerCustom"
      :name="name"
      variableName="picker_custom"
      title="picker-custom"
      v-model="form.picker_custom"
      :steps="steps_custom"
      pickerTitle="picker-custom"
      linkage
      linkageNum="3"
    ></QSPickerCustom>
    <!-- picker_custom2 -->
    <QSPickerCustom2
      ref="pickerCustom2"
      :name="name"
      variableName="picker_custom2"
      title="picker-custom2"
      v-model="form.picker_custom2"
      :steps="steps_custom2"
      pickerTitle="picker-custom2"
      linkage
      linkageNum="3"
    ></QSPickerCustom2>

    <view style="height: 50px;"></view>

    <button type="primary" @tap="getForm">获取表单数据</button>

    <view style="height: 200px;"></view>
  </view>
</template>

<script>
import QSApp from "@/components/QS-inputs-split/js/app.js";
export default {
  data() {
    return {
      name: "demo",
      form: {
        input: "",
        textarea: "",
        switch: true,
        radio: "",
        checkbox: [],
        pics: [{ name: "测试" }],
        infinitePics: [],
        infinitePics_sort: [],
        picker_date: {},
        picker_city: {},
        picker_custom: {},
        picker_custom2: {},
      },
      radio_itemArray: [
        {
          name: "男",
          value: "男",
        },
        {
          name: "女",
          value: "女",
        },
      ],
      checkbox_itemArray: [
        {
          name: "哈利波特",
          value: "哈利波特",
          color: "#f5105c",
        },
        {
          name: "魔戒",
          value: "魔戒",
          color: "#888",
        },
        {
          name: "玩具总动员",
          value: "玩具总动员",
        },
        {
          name: "硬核亨利",
          value: "硬核亨利",
        },
      ],
      steps_custom: {
        step_1_value: "value_1",
        step_2_value: "value_2",
        step_2_item: "item_2",
        step_3_item: "item_3",
      },
      steps_custom2: {
        step_1_value: "name",
      },
    };
  },
  onReady() {
    this.getPickerData();
  },
  methods: {
    getForm() {
      console.log("准备获取表单数据");
      QSApp.getForm(this.name)
        .then((res) => {
          uni.showToast({
            title: "获取表单数据成功",
          });
          console.log(`获取表单数据成功: ${JSON.stringify(res)}`);
        })
        .catch((err) => {
          uni.showToast({
            title: "获取表单数据失败",
          });
          console.log(`获取表单数据失败: ${JSON.stringify(err)}`);
        });
    },
    getPickerData() {
      const customData = [
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
      this.setPickerData("pickerCustom", customData);

      const custom2Data = {
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
      this.setPickerData("pickerCustom2", custom2Data);
    },
    setPickerData(name, data) {
      this.$refs[name].setData(data);
    },
  },
};
</script>

<style></style>
