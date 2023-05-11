## windows 下使用nvm-windows 切换node不成功

* npm cache clean --force
* 从控制面板卸载node
* 彻底删除路径
** C:\Program Files (x86)\Nodejs

**C:\Program Files\Nodejs

**C:\Users\{User}\AppData\Roaming\npm（或%appdata%\npm）

** C:\Users\{User}\AppData\Roaming\npm-cache（或%appdata%\npm-cache）

** C:\Users\{User}\AppData\Local\Temp\npm-*

* 我的电脑 => 属性 => 高级属性 => 全局path删除node相关路径

* 下载nvm-windows 使用这个装node