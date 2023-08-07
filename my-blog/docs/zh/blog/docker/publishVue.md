## Docker发布一个vue项目

### Docker运行一个简单的echo命令
  ```bash
    # 搜索docker search [REPOSITORY[:TAG]]
      docker search nginx
    # 拉取docker pull [REPOSITORY[:TAG]]
      docker pull nginx
    # 查看镜像docker image ls
      docker images 
    # 删除镜像docker image rm [REPOSITORY[:TAG]] docker rmi [OPTIONS] IMAGE [IMAGE...] -f    -f: 强制删除
    # rm 删除一个或者多个容器 rmi 表示删除一个或者多个镜像
      docker rmi -f nginx
    # 删除容器
      docker rm [容器id] [容器id]
    # 查看运行的容器
      docker ps -a
    # 查看|停止｜重新开始 容器
      docker ps ｜ stop ｜ restart

    # 运行一个简单的hello world。这里回pull并运行centos 
      docker run centos echo "hello world"  # hello world
  ```

### 打包运行vue项目

  ```bash
  # start
  # 创建vue项目
  cd Desktop
  vue create vue-demo
  yarn build

  # 拉取nginx镜像
  docker pull nginx

  # 生成容器，这里用ip访问nginx的时候，就已经替换成宿主的dist下面的index.html，这里有个弊端，每次修改配置都要到容器中修改
  docker run -d -p 80:80 --name nginx_wms_ui -v /Users/chenxiaoyong/Desktop/资料/nginx/dist:/usr/share/nginx/html --restart=always nginx

  docker run -d -p 80:80 --name nginx_wms_ui -v /Users/admin/Desktop/dockerConfig/nginx/dist:/usr/share/nginx/html --restart=always nginx


  -d=true|false
    后台运行使用 daemon 模式, 默认值false
  -p:设置port: 默认端口
  --name: 别名
  -v数据卷 --volumn: 宿主目录:容器目录
  --restart: always nginx 一直重启

  # 重启服务
  docker start ｜ restart [容器id]

  # 打开本地ip，查看是否成功,这里的80是设置的对外端口号，可以自定义
  localhost:80 | 10.7.***.***:80

  # end

  ```  

  ### 优化vue配置
  `每次修改配置都要到容器中修改`使用容器的配置拷贝一份到宿主容器，之后-v 修改数据卷宿主的目录对应容器的目录

  ```bash
  # 前提背景
  # 进入容器目录
  docker exec -it 容器id /bin/bash

  # 进入
  cd /etc/nginx/conf.d

  # 你会发现etc/nginx下有个nginx.conf 
  # 配置文件我们查看配置发现这里有条语句是引用了上面default.conf的配置，
  # 由此可见我们以后需要配置其他项目路径就直接配置default.conf就行了。

  # 操作
  # 拷贝容器的目录到宿主指定的目录（这个目录以后会用到比较重要）
  docker cp nginx_wms_ui:/etc/nginx /Users/chenxiaoyong/Desktop/nginx/
    说明:
    nginx_wms_ui： 容器名称
    /etc/nginx: 为需要复制的文件
    /Users/chenxiaoyong/Desktop/nginx/： 保存到那个目录下

  # 修改宿主目录的default.conf 
    vi  /Users/chenxiaoyong/Desktop/nginx/conf.d/default.conf
    :i
    esc
    :wq
  
  # 修改配置内容

  server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        # 指定位置
        root   /usr/local/vue/dist;
        index  index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        # 指定位置
        root   /usr/local/vue/dist;
    }
}

# 删除容器
  docker rm [容器id]

# 重启容器
  docker run --name nginx_demo -p 5000:80 -v /Users/chenxiaoyong/Desktop/nginx/dist:/usr/local/vue/dist -v /Users/chenxiaoyong/Desktop/nginx:/etc/nginx -d nginx

  解释：
  –name：后面的是容器名称
  -p:冒号前面是宿主机的对外端口，冒号后面的是容器的端口
  -v：冒号前面的是宿主机的文件目录，冒号后面是容器的内部文件目录
  -d:表示后端运行
  nginx：最后面的nginx是镜像的名称
  