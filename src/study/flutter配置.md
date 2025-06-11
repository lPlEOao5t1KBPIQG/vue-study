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
