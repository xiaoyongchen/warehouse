## switchyOmega

**安装插件**
设置代理服务器和端口，**公司的代理OR自己的**

:::tip
  每次使用都用自动切换功能，请求不了点击黄色感叹号，添加条件
  * github.com *.google.com 情景模式为梯子代理
  * 如果有nohost，可以配置情景模式 proxy-console.***.com 80,之后nohost设置转化就行了
:::

### 虚情景模式

好处，对一一个web项目，设置了接口使用虚情景模式，
* 它默认是直接连接的。
* 对于匹配的域名使用你指定的代理或者本地文件，其他走直接连接
  
### file://{res.json} | resBody{res.json} | resMerge{res.json}  区别
* 数据大小 file://{res.json} > resBody{res.json} > resMerge{res.json} file包含请求头部分(包含token等信息)，resBody结果对象， resMerge可以是结果部分对象
* 前端请求最好使用后2个，要不然会跨域。
* 移动端3个都可以用，不会导致跨域。


## 安装插件
安装之后就可以使用Console.log 等插件
```bash
  npm i -g whistle.inspect
```

https://fanguyun214.github.io/post/qian-duan-kua-ping-tai-diao-shi/