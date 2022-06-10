## DataPicker 级联选择
> 关联组件：`uni-data-pickerview`、`uni-load-more`、`uni-list-item`、`uni-easyinput`、`uni-icons`、`uni-badge`。



`<song-data-picker>` 是一个选择类[datacom组件](https://uniapp.dcloud.net.cn/component/datacom)，是在官方的`uni-data-picker(0.1.8)`的基础上进行的修改，添加了搜索功能。

示例详见[github](https://github.com/mofeimo110/uni-app-songcomponents).

此组件在使用中遇到任何问题，可在[github](https://github.com/mofeimo110/uni-app-songcomponents)下载源码和简易demo自行调试，也可以根据下列格式发送邮件到codersong@qq.com：

```
错误信息：
使用场景：
复现顺序：

** 复现数据或者有现成的复现代码，请打包后添加附件发送
```


此处只列举新增的属性，原有的属性与事件可以在官方[uni-data-picker](https://ext.dcloud.net.cn/plugin?id=3796)中查看

支持单列、和多列级联选择。列数没有限制，如果屏幕显示不全，顶部tab区域会左右滚动。

`<song-data-picker>` 组件尤其适用于地址选择、分类选择等选择类。



使用搜索功能时会进行所有层级的递归搜索。



### 平台差异说明

暂不支持在nvue页面中使用

### 安装方式

本组件符合[easycom](https://uniapp.dcloud.io/collocation/pages?id=easycom)规范，`HBuilderX 2.5.5`起，只需将本组件导入项目，在页面`template`中即可直接使用，无需在页面中`import`和注册`componets`。

## API

### DataPicker Props
> 目前所有的props都是在官方的uni-data-picker(0.1.8)的基础上进行的添加，下边只标注新增的属性

|属性名			| 类型			|可选值				| 默认值| 说明																																																							|
|:-:			| :-:			|:-:				| :-:	| :-:																																																							|
|openSearch		|Boolean		| true/false		|false	|是否显示搜索框																																																					|
|searchFn		|Function		| function			|		|自定义的搜索函数，需要返回一个数组																																																|
|openInputSearch|Boolean,Number	| true/false/number	|false	|是否开启输入框的input搜索事件，true表示每次输入都会搜索，数字表示输入的文字长度达到几开始搜索，数字0与false效果一致。<br />需要注意的是如果候选数据巨大，尽量不要开启此功能，如果一定要开启，建议重写searchFn函数，并对函数防抖|

#### searchFn 示例
```js
<template>
  <view>
    <song-data-picker :localdata="items" popup-title="请选择班级" :openSearch="true" :searchFn="mySearchFn" @change="onchange" @nodeclick="onnodeclick"></song-data-picker>
  </view>
</template>
{
	methods:{
		mySearchFn(searchList, searchWord) {
			return searchList.filter(x => x.searctText.includes(searchWord));
		}
	}
}
```

### DataPicker Events
> 目前所有的Events都是在官方的uni-data-picker(0.1.8)的基础上进行的添加，下边只标注新增的事件
> 
无新增



### 基本用法

#### 本地数据

```html
<template>
  <view>
    <song-data-picker :localdata="items" popup-title="请选择班级" :openSearch="true" @change="onchange" @nodeclick="onnodeclick"></song-data-picker>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        items: [{
          text: "一年级",
          value: "1-0",
          children: [
            {
              text: "1.1班",
              value: "1-1"
            },
            {
              text: "1.2班",
              value: "1-2"
            }
          ]
        },
        {
          text: "二年级",
          value: "2-0"
        },
        {
          text: "三年级",
          value: "3-0"
        }]
      }
    },
    methods: {
      onchange(e) {
        const value = e.detail.value
      },
      onnodeclick(node) {
      }
    }
  }
</script>

```
