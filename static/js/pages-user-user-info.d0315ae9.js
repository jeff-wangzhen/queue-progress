(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-user-user-info"],{"064f":function(t,e,i){"use strict";var n=i("4b20"),a=i.n(n);a.a},"0be6":function(t,e,i){"use strict";var n,a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",{staticClass:"tui-cell-class tui-list-cell",class:{"tui-cell-arrow":t.arrow,"tui-cell-last":t.last,"tui-line-left":t.lineLeft,"tui-line-right":t.lineRight,"tui-radius":t.radius},style:{fontSize:t.size+"rpx",padding:t.padding},attrs:{"hover-class":t.hover?"tui-cell-hover":"","hover-stay-time":150},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),arguments[0]=e=t.$handleEvent(e),t.handleTap.apply(void 0,arguments)}}},[t._t("default")],2)},r=[];i.d(e,"b",function(){return a}),i.d(e,"c",function(){return r}),i.d(e,"a",function(){return n})},"39d0":function(t,e,i){"use strict";var n,a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",{class:[t.isDark?"dark":"light"]},[i("cu-custom",{attrs:{bgColor:t.isDark?"bg-black":"bg-gradual-green",isBack:!0}},[i("template",{attrs:{slot:"backText"},slot:"backText"},[t._v("返回")]),i("template",{attrs:{slot:"content"},slot:"content"},[t._v("个人信息")])],2),i("v-uni-view",{staticClass:"tui-userinfo-box container"},[i("tui-list-cell",{attrs:{padding:"0",arrow:!0}},[i("v-uni-view",{staticClass:"tui-list-cell"},[i("v-uni-view",[t._v("头像")]),i("v-uni-image",{staticClass:"tui-avatar",attrs:{src:t.user.avatar}})],1)],1),i("tui-list-cell",{attrs:{padding:"0",hover:!1}},[i("v-uni-view",{staticClass:"tui-list-cell tui-pr30"},[i("v-uni-view",[t._v("用户id")]),i("v-uni-view",{staticClass:"tui-content",domProps:{textContent:t._s(t.user.userId)}},[t._v("ThorUI")])],1)],1),i("tui-list-cell",{attrs:{padding:"0",arrow:!0}},[i("v-uni-view",{staticClass:"tui-list-cell"},[i("v-uni-view",[t._v("昵称")]),i("v-uni-view",{staticClass:"tui-content",domProps:{textContent:t._s(t.user.name)}},[t._v("echo.")])],1)],1)],1)],1)},r=[];i.d(e,"b",function(){return a}),i.d(e,"c",function(){return r}),i.d(e,"a",function(){return n})},4087:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,i("c5f6");var n={name:"TuiListCell",props:{arrow:{type:Boolean,default:!1},hover:{type:Boolean,default:!0},lineLeft:{type:Boolean,default:!0},lineRight:{type:Boolean,default:!1},padding:{type:String,default:"26rpx 30rpx"},last:{type:Boolean,default:!1},radius:{type:Boolean,default:!1},bgcolor:{type:String,default:"#fff"},size:{type:Number,default:32},color:{type:String,default:"#333"},index:{type:Number,default:0}},methods:{handleClick:function(t){this.$emit("tap",t),this.$emit("click",t)},handleTap:function(t){this.$emit("tap",t),this.$emit("click",t)}}};e.default=n},"4b20":function(t,e,i){var n=i("7bbb");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var a=i("4f06").default;a("0a8cebfd",n,!0,{sourceMap:!1,shadowMode:!1})},"4d3d":function(t,e,i){e=t.exports=i("2350")(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */.tui-list-cell[data-v-033e0fbe]{position:relative;width:100%;box-sizing:border-box;overflow:hidden;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;background-color:#fff}.tui-radius[data-v-033e0fbe]{border-radius:%?12?%;overflow:hidden}.tui-cell-hover[data-v-033e0fbe]{background:#e6e6e6}.tui-list-cell[data-v-033e0fbe]::after{content:"";position:absolute;border-bottom:%?1?% solid #b2b2b2;-webkit-transform:scaleY(.5);transform:scaleY(.5);bottom:0;right:0;left:0}.tui-line-left[data-v-033e0fbe]::after{left:%?30?%!important}.tui-line-right[data-v-033e0fbe]::after{right:%?30?%!important}.tui-cell-last[data-v-033e0fbe]::after{border-bottom:0!important}.tui-list-cell.tui-cell-arrow[data-v-033e0fbe]:before{content:" ";height:11px;width:11px;border-width:2px 2px 0 0;border-color:#b2b2b2;border-style:solid;-webkit-transform:matrix(.5,.5,-.5,.5,0,0);transform:matrix(.5,.5,-.5,.5,0,0);position:absolute;top:50%;margin-top:-7px;right:%?30?%}.dark .tui-cell-hover[data-v-033e0fbe]{background-color:#2d2d2d!important}.dark .tui-list-cell[data-v-033e0fbe]{background-color:#262626}.dark .tui-list-cell.tui-cell-arrow[data-v-033e0fbe]:before{border-color:#555}.dark .tui-list-cell[data-v-033e0fbe]::after{border-bottom:%?1?% solid #555}',""])},6727:function(t,e,i){"use strict";i.r(e);var n=i("0be6"),a=i("f0d7");for(var r in a)"default"!==r&&function(t){i.d(e,t,function(){return a[t]})}(r);i("970c");var o,l=i("f0c5"),s=Object(l["a"])(a["default"],n["b"],n["c"],!1,null,"033e0fbe",null,!1,n["a"],o);e["default"]=s.exports},"6f1a":function(t,e,i){"use strict";var n=i("288e");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=n(i("6727")),r={components:{tuiListCell:a.default},data:function(){return{user:this.$store.state.user}},computed:{isDark:function(){return this.$store.state.others.isDark}}};e.default=r},"7bbb":function(t,e,i){e=t.exports=i("2350")(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */.tui-userinfo-box[data-v-64b3d308]{padding-bottom:%?20?%;color:#333}.tui-list-cell[data-v-64b3d308]{width:100%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;padding:%?24?% %?60?% %?24?% %?30?%;font-size:%?30?%}.tui-pr30[data-v-64b3d308]{padding-right:%?30?%}.tui-avatar[data-v-64b3d308]{width:%?100?%;height:%?100?%;display:block;border-radius:50%}.tui-content[data-v-64b3d308]{font-size:%?26?%;color:#666}.dark .tui-list-cell[data-v-64b3d308]{color:#d5d5d5;background-color:#262626}',""])},"7dc5":function(t,e,i){"use strict";i.r(e);var n=i("39d0"),a=i("eace");for(var r in a)"default"!==r&&function(t){i.d(e,t,function(){return a[t]})}(r);i("064f");var o,l=i("f0c5"),s=Object(l["a"])(a["default"],n["b"],n["c"],!1,null,"64b3d308",null,!1,n["a"],o);e["default"]=s.exports},"8c01":function(t,e,i){var n=i("4d3d");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var a=i("4f06").default;a("401aa84e",n,!0,{sourceMap:!1,shadowMode:!1})},"970c":function(t,e,i){"use strict";var n=i("8c01"),a=i.n(n);a.a},eace:function(t,e,i){"use strict";i.r(e);var n=i("6f1a"),a=i.n(n);for(var r in n)"default"!==r&&function(t){i.d(e,t,function(){return n[t]})}(r);e["default"]=a.a},f0d7:function(t,e,i){"use strict";i.r(e);var n=i("4087"),a=i.n(n);for(var r in n)"default"!==r&&function(t){i.d(e,t,function(){return n[t]})}(r);e["default"]=a.a}}]);