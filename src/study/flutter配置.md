---
title: flutter 配置
tags:
   - flutter
---


## mac 如何配置flutter 环境


### 配置flutter sdk


- 下载 [flutter sdk](https://docs.flutter.dev/install/archive#stable-channel)
- 配置环境变量
   - 解压下载文件到指定文件夹 例如 /Users/zouyu/Documents/flutter_sdk/flutter
   - 配置环境变量 可以控制台 也可以手动 （command + shift +.）打开隐藏文件夹
   - 在 ~/.zshrc 添加环境变量 
     export PATH=/Users/zouyu/Documents/flutter_sdk/flutter/bin:$PATH

     这样就可以全局使用flutter 命令了

    ```js

    flutter --version

    ```
- 设置国内镜像
  
export PUB_HOSTED_URL=https://pub.flutter-io.cn
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn

- 检测flutter 相关工具是否都安装了
```js
cd /Users/zouyu/Documents/flutter_sdk/flutter

flutter doctor


```

- appstore 安装 xcode
```js

// 签署 Xcode 许可协议
sudo xcodebuild -license

// 安装 Xcode 额外组件

sudo xcodebuild -runFirstLaunch

// 安装 CocoaPods
brew install cocoapods
pod --version




```

打开 Xcode

前往 Xcode > Settings > Platforms

- Go to Platforms tab above and verify if you have iOS installed. If it is not installed, then click the Get button next to it and it will be downloaded.

![alt text](./img/image.png)

- In order to verify, open Simulator as shown in the screenshot below.








### 验证

```js
flutter doctor -v --verbose

```
### 如何启动项目
```js
// 查看当前设备
flutter devices

// 打开模拟器 

open -a Simulator


flutter 创建项目

flutter create demo1
//  cd 项目目录
 // 修改整个项目目录权限（推荐）
sudo chown -R $(whoami) .
flutter pub get
flutter run
```






flutter devices


## ✅ Flutter 使用 DevTools 手动连接运行中 App 的完整流程

---

### 🟢 第一步：运行你的 Flutter App

在终端中运行：

```bash
flutter run
```

此时终端会输出一段链接，比如：

```
An Observatory debugger and profiler on iPhone 13 is available at:
http://127.0.0.1:51830/u37pq71Re0k=/
```

📌 **复制这段 URL**，它是你的 App 的调试入口（Observatory 地址）。

---

### 🟣 第二步：启动 DevTools

使用命令打开 DevTools：

```bash
dart devtools
```

输出类似：

```
Serving DevTools at http://127.0.0.1:9100
```

在浏览器中打开这个链接，会看到 DevTools 页面。

---

### 🔵 第三步：连接 App 到 DevTools

1. 打开 DevTools 页面后，点击顶部的 `Connect to a running app`；
2. 在弹出的输入框中，**粘贴刚才在第一步中复制的 URL**（例如 `http://127.0.0.1:51830/u37pq71Re0k=/`）；
3. 点击「Connect」。

✅ 连接成功后，DevTools 就会激活，显示你当前 App 的状态、组件树、布局等调试信息。




