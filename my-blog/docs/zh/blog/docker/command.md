## [命令大全](https://www.runoob.com/docker/docker-command-manual.html)
### 协从命令
```bash
  # 查看镜像、容器、数据卷占用空间
  docker system df
```

### 镜像

```bash

  # 镜像搜索 
  docker search [OPTIONS] TERM
    docker search nginx --limit 3
    # 标准  STARS     OFFICIAL：是否官方推荐

  # 镜像获取
  docker pull [OPTIONS] NAME[:TAG|@DIGEST]

    docker pull nginx

  # 查看镜像
  docker images [OPTIONS] [REPOSITORY[:TAG]]
    -a: all所有镜像
    -f: filter 过滤指定的镜像
    -q: --quiet 简洁之显示ids
    # 只显示centos镜像，可以增加tag，显示对于版本镜像
    docker images contos
    # 查看centos之前的镜像
    docker images -f since=centos

  # 删除镜像
    # 删除虚玄镜像
    docker images prune
    -a: --all 所有的镜像

    # 删除镜像
    # 删除镜像id或者名称
    docker rmi [OPTIONS] IMAGE [IMAGE...]
    docker rmi ngxin
      -f: --force
      --no-prune: 不要删除未标记的依赖
    
    # rm remove rmi 都行, 把需要删除都放后面
    docker image rm [OPTIONS] IMAGE [IMAGE...]
      -f: --force
      --no-prune: 不要删除未标记的依赖

    # 更精确的删除使用摘要删除
    $ docker image ls --digests
      REPOSITORY                  TAG                 DIGEST                                                                    IMAGE ID            CREATED             SIZE
      node                        slim                sha256:b4f0e0bdeb578043c1ea6862f0d40cc4afe32a4a582f3be235a3b164422be228   6e0c4c8e3913        3 weeks ago         214 MB

      $ docker image rm node@sha256:b4f0e0bdeb578043c1ea6862f0d40cc4afe32a4a582f3be235a3b164422be228
      Untagged: node@sha256:b4f0e0bdeb578043c1ea6862f0d40cc4afe32a4a582f3be235a3b164422be228

    # 批量删除镜像
    docker image rm $(docker images -qa)
  
  # 提交镜像 ...todo

  #
```
### 虚玄镜像
```bash
  镜像名称：none && 镜像tag：none
  官方镜像名维护，老的镜像名被替换，导致这个问题。
  # 显示这类镜像
  docker image ls -f dangling=true
  # 删除所有未被tag 标记和未被容器使用的镜像
  # 删除停止运行的镜像
  docker images prune -a: --all 所有的镜像
  # 删除所有停止运行的容器
  docker container prune
  docker network prune
  docker system prune
  docker volumn prune
```

### 容器
```bash
  docker ps [options] 
    -a 所有容器
    -p 只列出容器id
    -l 限制多少个
    -n 最近打开容器
```

