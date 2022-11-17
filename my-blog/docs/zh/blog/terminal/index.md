
## 常用终端指令

### 查看系统 
  x86_64 表示系统为64位
  i686 表示系统32位的；
    uname -a 

### 本机使用者

whoami

### 查看ip
ifconfig | grep "inet"

### whereis
  查看nginx的目录：whereis nginx


### 移除开机启动项 （如：移除思科）
sudo mv /Library/LaunchAgents/com.cisco.anyconnect.gui.plist

### 修改本地的hosts文件

```bash
# 比如修改127.0.0.1 www.baidu.com
sudo nano /private/etc/hosts
# ^x退出

# 结果百度访问不了了
```

### 查看端口占用并且杀死当前端口

```bash
# 我开启一个前端工程

# 查看端口占用
sudo lsof -i tcp:8080

# COMMAND PID         USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
# WeChat  452 chenxiaoyong   20u  IPv4 0x1df2d66e7d785499      0t0  TCP 10.7.105.6:56418->14.116.242.250:http (ESTABLISHED)

# 杀死进程
kill -9 452

# 结果工程退出了
```

### 查看终端命令

history



