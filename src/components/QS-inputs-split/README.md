
# QQ交流群: 750104037 [点我加入](https://jq.qq.com/?_wv=1027&k=5OyZoXa)

## 可直接拖进示例项目运行

## 作者想说
如果该插件有什么问题还请大家说出来哦，还有如果有什么建议的话也可以提下呐 ~
如果觉得好用，可以回来给个五星好评么\~\~ (❁´◡`❁)*✲ﾟ*  蟹蟹\~拜托啦\~

---
## 组件简介

QS-inputs的拆分版
```
相较于QS-inputs
优点: 可拓展性强、兼容性强(尽量兼容全端)
缺点: 不能根据后台自动生成对应的类型(动态性不如QS-inputs)
展望: 在QS-inputs-split的基础上再进行合并

```

---
# 更新说明

| 版本| 说明|
| --------- | -------- |
| v1.2| 修复picker的一些报错问题, 新增公共属性titleColor(其实可以使用titleStyle), 并将picker类型的titleColor属性名修改为pickerTitleColor |
| v1.1| 新增radio、checkbox、switch、textarea、pics、infinitePics、picker-date、picker-city、picker-custom、picker-custom2等类型  优化代码 优化文档, `非常感谢QQ:885070890 帮助测试！` |
| v1.0| 上传  |

# 注意
* 大部分传值与QS-inputs中的相似<br />
* 建议全局引入后使用, 否则需要一个一个引入elements文件夹下的组件<br />
* 不再兼容非自定义组件模式, 请在自定义组件模式中的vue文件中使用<br />


# 拓展
该插件具备良好的可拓展性, 若想拓展该插件可以使用QS-inputs-split/template/default.vue进行拓展<br />
比如 rate评分组件、 number-box数字计步器等，如果有拓展的比较好的可以加群发给我哦，我会署名加上!

# 大纲
## [两种模式](#mode)
## [公共属性](#publicProps)
## [类型大纲](#types)

# <span id="mode">1.两种模式</span>
## 1.0.1 普通模式
```
普通模式下就像单独使用input组件一样，
v-model双向绑定一个值, 或者监听change事件使用
```

## 1.0.2 form模式
```
form模式下需要传入公共属性name和variableName， 
引入目录中js文件夹下的app.js对象，
使用它的getForm方法，传入name值获取一个对象,
内含data与 verifyErr两个属性,
data为form数据，verifyErr为校验失败的项
```

#`引入elements文件夹下的组件使用`

# <span id="publicProps">2.`公共属性`</span>

| 属性| 是否必填|  值类型| 默认值| 说明|
| --------- | -------- | -----: | --: | --: |
| v-model| | | | 双向绑定数据, picker类型只能接受返回数据|
| @change| | Function| | value值改变回调|
| required| | Boolean| `false`| 是否必填|
| name| form模式必填| String|  | 设置form名称|
| variableName| form模式必填| String|  | 自定义变量名值|
| required| | Boolean| `false` | 是否必填|
| value| | Any| | 单向传入的值|
| titleFlex| | Number| `1`| 左边title的css flex值，控制title一块在整块中所占的比例|
| contentFlex| | Number| `4`| 右边content的css flex值，控制content一块在整块中所占的比例|
| titleStyle| | Style| | 控制title所在view的style属性|
| contentStyle| | Style| | 控制content所在view的style属性|
| boxStyle| | Style| | 控制最外层view的style属性|
| title| | String| | 标题文字|
| titleHide| | Boolean| `false` | 是否隐藏title块|
| fontSize| | Number| `30`| 整体的字体大小，单位rpx|
| width| | String| `100%`| 整体的宽度|
| requiredSign| | String| `*`| 必填标识|
| layout| | String| `row`| 整体的布局方式, 详见[2.0.1](#layout)|
| titleLayout| | String| `default`| title块的布局方式, 详见[2.0.2](#titleLayout)|
| contentLayout| | String| `default`| content块的布局方式, 详见[2.0.3](#contentLayout)|
| `v1.1新增`| | | | |
| customId| | Any| | 自定义标识|
| itemDisabled| | Boolean| | 禁用该项|
| itemLayout| | String| | 有子数组类型的内部布局方式, 传值同contentLayout, 比如radio、checkbox|
| `v1.2新增`| | | | |
| titleColor| | String| `#999`| title的文字颜色|

### <span id="layout">2.0.1 layout -> [2. 公共属性](#publicProps)</span>
| 可选属性| 默认值| 说明|
| -- |  :--: | ----------: |
| row| 是| 横向布局|
| column| | 竖向布局|

### <span id="titleLayout">2.0.2 titleLayout -> [2. 公共属性](#publicProps)</span>
| 可选属性| 默认值| 说明|
| -- |  :--: | ----------: |
| default| 是| 在layout属性为row时为right，在layout属性为column时为left|
| left| | title内容左对齐|
| right| | title内容右对齐|
| center| | title内容居中对齐|

### <span id="contentLayout">2.0.3 contentLayout -> [2. 公共属性](#publicProps)</span>
| 可选属性| 默认值| 说明|
| -- |  :--: | ----------: |
| default| 是| 在layout属性为row时为right，在layout属性为column时为left|
| left| | content内容左对齐|
| right| | content内容右对齐|
| center| | content内容居中对齐|

# <span id="types">3. 类型大纲</span>
### 3.0.1 [QS-input](#QS-input) <br />
### 3.0.2 [QS-radio](#QS-radio) <br />
### 3.0.3 [QS-textarea](#QS-textarea) <br />
### 3.0.4 [QS-checkbox](#QS-checkbox) <br />
### 3.0.5 [QS-switch](#QS-switch) <br />
### [上传图片说明](#upLoadExplain) <br />
### 3.0.6 [QS-pics](#QS-pics) <br />
### 3.0.7 [QS-infinitePics](#QS-infinitePics) <br />
### 3.0.8 [QS-picker-date](#QS-picker-date) <br />
### 3.0.9 [QS-picker-city](#QS-picker-city) <br />
### 3.1.0 [QS-picker-custom](#QS-picker-custom) <br />
### 3.1.1 [QS-picker-custom2](#QS-picker-custom2) <br />

## 3.0.1 <span id="QS-input">QS-input</span>

| 属性| 是否必填|  值类型| 默认值| 说明|
| --------- | :----: | -----: | --: | --: |
| inputSet| | Object|  | input的其他一些设置，一般不常用，需要的请看源码|
| tapClear|  | Boolean | `true`| 一键清除功能|
| inputType|  | String| `text`| input的类型|
| focusBorderColor| | Color| | focus时的边框颜色|
| blurBorderColor| | Color| | 非focus时的边框颜色|
| password| | Boolean| `false`| 密码类型|
| passwordIconColor| | String| | 密码显示时的icon颜色|
| leftIcon| | String| | 左边icon名字|
| leftIconColor| | String| | 左边icon颜色|
| customTapIcon| | String| | 右边自定义图标名字， 不为空则启用自定义图标点击功能|
| customTapIconColor| | String| | 右边自定义图标颜色|
| rightButtonTex| | String| | 右边自定义按钮名字, 不为空则启用自定义按钮点击功能|
| rightButtonStyle| | String| | 右边自定义按钮样式|
| ifCode| | Boolean| | 是否启用验证码功能|
| codeButtonStyle| | String| | 验证码按钮样式|
| phoneNum| | String| | 获取验证码的手机号|
| disabled| | Boolean| | 是否禁用|
| placeholder| | String| | input的placeholder属性|
| filterFc| | Function| | 过滤值函数|
| filterType| | String| | app.js中设置的过滤类型，传属性名|
| verifyFc| | Function| | 检验函数|
| verifyType| | String| | 检验类型|
| inputDebounceSet| | Object| | input防抖设置, 传openInputDebounce<Boolean>(是否开启, 默认开启),delay<Number>(延迟时间, 默认500)两个参数|
| customId| | String\|Object| | 自定义标识|
| `v1.1新增`| | | | |
| focus| | Boolean| false| input聚焦|
| @getCode| | Function| | ifCode为true时，用户点击获取验证码按钮触发此回调，需开发者自行获取验证码|
| checkPhoneNum| | Boolean| | 用户点击获取验证码按钮时是否校验传入input的phoneNum属性为11位以1开头的数字|



## 3.0.2 <span id="QS-radio">QS-radio</span>

| 属性| 是否必填|  值类型| 默认值| 说明|
| --------- | :---: | -----: | --: | --: |
| itemArray| 是| Array\<Object>|  | 需循环的radio数据, 详见[3.0.2.0.1](#3.0.2.0.1)|
| color| | Color|  | radio的颜色|
| scale| | String|  | radio的transform: scale的值，可控制radio大小|
| disabled| | Boolean|  | 是否禁用radio|

### <span id="3.0.2.0.1">3.0.2.0.1 itemArray -> [3.0.2 QS-radio](#QS-radio)</span>

| 属性| 是否必填|  值类型| 默认值| 说明|
| --------- | :---: | -----: | --: | --: |
| name| 是| String|  | 显示的值|
| value| 是| String|  | 携带的值|


## 3.0.3 <span id="QS-textarea">QS-textarea</span>

| 属性| 是否必填|  值类型| 默认值| 说明|
| --------- | :----: | -----: | --: | --: |
| textareaSet| | Object|  | textarea的其他一些设置，一般不常用，需要的请看源码|
| focus| | Boolean| false| textarea聚焦|
| focusBorderColor| | Color| | focus时的边框颜色|
| blurBorderColor| | Color| | 非focus时的边框颜色|
| disabled| | Boolean| | 是否禁用|
| autoHeight| | Boolean| | 是否自动增高|
| placeholder| | String| | textarea的placeholder属性|
| filterFc| | Function| | 过滤值函数|
| filterType| | String| | app.js中设置的过滤类型，传属性名|
| verifyFc| | Function| | 检验函数|
| verifyType| | String| | 检验类型|
| inputDebounceSet| | Object| | input防抖设置, 传openInputDebounce<Boolean>(是否开启, 默认开启),delay<Number>(延迟时间, 默认500)两个参数|
| textareaHeight|  | Number | `12`| textarea高度，计算方式: textareaHeight/100*设备高度 |
| textareaWidth|  | Number| `80`| textarea宽度，单位`%`|
| textareaBackgroundColor| | Color| `#f8f8f8`| textarea背景颜色|

## 3.0.4 <span id="QS-checkbox">QS-checkbox</span>

| 属性| 是否必填|  值类型| 默认值| 说明|
| --------- | :----: | -----: | --: | --: |
| itemArray| | Array\<Object\> |  | 需循环的checkbox数据, 详见[3.0.4.0.1](#3.0.4.0.1)|
| color| | Color|  | 该checkbox所有的选中颜色|
| scale| | String|  | checkbox的transform: scale的值，可控制checkbox大小|
| disabled| | Boolean|  | 禁用该项checkbox|

### <span id="3.0.4.0.1">3.0.4.0.1 itemArray -> [3.0.4 QS-checkbox](#QS-checkbox)</span>

| 属性| 是否必填|  值类型| 默认值| 说明|
| --------- | :---: | -----: | --: | --: |
| name| 是| String|  | 显示的值|
| value| 是| String|  | 携带的值|
| color| | Color|  | 改checkbox的选中颜色, 优先级大于父级|

## 3.0.5 <span id="QS-switch">QS-switch</span>

| 属性| 是否必填|  值类型| 默认值| 说明|
| --------- | :----: | -----: | --: | --: |
| color| | Color|  | switch的选中颜色|
| scale| | String|  | switch的transform: scale的值，可控制switch大小|
| disabled| | Boolean|  | 禁用switch|

## <span id="upLoadExplain"> `上传图片类型说明 (使用ref调用)`</span>
```
若使用上传图片组件需要在config文件中配置pics.js中的上传文件方法
在页面中可以使用下面的方法获取上传图片的promise数组
```
## 上传图片类型公共方法
| 返回值 方法名称| 传参| 说明|
| --------- |  -----: | --: |
| void setData| Array| 更新上传的图片数组|
| void setUpLoadData| Any| 设置上传图片的自定义携带数据, 可在config文件中的上传文件方法中获取|
| Array\<Promise Object\> getUpLoadPromiseArray| | 返回一个上传图片的promise对象数组|

## 3.0.6 <span id="QS-pics">QS-pics</span>

| 属性| 是否必填|  值类型| 默认值| 说明|
| --------- | :----: | -----: | --: | --: |
| value(公共属性)| | Array|  | 需上传的图片数组, 详见[3.0.6.0.1](#pics_itemArray)|
| clearColor| | Color|  `#f5105c`| 清除图标的颜色|

### 3.0.6.0.1 <span id="pics_itemArray">value -> [3.0.6 QS-pics](#QS-pics)</span>
| 属性| 是否必填|  值类型| 默认值| 说明|
| --------- | :---: | -----: | --: | --: |
| title| 是| String|  | 选择图片的标题说明|
| path| | String|  | 预设值|
| clearColor| | Color| `#f5105c` | 清除图片图标的颜色|
| customTapId| | String|  | 若填写此属性则会触发回调事件-picsTap, 而不会选择图片|

## 3.0.7 <span id="QS-infinitePics">QS-infinitePics</span>

| 属性| 是否必填|  值类型| 默认值| 说明|
| --------- | :----: | -----: | --: | --: |
| value(公共属性)| | Array|  | 需上传的图片数组, 详见[3.0.6.0.1](#pics_itemArray)|
| sortSelection| | Boolean|  | 是否开启排序选择模式, 详见[3.0.6.0.2](#sortSelection)|
| defaultSelectAll| | Boolean|  true| 排序选择模式下，如果用户未做任何排序是否返回原始数组|
| selectedColor| | Color|  `#0099FF`| 排序选择框选中时的背景颜色|
| unSelectedColor| | Color|  `rgba(0,0,0,.7)`| 排序选择框未选中时的背景颜色|
| selectBorderColor| | Color|  `1px solid rgba(255,255,255,.7)`| 排序选择框选中时的边框颜色|
| selectBorderColor| | Color|  `1px solid rgba(255,255,255,.7)`| 排序选择框的边框颜色|
| selectColor| | Color|  `#fff`| 排序选择框的文字颜色|
| max| | Number|  | 最多选择图片数量|
| clearColor| | Color|  `#f5105c`| 清除图标的颜色|

### 3.0.7.0.1 <span id="pics_itemArray">value -> [3.0.7 QS-infinitePics](#QS-infinitePics)</span>
| 属性| 是否必填|  值类型| 默认值| 说明|
| --------- | :---: | -----: | --: | --: |
| title| 是| String|  | 选择图片的标题说明|
| path| | String|  | 预设值|
| clearColor| | Color| `#f5105c` | 清除图片图标的颜色|

### 3.0.7.0.2 <span id="sortSelection">sortSelection -> [3.0.7 QS-infinitePics](#QS-infinitePics)</span>
```
排序选择模式开启后， 会在 已选择图片的右下角有一个选择框，用户点击时会对图片数组排序, 在上传时会按排序数组返回
```
## <span id="QS-picker">picker类型说明</span>
`注: 因为兼容性问题，一怒之下写死了picker的行高和文字大小, 文字大小可在config/css/picker中配置, 行高则要到代码中改了`

### <span id="publicProps">picker类型方法列表</span>
|  返回值 方法名称|  参数|说明|
| --------- | -----: |  --: |
| `ref调用` | |  |
| void show| | 显示picker|
| void hide| | 隐藏picker|
| void setData| 设置的数据| 设置内部选择列表数据，仅支持picker-custom与picker-custom2|
| `绑定事件`| | |
| Object @pickerChange| | picker的value改变时触发此事件|


### <span id="publicProps">picker类型属性</span>
| 属性| 是否必填|  值类型| 默认值| 说明|
| --------- | :----: | -----: | --: | --: |
| pickerTitle| | String|  | picker的title|
| ~~titleColor~~pickerTitleColor| | Color|  `#999`| picker的title文字颜色|
| placherhold| | String|  | picker未选择时的默认占位文字|
| height| | Number|  | picker-view的高度|
| fontScale| | Number|  .034| QS-picker组件内的文字大小， 不包含picker-view-column中的文字, 计算方式: 屏幕宽度乘以fontScale|
| mode| | String|  bottom| picker的展示模式, 详见[mode属性说明](#picker_mode)|
| dataSet| | Object| | 各类型的设置, 详见[mode属性说明](#picker_dataSet)|
| buttonSet| | Object|  | 按钮设置, 详见[buttonSet属性说明](#picker_buttonSet)|
| showReset| | Boolean|  false| 每次显示是否重置为初始值|
| zIndex| | Number|  | z-index属性， 应该没用, 应该要由父级控制|
| bgColor_title| | Color|  `#F8F8F8`| title的背景颜色|
| autoHide| | Boolean|  true| 在用户选择后是否自动隐藏|
| `picker-custom与pciker-custom2额外支持以下属性`| | |  | |
| linkage| | Boolean|  | 是否联动|
| linkageNum| | Number|  2| 联动级数|
| steps| | Object|  | 属性预设|
| async| | Boolean| | 开启逐级获取功能, 需在config/picker中配置相关函数, 其实使用ref设置数据并用pickerChange监听只改变的话就不用这个属性了|
| customId(公共属性)| | Any|  | 自定义标识|

### <span id="picker_mode">picker类型的mode属性说明</span>
| 值| 说明|
| --------- | -------- |
| middel| 从中间渐出 |
| top| 从顶部弹出 |
| bottom| 从底部弹出(默认) |

### <span id="picker_dataSet">picker类型的dataSet属性说明</span>
| 属性名| 是否必填| 值类型|  默认值| 说明|
| --------- | -------- | -----: | --: | --: |
| `date类型`| | | |  |
| startYear| | Number| `new Date().getFullYear() - 5` |   开始年数 |
| endYear| | Number| `new Date().getFullYear() + 5` |   结束年数 |
| defaultValue| | String| 此刻| 格式为`2019/05/27 10:54:00`、`2019/05/27`的初始日期 |
| dateMode| | Number |  `3`|   取值为1-6的值，依次从左向右为年、月、日、时、分、秒的列数 |
| dateFormatArray| | Array|  `['-', '-', ' ', ':', ':']`| 确认选择后返回的格式，依次是年、月、日、时、分、秒之间的分隔符 |
| `其他类型`| | | |  |
| defaultValue| | Array| | 对应列数的默认值 |

### <span id="picker_buttonSet">picker类型的buttonSet属性说明</span>
| 值| 值类型| 默认值| 说明|
| --------- | -------- | -------- | -------- |
| cancelType| String| `default`| 取消按钮的类型 |
| confirmType| String| `primary`| 确定按钮的类型 |
| cancelStyle| cssStyle| | 取消按钮的样式, `只支持middle模式`|
| confirmStyle| cssStyle| | 确定按钮的样式, `只支持middle模式`|
| cancelName| String| `取消`| 取消按钮名称|
| confirmName| String| `确定`| 确定按钮名称|
| cancleColor | Color| `#ADADAD`| 取消按钮的颜色，`不支持middle模式` |
| confirmColor| Color| `#3399FF`| 确定按钮的颜色，`不支持middle模式` |

## 3.0.8 <span id="QS-picker-date">QS-picker-date</span>
详见 [picker类型说明](#QS-picker)

## 3.0.9 <span id="QS-picker-city">QS-picker-city</span>
详见 [picker类型说明](#QS-picker)

## 3.1.0 <span id="QS-picker-custom">QS-picker-custom</span>
详见 [picker类型说明](#QS-picker)

## 3.1.1 <span id="QS-picker-custom2">QS-picker-custom2</span>
详见 [picker类型说明](#QS-picker)