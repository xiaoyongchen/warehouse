module.exports = {
  plugins: {
    "postcss-px-to-viewport": {
      viewportWidth: 375,
      exclude: [
        // 忽略node_modules目录下第三方组件的样式转化
        /node_modules/,
      ],
    },
  },
};
