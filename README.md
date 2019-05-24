# Ceditor

Ceditor 是本编译器的 GUI 部分。

## 下载已经编译完成并打包的版本

点击[这里](https://coding.net/...)下载

## 构建运行此 GUI 程序

> 首先确保你已经安装新版的[nodejs](https://nodejs.org),安装完之后 npm 应该已经存在于你的环境变量之中。通常情况下在中国正常使用 npm 速度不是很快，在安装 electron 依赖的过程中还会下载失败，所以推荐你使用 cnpm,你可以执行一下命令全局安装 cnpm 之后所有的 npm 命令替换成 cnpm 命令即可

```bash
npm install -g cnpm
```

### 安装依赖

在源文件目录中执行

```bash
npm install
```

此后你已经有了 GUI 部分所需的依赖但是如果想要有编译功能，还需要将包含 gcc 的 MinGW 添加到项目的根目录(gcc 是起到汇编器的作用，将我们生成的 gcc 可识别的 32 位汇编转换成可执行的文件)，并将我们的编译器放置到 MinGW/bin 目录下，调整 main-process/application-menu.js 中的 cache 和 PATH_ENV 分别指向 cache 和 MinGW/bin 目录即可（如果要打包，需要重新在生成的文件目录中执行以上步骤）

### 直接运行

```bash
npm start
```

之后 GUI 程序就已经运行

### 生成 windows 32 位可执行文件

```bash
npm run build
```
