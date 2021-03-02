

### datetime-picker 日期时间选择器

用于日期和时间同时选择的场景

### 安装方式

本组件符合[easycom](https://uniapp.dcloud.io/collocation/pages?id=easycom)规范，`HBuilderX 2.5.5`起，只需将本组件导入项目，在页面`template`中即可直接使用，无需在页面中`import`和注册`components`。

### 使用方式

在 ``template`` 中使用组件

```html
<song-datetime-picker name="picker"></song-datetime-picker>
```

## API

### DatetimePicker Props

|   属性名    |     类型      |   可选值   |      默认值      |                说明                |
| :---------: | :-----------: | :--------: | :--------------: | :--------------------------------: |
|    value    | String,Number |     -      |        -         |          datetime的默认值          |
|  timestamp  |    Boolean    | true/false |      false       |         是否使用时间戳模式         |
| placeholder |    String     |     -      | '请选择日期时间' |         组件默认的显示信息         |
| popupTitle  |    String     |     -      |  请选择日期时间  |      组件拉起时上方的显示信息      |
|    name     |    String     |     -      |                  | 组件的名称，change方法的第二个参数 |
| minDateTime |    String     |     -      |                  |              最小时间              |
| maxDateTime |    String     |     -      |        -         |              最大时间              |



### 事件说明

| 事件名 |           说明           |     返回值      |
| :----: | :----------------------: | :-------------: |
| change | 选择器点击确认按钮时触发 | (datetime,name) |