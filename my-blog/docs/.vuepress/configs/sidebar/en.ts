import { SidebarConfig } from 'vuepress';

// 侧边栏导航
export const sidebarEn: SidebarConfig = {
  '/en/blog/': [
    {
      text: '博客',
      collapsible: true,
      children: [
        {
          text: 'bestBlog',
          link: '/en/blog/bestBlog/index.md',
        },
        {
          text: 'css',
          collapsible: true,
          children: [
            '/en/blog/css/移动端兼容.md',
            '/en/blog/css/utility.md',
          ]
        },
        {
          text: 'react',
          link: '/en/blog/react/index.md',
        },
        {
          text: 'regExp',
          link: '/en/blog/regExp/常用正则匹配.md',
        },
        {
          text: 'tool',
          collapsible: true,
          children: [
            {
              text: '通用工具',
              link: '/en/blog/tool/common.util.md',
            },
            {
              text: '时间工具',
              link: '/en/blog/tool/time.util.md',
            },
            {
              text: '校验工具',
              link: '/en/blog/tool/validator.util.md'
            }
          ]
        },
        {
          text: 'ts',
          collapsible: true,
          children: [
            {
              text: 'advanced',
              collapsible: true,
              children: [
                '/en/blog/ts/advanced/类型操作.md'
              ]
            },
            {
              text: 'base',
              collapsible: true,
              children: [
                '/en/blog/ts/base/模式匹配.md'
              ]
            },
            {
              text: 'tips',
              link: '/en/blog/ts/tips.md'
            },
            {
              text: 'utility',
              link: '/en/blog/ts/utility.md'
            }
          ]
        },
        {
          text: 'vue',
          link: '/en/blog/vue/index.md',
        },
      ],
    },
  ]
}
