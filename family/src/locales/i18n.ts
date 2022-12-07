import { createI18n } from "vue-i18n"
import QueryString from "qs"
import locales from './locales'

import { Locale } from 'vant'
import enUS from 'vant/es/locale/lang/en-US';
import zhCN from 'vant/lib/locale/lang/zh-CN';

// 默认中文
const DEFAULT_LANG = 'zh_CN'
// 初始化i18n
const i18n: any = createI18n({
  messages: locales
})

// 获取地址栏参数
const query = QueryString.parse(window.location.href.split('?')[1])
// 获取语言环境
const lang: any = query.lang || getI18nLang()
// 设置语言环境
switchI18nLang(lang)

export default i18n

// 切换语言
export function switchI18nLang(lang: string) {
  // 语言为空, 使用默认语言
  if (!lang) {
      lang = DEFAULT_LANG
  }
  // 语言对应内容为空, 使用默认语言
  if ((locales as any)[lang] === undefined) {
    lang = DEFAULT_LANG
  }
  // 本地化存储语言
  localStorage.setItem("i18n-lang", lang)
  // 设置i18n的语言
  i18n.global.locale = lang
  // Vant 的语言设置
  if (lang === 'zh_CN') {
    Locale.use('zh-CN', zhCN)
  } else {
    Locale.use('en-US', enUS)
  }
}

// 获取当前语言环境
export function getI18nLang() {
  return localStorage.getItem("i18n-lang")
}
