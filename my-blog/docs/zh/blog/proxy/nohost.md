## nohost抓包神器使用

### 安装
```bash
sudo npm i -g @nohost/server --registry=https://r.npm.taobao.org
```
**查看是否按照成功**
```bash
n2 --version
```

**启动｜停止**
```bash
n2 start ｜ n2 stop
n2 restart ｜ n2 restart —-reset 重置管理员账号
```

## [证书安装](https://mp.weixin.qq.com/s?__biz=MzUxNjQ1NjMwNw==&mid=2247485085&idx=1&sn=5418e3affd819811388632147f579c31&scene=21#wechat_redirect)

## [常用操作](https://wproxy.org/whistle/rules/reqMerge.html)
```bash
# 一、本地文件或文件路径替换功能 有点像谷歌的overrides功能 (overrides功能见https://www.jianshu.com/p/20b1276f63e6)
#https://www.zfb.com/test.html D:\1公司项目\ios\workspace\pay.html
#https://h5.baidu.com/joinclub/ D:\1公司项目\joinClub\workspace\

# 二、host映射和特定子路径的host映射
#10.0.203.99:3000 www.baidu.com
#10.0.203.99:3000 www.baidu.com/pay.html

# 三、请求转发 将制定的域名请求转发至另一个域名
# configapi.baidu.com configapi.google.com
#h5.baidu.com www.baidu.com

# 四、html css js文件注入
#https://www.baidu.com/ jsPrepend://https://wechatfe.github.io/vconsole/lib/vconsole.min.js?v=3.3.0
#https://www.baidu.com/ jsAppend://{initVconsole}

# 五、响应类型、响应数据及响应头修改
#https://clubopapi.baidu.com/web/game/config/get?web_id=0 resType://json
# tpl一般用来模拟jsonp请求
#https://clubopapi.baidu.com/web/game/config/get?web_id=0 tpl://{mockRes}
#https://clubopapi.baidu.com resHeaders://{resHeaders}
#https://www.baidu.com/ D:\1公司项目\indexapp\workspace\

# 六、修改响应参数(合并)
#https://clubopapi.baidu.com/web/game/config/get resMerge://(count=1000&value=2)
#https://clubopapi.baidu.com/web/game/config/get resMerge://{mockRes}


# 七、替换响应内容（常用）
#https://clubopapi.baidu.com/web/game/config/get resBody://{mockRes}

# 八、响应延迟
#https://clubopapi.baidu.com/web/game/config/get?web_id=0 resDelay://5000
#https://clubopapi.baidu.com/web/game/config/get?web_id=0 resSpeed://3


# 九、ua修改（虽然在浏览器调试工具中看到的还是原本的ua，但是实际请求时还是按照你更改的ua进行请求）
#https://www.baidu.com/ ua://{UA}

# 十、修改请求参数或内容(合并)
#https://clubopapi.baidu.com/web/game/config/get reqMerge://{reqMerge}
# 上述也可 按照如下 操作值的写法 https://wproxy.org/whistle/data.html
# https://clubopapi.baidu.com/web/game/config/get reqMerge://(web_id=1)

# 十一、替换请求内容 (post方法)
#http://test.iossign.baidu.com/down/limit/add reqBody://{reqBody}


# 十二、启用weinre
# www.baidu.com weinre://testInspect
```