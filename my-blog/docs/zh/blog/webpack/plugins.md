
## plugin插件

**原理**

* `webpack可以看作生产线`，要经过一系列处理流程才能转换输出结果，每个流程都是单一的，多个流程存在依赖关系，只有完成了当前才能处理之后的流程。
* `webpack事件流机制`，webpack会广播事件，插件只需要监听它自己的事件，就能加入这条生产线中。这里跟任务有点类似。
* `Tapable组织者`，webpack在编译过程中会出发一系列的Tapable事件钩子，插件所做的任务就是在tapable的钩子事件中注册自己的事件。这样在webpack构建的时候，插件注册的钩子事件也会相应的处理。
 * 其中有SyncHook SyncBaiHook SyncWaterfallHook SyncLoopHook SyncParalleHook SyncParalleBaiHook SyncSeriesBaiHook SyncSeriesLookHook SyncSeriesWaterfallHook HookMap MultiHook
 * 统一暴露了3个方法给插件 tap(同步和异步钩子) tapAsync tapPromise

**Compiler**

* compiler保存着完整的webpack的环境配置(包括loading，plugin)，每次启动webpack都是独一无二，仅仅只会创建一次的对象。
* 包含下面的属性
  * options (loaders、entry、output、plugin等)
  * inputFileSystem
  * outputFileSystem 相当于node的fs
  * hooks 注册的事件钩子[https://www.webpackjs.com/api/compiler-hooks/]
  
**Compilation**

  * 代表一次资源的构建，`compilation`实例能访问所有的模块和依赖。
  * 在编译阶段，模块会被加载(load) => 封存(seal) => 优化(optimize) => 分块(chunk) => 哈希(hash) => 重新创建(restore)
  * 包含了以下属性：
   * compilation.modules ：可以访问所有模块，打包的每一个文件都是一个模块。
   * compilation.chunks：chunk 即是多个 modules 组成而来的一个代码块。入口文件引入的资源组成一个 chunk，通过代码分割的模块又是另外的 chunk
   * compilation.assets：可以访问本次打包生成所有文件的结果。
   * compilation.hooks：可以注册 tapable 的不同种类 Hook，用于在 compilation 编译模块阶段进行逻辑添加以及修改

  **生命周期简图**

  ![image](https://img-blog.csdnimg.cn/3c5751a82fcc44759d8761c4757823a0.png#pic_center)

  **开发插件步骤**

    * compile 是SyncHook 只能用tap
    * make 是asyncHook 可以用tap tapAsync tapPromise
    * emit 是async Hook 特点异步任务顺序执行。
  
  ```javascript
    
  class TestPlugin {
    constructor () {
      console.log('TestPlugin constructor');
    }
    apply(compiler) {
      console.log('TestPlugin apply');
      // compile是SyncHook只能用tap
      compiler.hooks.compile.tap('TestPlugin', (compilation) => {
        console.log('compile.hooks()');
      });

      // make 是asyncHook tap tapAsync tapPromise 都能用
      compiler.hooks.make.tap('TestPlugin', (compilation) => {
        console.log('make.hooks() tap');
      });

      compiler.hooks.make.tapAsync('TestPlugin', (compilation, callback) => {
        setTimeout(() => {
          console.log('make.hooks() tapAsync');
        }, 1000);
      });

      compiler.hooks.make.tapPromise('TestPlugin', (compilation) => {
        console.log('make.hooks() tapPromise');
        return new Promise((resolve) => {
          resolve();
        })
      });


      // emit 是asyncHook 特点顺序执行
      compiler.hooks.emit.tapAsync('TestPlugin', (compilation, callback) => {
        setTimeout(() => {
          console.log('emit.hooks() tapAsync 3000');
        }, 3000);
      });

      compiler.hooks.emit.tapAsync('TestPlugin', (compilation, callback) => {
        setTimeout(() => {
          console.log('emit.hooks() tapAsync 2000');
        }, 2000);
      });

      compiler.hooks.emit.tapAsync('TestPlugin', (compilation, callback) => {
        setTimeout(() => {
          console.log('emit.hooks() tapAsync 1000 ');
        }, 1000);
      });

    }
  }

  module.exports = TestPlugin;


  // 输出
  TestPlugin constructor
  TestPlugin apply
  compile.hooks()
  make.hooks() tapPromise
  make.hooks() tap
  make.hooks() tapAsync

  emit.hooks() tapAsync 3000
  emit.hooks() tapAsync 2000
  emit.hooks() tapAsync 1000


```

**调试compiler 和compilation对象**

在package.json的

```bash
  "scripts": {
    "debug": "node --inspect-brk ./node_modules/webpack-cli/bin/cli.js"
  }
  // 执行后可以看到一个绿色的图标
  在调试处使用debugger
```

**自定义插件**

### BannerWebpackPlugin
  需求：给打包输出文件添加注释
  * 需要打包输出前添加注释：需要使用 compiler.hooks.emit 钩子, 它是打包输出前触发
  * 如何获取打包输出的资源？compilation.assets 可以获取所有即将输出的资源文件

```javascript
class BannerWebpackPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    // 在资源输出之前触发
    compiler.hooks.emit.tap("BannerWebpackPlugin", (compilation) => {
      // debugger;
      const extensions = ["css", "js"];
      // 1. 获取即将输出的资源文件：compilation.assets
      // 2. 过滤只保留js和css资源
      const assets = Object.keys(compilation.assets).filter((assetPath) => {
        // 将文件名切割 ['xxxx', 'js'] ['xxxx', 'css']
        const splitted = assetPath.split(".");
        // 获取最后一个文件扩展名
        const extension = splitted[splitted.length - 1];
        // 判断是否保护
        return extensions.includes(extension);
      });

      const prefix = `/*
                        * Author: ${this.options.author}
                        */
                        `;
      // 3. 遍历剩下资源添加上注释
      // console.log(assets);
      assets.forEach((asset) => {
        // 获取原来内容
        const source = compilation.assets[asset].source();
        // 拼接上注释
        const content = prefix + source;

        // 修改资源
        compilation.assets[asset] = {
          // 最终资源输出时，调用source方法，source方法的返回值就是资源的具体内容
          source() {
            return content;
          },
          // 资源大小
          size() {
            return content.length;
          },
        };
      });
    });
  }
}

module.exports = BannerWebpackPlugin;
```

### CleanWebpackPlugin
  需求：在 webpack 打包输出前将上次打包内容清空
  * 如何在打包输出前执行？需要使用 compiler.hooks.emit 钩子, 它是打包输出前触发
  * 如何清空上次打包内容？
    * 获取打包输出目录：通过 compiler 对象
    * 通过文件操作清空内容：通过 compiler.outputFileSystem 操作文件

```javascript
class CleanWebpackPlugin {
  apply(compiler) {
    // 获取打包输出的目录
    const outputPath = compiler.options.output.path;
    const fs = compiler.outputFileSystem;
    // 注册钩子：在打包输出之前 emit
    compiler.hooks.emit.tap("CleanWebpackPlugin", (compilation) => {
      // 通过fs删除打包输出的目录下的所有文件
      this.removeFiles(fs, outputPath);
    });
  }

  removeFiles(fs, filepath) {
    // 想要删除打包输出目录下所有资源，需要先将目录下的资源删除，才能删除这个目录
    // 1. 读取当前目录下所有资源
    const files = fs.readdirSync(filepath);
    // console.log(files); // [ 'images', 'index.html', 'js' ]
    // 2. 遍历一个个删除
    files.forEach((file) => {
      // 2.1 遍历所有文件，判断是文件夹还是文件
      const path = `${filepath}/${file}`;
      const fileStat = fs.statSync(path);
      // console.log(fileStat);
      if (fileStat.isDirectory()) {
        // 2.2 是文件夹，就得删除下面所有文件，才能删除文件夹
        this.removeFiles(fs, path);
      } else {
        // 2.3 是文件，直接删除
        fs.unlinkSync(path);
      }
    });
  }
}

module.exports = CleanWebpackPlugin;

```