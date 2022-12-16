import { SidebarConfig } from 'vuepress';

// 侧边栏导航
export const sidebarZh: SidebarConfig = {
  '/zh/blog/': [
    {
      text: '博客',
      collapsible: true,
      children: [
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
          text: 'bestBlog',
          collapsible: true,
          children: [
            {
              text: 'blog',
              link: '/zh/blog/bestBlog/blog.md',
            },
            {
              text: 'css',
              link: '/zh/blog/bestBlog/css.md',
            },
            {
              text: 'blog',
              link: '/zh/blog/bestBlog/blog.md',
            },
            {
              text: 'js',
              link: '/zh/blog/bestBlog/js.md',
            },
            {
              text: 'tool',
              link: '/zh/blog/bestBlog/tool.md',
            },
            {
              text: 'ts',
              link: '/zh/blog/bestBlog/ts.md',
            },
            {
              text: 'vue',
              link: '/zh/blog/bestBlog/vue.md',
            },
          ]
        },
        {
          text: 'chatGPT',
          collapsible: true,
          children: [
            '/zh/blog/chatGPT/index.md',
          ]
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
          text: 'date',
          collapsible: true,
          children: [
            {
              text: 'QA',
              link: '/zh/blog/date/QA.md',
            }
          ],
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
          text: 'jenkins',
          collapsible: true,
          children: [
            {
              text: 'jenkins配置',
              link: '/zh/blog/jenkins/index.md',
            }
          ]
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
          text: 'oneQuestionPerDay',
          collapsible: true,
          children: [
            {
              text: '每日一题',
              link: '/zh/blog/oneQuestionPerDay/index.md',
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
          text: 'python',
          collapsible: true,
          children: [
            {
              text: 'base',
              link: '/zh/blog/python/base.md',
            },
            {
              text: 'config',
              link: '/zh/blog/python/config.md',
            },
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
          text: 'snipper',
          collapsible: true,
          children: [
            {
              text: '组件',
              collapsible: true,
              children: [
                {
                  text: '日历',
                  link: '/zh/blog/snipper/组件/calendar.md',
                },
                {
                  text: '单元格',
                  link: '/zh/blog/snipper/组件/cell.md',
                },
                {
                  text: '表达From',
                  link: '/zh/blog/snipper/组件/formHeader.md',
                },
                {
                  text: 'treeSelect',
                  link: '/zh/blog/snipper/组件/treeSelect.md',
                },
              ]
            },
            {
              text: 'Functions',
              collapsible: true,
              children: [
                {
                  text: '函数',
                  link: '/zh/blog/snipper/functions/index.md',
                },
              ]
            },
            {
              text: 'Hooks',
              collapsible: true,
              children: [
                {
                  text: 'hooks',
                  link: '/zh/blog/snipper/hooks/index.md',
                },
              ]
            }
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
              text: '插件',
              link: '/zh/blog/vue/插件.md',
            },
            {
              text: '修饰符',
              link: '/zh/blog/vue/修饰符.md',
            },
            {
              text: 'vue',
              link: '/zh/blog/vue/index.md',
            }
          ],
        },
        {
          text: 'webpack',
          collapsible: true,
          children: [
            {
              text: '插件',
              link: '/zh/blog/webpack/plugins.md',
            },
          ],
        }
      ],
    },
  ]
}
