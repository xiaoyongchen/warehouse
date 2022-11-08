## Docker发布一个vue项目

### Docker运行一个简单的echo命令
  * docker search nginx
  * docker pull nginx
  * docker images 
  * docker save nginx >/tmp/nginx.tar.gz
  * docker load </tmp/nginx.tar.gz
  ```bash
    # 搜索docker search [REPOSITORY[:TAG]]
      docker search nginx
    # 拉取docker pull [REPOSITORY[:TAG]]
      docker pull nginx
    # 查看镜像docker image ls
      docker images 
    # 保存镜像
      docker save nginx >/tmp/nginx.tar.gz
    # 加载镜像
      docker load </tmp/nginx.tar.gz
    # 删除镜像docker image rm [REPOSITORY[:TAG]] docker rmi [OPTIONS] IMAGE [IMAGE...] -f    -f: 强制删除
    # rm 删除一个或者多个容器 rmi 表示删除一个或者多个镜像
      docker rmi -f nginx
    # 查看|停止｜重新开始 容器
      docker ps ｜ stop ｜ restart
      ![image]('../../../../../.vuepress/public/images/dockerStartStop.png')
    # 运行一个简单的hello world。这里回pull并运行centos 
      docker run centos echo "hello world"  # hello world
  ```

### 打包运行vue项目

  ```javascript
  # 创建vue项目
  cd Desktop
  vue create vue-demo
  yarn build

  # 拉取nginx镜像
  docker pull nginx

  # 生成容器，这里用ip访问nginx的时候，就已经替换成宿主的dist下面的index.html
  docker run -d -p 80:80 --name nginx_wms_ui -v /Users/chenxiaoyong/Desktop/资料/nginx/dist:/usr/share/nginx/html --restart=always nginx

  -d=true|false
    后台运行使用 daemon 模式, 默认值false
  -p:设置port: 默认端口
  --name: 别名
  -v数据卷 --volumn: 宿主目录:容器目录
  --restart: always nginx 一直重启

  # 重启服务
  docker ps 

  # 进入容器目录
  docker exec -it 容器id /bin/bash

  # 进入
  cd /etc/nginx/conf.d
  # 我们可以查看default.conf
  # 你会发现etc/nginx下有个nginx.conf 配置文件我们查看配置发现这里有条语句是引用了上面default.conf的配置，由此可见我们以后需要配置其他项目路径就直接配置default.conf就行了。

  ```  
  :::tip
  为什么要挂载在到docker的/usr/share/nginx/html,
  因为每次修改都需要进入容器的内部求修改, 所以需要把配置pc 一份到宿主机目录

  docker cp nginx_wms_ui:/etc/nginx /Users/chenxiaoyong/Desktop/资料/nginx/
  nginx_wms_ui： 容器名称
  /etc/nginx: 为需要复制的文件
  /Users/chenxiaoyong/Desktop/资料/nginx/： 保存到那个目录下

  ![image]('../../../../../.vuepress/public/images/nginxPath.png')

    * 默认监听80端口
    * root /use/share/nginx/html 指定存放页面的文件夹
    * /50x.html{ root /usr/share/nginx/html } 出现错误跳转到该目录页面

    从图配置路径来开，我们只需要配置default.conf就行了
    **`/etc/nginx 中有个nginx.conf => include 是指向 conf.d/default.conf.所以修改default.conf 就修改了nginx.conf`**
  :::

  ### 优化nginx配置
    #### 复制配置文件，为了以后多项目部署方便修改Nginx
    ![image]('../../../../../.vuepress/public/images/nginxcopy.png')
    :::tip
     **`docker cp nginx_wms_ui:/etc/nginx /Users/chenxiaoyong/Desktop/资料/`**
      nginx_wms_ui: 容器名称
      /etc/nginx: 容器需要复制的文件
      /Users/chenxiaoyong/Desktop/资料/: 宿主文件目录
    :::

    #### 修改宿主机配置进入conf.d文件夹下修改default.conf
    * :i
    * root: /usr/local/vue/dist # 两个位置都修改
    * esc
    * :wq

    #### 删除nginx_wms_ui 容器
      docker rm 60475a6d82ea --force ｜ docker rm 60475a6d82ea
    #### 重启容器
      docker run --name nginx_demo -p 5000:80 -v /Users/chenxiaoyong/Desktop/nginx/dist:/usr/local/vue/dist -v /Users/chenxiaoyong/Desktop/nginx:/etc/nginx -d nginx
    :::tip

    ![image]('../../../../../.vuepress/public/images/fileshare.png')
    解释：
    –name：后面的是容器名称
    -p:冒号前面是宿主机的对外端口，冒号后面的是容器的端口
    -v：冒号前面的是宿主机的文件目录，冒号后面是容器的内部文件目录
    -d:表示后端运行
    nginx：最后面的nginx是镜像的名称
    :::