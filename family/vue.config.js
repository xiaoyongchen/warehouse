/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
const path = require("path");
const { merge } = require("webpack-merge");
const tsImportPluginFactory = require("ts-import-plugin");
module.exports = {
  parallel: false, // 解决编译离线包时vant css不加载的问题
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本, 可以使用template, 大小增加10kb
  productionSourceMap: false, // 是否在构建样式地图，false将提高构建速度
  configureWebpack: () => {
    const externalLibs = () => {
      // 离线包外部引用全局资源部中的库，不打包进来
      if (process.env.NODE_ENV === "production") {
        return {
          vue: "Vue",
          "vue-router": "VueRouter",
          "vue-i18n": "VueI18n",
          axios: "axios",
          qs: "Qs",
        };
      } else {
        return {};
      }
    };

    return {
      resolve: {
        // 设置别名
        alias: {
          "@": path.resolve(__dirname, "src"),
          "@utils": path.resolve(__dirname, "src/utils"),
          "@views": path.resolve(__dirname, "src/views"),
          "@styles": path.resolve(__dirname, "src/styles"),
          "@services": path.resolve(__dirname, "src/services"),
          "@components": path.resolve(__dirname, "src/components"),
          "@config": path.resolve(__dirname, "src/config"),
          "@constant": path.resolve(__dirname, "src/constant"),
          "@hooks": path.resolve(__dirname, "src/hooks"),
          "@plugins": path.resolve(__dirname, "src/plugins"),
          "@interceptors": path.resolve(__dirname, "src/interceptors"),
          "@storage": path.resolve(__dirname, "src/storage"),
          "@store": path.resolve(__dirname, "src/store"),
        },
      },
      // externals: externalLibs()
    };
  },
  chainWebpack: (config) => {
    config.module
      .rule("ts")
      .use("ts-loader")
      .tap((options) => {
        options = merge(options, {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: "vant",
                libraryDirectory: "es",
                style: true,
              }),
            ],
          }),
          compilerOptions: {
            module: "es2015",
          },
        });
        return options;
      });
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
  // 全局导入less文件
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "src/styles/index.less")],
    },
  },
  // 公共地址
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  // 开发配置
  devServer: {
    // 让浏览器 overlay 同时显示警告和错误
    overlay: {
      warnings: true,
      errors: true,
    },
    // 禁用host验证
    disableHostCheck: true,
    // 端口号
    port: 8080,
    // 热更新
    hotOnly: true,
    // 关闭自动打开浏览器，因为在windows + wsl1的环境下会错误导致无法启动服务
    open: false,
  },
};
