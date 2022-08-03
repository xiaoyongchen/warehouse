import { SidebarConfig } from 'vuepress';

// 侧边栏导航
export const sidebarZh: SidebarConfig = {
  '/zh/blog/': [
    {
      text: '博客',
      collapsible: true,
      children: [
        {
          text: 'bestBlog',
          link: '/zh/blog/bestBlog/index.md',
        },
        {
          text: 'css',
          collapsible: true,
          children: [
            '/zh/blog/css/移动端兼容.md',
            '/zh/blog/css/utility.md',
          ]
        },
        {
          text: 'git',
          collapsible: true,
          children: [
            {
              text: 'git常用指令',
              link: '/zh/blog/git/command.md',
            },
            {
              text: '常见问题',
              link: '/zh/blog/git/QA.md'
            }
          ]
        },
        {
          text: 'react',
          link: '/zh/blog/react/index.md',
        },
        {
          text: 'regExp',
          link: '/zh/blog/regExp/常用正则匹配.md',
        },
        {
          text: 'tool',
          collapsible: true,
          children: [
            {
              text: '新电脑配置',
              link: '/zh/blog/tool/新电脑配置.md',
            },
            {
              text: '通用工具',
              link: '/zh/blog/tool/common.util.md',
            },
            {
              text: '时间工具',
              link: '/zh/blog/tool/time.util.md',
            },
            {
              text: '校验工具',
              link: '/zh/blog/tool/validator.util.md'
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
                '/zh/blog/ts/advanced/类型操作.md'
              ]
            },
            {
              text: 'base',
              collapsible: true,
              children: [
                '/zh/blog/ts/base/模式匹配.md'
              ]
            },
            {
              text: 'tips',
              link: '/zh/blog/ts/tips.md'
            },
            {
              text: 'utility',
              link: '/zh/blog/ts/utility.md'
            }
          ]
        },
        {
          text: 'vue',
          link: '/zh/blog/vue/修饰符.md',
        },
      ],
    },
  ]
}
