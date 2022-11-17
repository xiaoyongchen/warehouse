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
              text: 'git指令',
              link: '/zh/blog/git/index.md',
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
          text: 'docker',
          collapsible: true,
          children: [
            {
              text: '概念',
              link: '/zh/blog/docker/index.md',
            },
            {
              text: '指令',
              link: '/zh/blog/docker/command.md',
            },
            {
              text: '参数说明',
              link: '/zh/blog/docker/参数说明.md',
            },
            {
              text: 'commitAli',
              link: '/zh/blog/docker/commitAli.md',
            },
            {
              text: '构建一个vue项目',
              link: '/zh/blog/docker/publishVue.md'
            }
          ]
        },
        {
          text: 'regExp',
          link: '/zh/blog/regExp/常用正则匹配.md',
        },
        {
          text: 'node',
          collapsible: true,
          children: [
            {
              text: 'node',
              link: '/zh/blog/node/index.md',
            },
            {
              text: 'nvm',
              link: '/zh/blog/node/nvm.md',
            },
          ]
        },
        {
          text: 'proxy',
          collapsible: true,
          children: [
            {
              text: 'nohost',
              link: '/zh/blog/proxy/nohost.md',
            },
            {
              text: 'switchyOmega',
              link: '/zh/blog/proxy/switchyOmega.md',
            },
          ]
        },
        {
          text: 'terminal',
          collapsible: true,
          children: [
            {
              text: 'terminal',
              link: '/zh/blog/terminal/index.md',
            },
            {
              text: 'QA',
              link: '/zh/blog/terminal/QA.md',
            }
          ]
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
          collapsible: true,
          children: [
            {
              text: '修饰符',
              link: '/zh/blog/vue/修饰符.md',
            },
            {
              text: '技巧',
              link: '/zh/blog/vue/index.md',
            }
          ],
        },
        {
          text: 'network',
          collapsible: true,
          children: [
            {
              text: '常见问题',
              link: '/zh/blog/network/常见问题.md',
            }
          ],
        },
        {
          text: 'article',
          collapsible: true,
          children: [
            {
              text: '感悟',
              link: '/zh/blog/article/感悟.md',
            },
            {
              text: '罗翔',
              link: '/zh/blog/article/罗翔.md',
            },
            {
              text: '董宇飞',
              link: '/zh/blog/article/董宇飞.md',
            },
          ],
        },
        {
          text: 'android',
          collapsible: true,
          children: [
            {
              text: '常见问题',
              link: '/zh/blog/android/常见问题.md',
            },
          ],
        },
        {
          text: 'js',
          collapsible: true,
          children: [
            {
              text: '基础',
              link: '/zh/blog/js/base.md',
            },
            {
              text: '高级',
              link: '/zh/blog/js/advanced.md',
            },
            {
              text: '原型链',
              link: '/zh/blog/js/原型链.md'
            },
            {
              text: '代码规范',
              link: '/zh/blog/js/代码规范.md',
            },
            {
              text: 'QA',
              link: '/zh/blog/js/QA.md',
            },
          ],
        },
        {
          text: 'date',
          collapsible: true,
          children: [
            {
              text: 'QA',
              link: '/zh/blog/date/QA.md',
            }
          ],
        },
      ],
    },
  ]
}
