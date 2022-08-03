import { defaultTheme, defineUserConfig } from 'vuepress';
import { navbarEn, navbarZh, sidebarEn, sidebarZh } from './configs';

export default defineUserConfig({
  locales: {
    '/en/': {
      lang: 'en-US',
      title: 'vuepress',
      description: 'Vue-powered Static Site Generator',
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'vuepress',
      description: 'Vue 驱动的静态网站生成器',
    },
  },
  theme: defaultTheme({
    logo: '/images/hero.png',
    // git地址
    // repo: 'https://github.com/xiaoyongchen/warehouse/',
    docsDir: 'docs',
    locales: {
      '/en/': {
        navbar: navbarEn,
        sidebar: sidebarEn,
        selectLanguageName: 'English',
        selectLanguageText: 'Languages',
        selectLanguageAriaLabel: 'Languages',
      },
      '/zh/': {
        navbar: navbarZh,
        sidebar: sidebarZh,
        selectLanguageName: '简体中文',
        selectLanguageText: '选择语言',
        selectLanguageAriaLabel: '选择语言',
        tip: '提示',
        warning: '注意',
        danger: '警告',
        // 404 page
        notFound: [
          '这里什么都没有',
          '我们怎么到这来了？',
          '这是一个 404 页面',
          '看起来我们进入了错误的链接',
        ],
        backToHome: '返回首页',
        // a11y
        openInNewWindow: '在新窗口打开',
        toggleColorMode: '切换颜色模式',
        toggleSidebar: '切换侧边栏',
        // 全局的国际化...
        // editLinkText: '在 GitHub 上编辑此页',

      }
    }
  }),
})
