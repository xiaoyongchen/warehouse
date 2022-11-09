## **Docker**

### 账号密码
  * 1538627809@qq.com | dockerwork123456 & Docker123456
  
### docker架构
  ![image](https://dockerdocs.cn/images/architecture.svg)
  ![image](https://pic1.zhimg.com/80/v2-eb33808cf89740d549689e412bcac3c4_720w.webp)
  :::tip
  docker daemon 守护进程，可以看作容器载体。用于客户端对话。

  docker build 打包镜像

  docker pull 从docker注册表中拉取镜像

  docker push 把镜像推送到已配置的注册表

  docker run 从已有的镜像或者从拉取中的镜像生成容器

  :::

### docker3个重要概念
  #### image镜像

  就是一个只读模版，可以包含一个完整的centos（Linux操作系统），仅安装了apache或者用户其他应用。可以用来创建容器
  #### container容器

  从镜像创建的运行实例。每个容器相互隔离，可以吧容器看做是要给简易版的linux环境（包括root用户权限、镜像空间、用户空间和网络空间等）和运行再其中的应用程序）
  #### 仓库

  是储存镜像文件的地方，每个镜像有不同的标签tag。registry是主从服务器