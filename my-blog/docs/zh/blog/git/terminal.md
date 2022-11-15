
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
