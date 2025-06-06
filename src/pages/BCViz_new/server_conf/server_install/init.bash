#!/bin/bash
read -p "input BCviz repo download zip url: " url
if [ -z "$url" ]; then
    echo "error! URL is not valid!"
    exit 1
fi

# 安装需要的软件
# 更新软件包列表
# --fix-missing: 尝试修复缺失的依赖关系
# --no-install-recommends: 不安装推荐的软件包
# --no-install-suggests: 不安装建议的软件包
# --quiet: 静默模式，不输出详细信息
sudo apt update --fix-missing --no-install-recommends --no-install-suggests --quiet
sudo apt install --assume-yes --fix-broken --fix-missing --no-install-recommends nginx
sudo apt install --assume-yes --fix-broken --fix-missing --no-install-recommends fcgiwrap
sudo apt install --assume-yes --fix-broken --fix-missing --no-install-recommends libfcgi-dev
sudo apt install --assume-yes --fix-broken --fix-missing --no-install-recommends nodejs
sudo apt install --assume-yes --fix-broken --fix-missing --no-install-recommends npm
sudo apt install --assume-yes --fix-broken --fix-missing --no-install-recommends unzip
sudo apt install --assume-yes --fix-broken --fix-missing --no-install-recommends cmake
# 安装git-lfs
sudo curl -s "https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh" | sudo bash
sudo apt-get --assume-yes --fix-broken --fix-missing --no-install-recommends install git-lfs
# 设置nginx/sites-available权限
sudo chown -R --dereference -L --recursive root:root /etc/nginx/sites-available/
sudo chgrp --recursive root /etc/nginx/sites-available/
sudo chmod --recursive 777 /etc/nginx/sites-available/
# 启动fcgiwrap
sudo service fcgiwrap start
# 设置fcgiwrap权限
sudo chgrp --recursive www-data /var/run/fcgiwrap.socket
sudo chmod --recursive 777 /var/run/fcgiwrap.socket

# --第一部分结束--

# 进入目录
cd /etc/nginx/sites-available/
# 安装nodejs依赖
sudo npm install @types/node
# git clone 仓库，当前目录为/etc/nginx/sites-available/
sudo git clone "https://gitcode.com/huangjunxue/bcviz_demo.git"
# 设置权限
sudo chmod --recursive 777 ./bcviz_demo/

# --test_start--
# 把default复制到目录，当前目录为/etc/nginx/sites-available/
sudo cp ./bcviz_demo/nginx_conf/default ./default
# --test_end--

# 设置权限
sudo chmod --recursive 777 ./default
# 新建目录并进入
sudo mkdir -p v1 && cd $_

# --test_start--
# 把js复制到目录，当前目录为v1
sudo cp ../bcviz_demo/nginx_conf/script.mjs ./script.mjs
# 设置权限
sudo chmod --recursive 777 ./script.mjs
# --test_end--

# 下载并解压仓库
sudo wget "$url"
sudo unzip zip
# 创建软链接，当前目录为v1。因为进入bcviz_demo目录，以bcviz_demo的视角来看，v1是bcviz_demo的上级目录，所以用../v1/datasets
sudo ln -s ../v1/datasets ../bcviz_demo/datasets
# 设置权限
sudo chmod --recursive 777 ./datasets/
sudo chmod --recursive 777 ../bcviz_demo/datasets/
sudo mkdir -p "Index-results"
sudo chmod --recursive 777 ./Index-results/
# 进入目录编译并设置权限
cd ./search-BCviz/
sudo cmake .
sudo make
sudo chmod --recursive 777 ./MBS
# 进入目录编译并设置权限
cd ../construct-BCviz/
sudo cmake .
sudo make
sudo chmod --recursive 777 ./BCviz
# 返回上级目录，当前目录为v1
cd ..
sudo chmod --recursive 777 ./
# 返回上级目录，当前目录为/etc/nginx/sites-available/
cd ..
# 创建软链接，补充datasets中不存在的文件，当前目录为/etc/nginx/sites-available/
sudo node ./bcviz_demo/nginx_conf/mklink_datasets.mjs

# 重启Nginx
sudo systemctl restart nginx
sudo systemctl reload nginx
sudo nginx -t
sudo nginx -s reload


# 测试
# curl http://127.0.0.1