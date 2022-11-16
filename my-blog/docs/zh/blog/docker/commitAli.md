## [配置阿里镜像](https://cr.console.aliyun.com/repository/cn-hangzhou/cxy_images/images/details)

  * [登录阿里容器镜像服务](https://cr.console.aliyun.com/cn-hangzhou/instances)
  * 点击个人实例 > 创建个人版 > 设置Registry登录密码 > cxy123456
  * 创建镜像仓库 > 创建命名空间(cxy_images)>  仓库名称(images) > 仓库描述(个人镜像仓库)) > 下一步 > 本地仓库 > 创建镜像仓库

:::tip
不能在生产使用

:::

## commit镜像(已ubunto为例子添加vim指令)
```bash
# 拉取镜像
docker search ubuntu --limit 3
docker pull ubuntu
docker images

# 生成容器 这里就不指定数据卷了
docker run -it --name ubuntuVim -p 5000:80  ubuntu /bin/bash
-it 生成交互界面
--name 别名
-p 宿主机ip: 容器ip
/bin/bash

# 新建文件
touch a.txt

# 查看是否有vim命令
vi a.txt #  vim: command not found
# 退出
# exit

# 重启容器
docker restart 容器id

# 进入容器
docker exec -it 容器id /bin/bash

# 安装vim
apt-get update
apt-get install -y vim


# vim


```