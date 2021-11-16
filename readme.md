# 使用说明

* TOKEN的获取: F12 -> 应用(Application) -> Cookie(https://pub.alimama.com) -> _tb_token_

## 注入方法一：直接注入

1. 直接复制tblm_pid_generate.js的内容，粘贴到淘宝联盟控制台，按下回车


## 注入方法二：引用注入

1. 安装依赖

> npm i

2. 运行服务

> node app.js

3. 控制台输入

```javascript
// 引入js
tblm_pid_helper_element = document.createElement("script");
tblm_pid_helper_element.setAttribute("type", "text/javascript");
tblm_pid_helper_element.setAttribute("src", "http://127.0.0.1:7899/tblm_pid_generate.min.js");
document.body.appendChild(tblm_pid_helper_element);
```

## 运行代码

```javascript
console.log('5秒后开始创建...')
setTimeout(() => {
  // 按自己的情况这些配置 否则无法正常执行
  pid_generate(__名称前缀__, __TOKEN__, ___媒体ID___, 200) // 200为数量
}, 5 * 1000)
```

示例:

```javascript
console.log('5秒后开始创建...')
setTimeout(() => {
  // 按自己的情况这些配置
  pid_generate('test_', 'xxxxxx', 123456789, 1)
}, 5 * 1000)
```