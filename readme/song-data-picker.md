## DataPicker 级联选择
> 关联组件：`uni-data-pickerview`、`uni-load-more`、`uni-list-item`、`uni-easyinput`、`uni-icons`、`uni-badge`。



`<song-data-picker>` 是一个选择类[datacom组件](https://uniapp.dcloud.net.cn/component/datacom)，是在官方的`uni-data-picker(0.1.8)`的基础上进行的修改，添加了搜索功能。

示例详见[github](https://github.com/mofeimo110/uni-app-songcomponents).

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

|属性名								| 类型						|	可选值 		 | 		默认值			| 说明|
|:-:									| :-:						|:-:				 | :-:					| :-:	|
|openSearch						|Boolean				| true/false |	false				|是否显示搜索框|

### DataPicker Events

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
