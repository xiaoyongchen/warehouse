## windows 下使用 nvm-windows 切换 node 不成功

- npm cache clean --force
- 从控制面板卸载 node
- 彻底删除路径
  \*\* C:\Program Files (x86)\Nodejs

\*\*C:\Program Files\Nodejs

\*\*C:\Users\{User}\AppData\Roaming\npm（或%appdata%\npm）

\*\* C:\Users\{User}\AppData\Roaming\npm-cache（或%appdata%\npm-cache）

\*_ C:\Users\{User}\AppData\Local\Temp\npm-_

- 我的电脑 => 属性 => 高级属性 => 全局 path 删除 node 相关路径

- 下载 nvm-windows 使用这个装 node
