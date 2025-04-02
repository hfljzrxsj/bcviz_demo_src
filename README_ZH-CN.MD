# 1. 安装Node.js
<https://nodejs.org/dist/v22.14.0/node-v22.14.0-x64.msi>。

如果下面步骤失败了，就卸载，然后换这个版本的nodeJs：<https://nodejs.org/dist/v18.19.1/node-v18.19.1-x64.msi>。
注意请允许它设置到环境变量中。

# 2. 在cmd或powershell（Windows自带的命令行工具）查看版本

```bash
node -v
npm -v
```

如果没有，请到环境变量中配置

# 3. 进入仓库，安装依赖

```bash
npm i --legacy-peer-deps
```

如果执行失败，可以试试以下这2个

1. cnpm

   ```bash
   npm install cnpm -g
   cnpm i --legacy-peer-deps
   ```

2. yarn

   ```bash
   npm install yarn -g
   yarn i --legacy-peer-deps
   ```



# 4. 启动

1. 打开开发环境

    ```bash
    npm run vite
    ```

2. 打包

    ```bash
    npm run vite:build
    ```
    打包后目录在dist文件夹

2. 启动生产环境

    ```bash
    npm run vite:preview
    ```

    生产环境就是dist文件夹下的内容