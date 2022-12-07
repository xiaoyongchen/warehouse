/* eslint-disable */
/*eslint no-empty-function: ["error", { "allow": ["methods"] }]*/
import syncStorage from "@/storage";

// JiahuiJSBridge提供call方法进行异步调用
const JiahuiJSBridge = (window as any).JiahuiJSBridge;

function JsBridge(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  descriptor.value = (params?: Record<string, unknown>, callback?: NativeCallResultCallback) => {
    if (JiahuiJSBridge.isReady()) {
      JiahuiJSBridge.call(propertyKey, params, callback)
    }
  }
}

function JsBridgeAsync(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  descriptor.value = async (params?: Record<string, unknown>): Promise<NativeCallResult | undefined> => {
    return new Promise(resolve => {
      if (JiahuiJSBridge.isReady()) {
        JiahuiJSBridge.call(propertyKey, params, (result: NativeCallResult) => {
          resolve(result)
        })
      } else {
        resolve(undefined)
      }
    })
  }
}

// 通过异步接口返回的数据有固定的格式
export type NativeCallResult = { code: string, message: string, result?: any } | undefined

export type NativeCallResultCallback = (result: NativeCallResult) => void

// APP信息
export interface AppInfo {
  token: string,
  env: string,
  language: string,
  deviceId: string,
  userId: number,
  versionCode: number,
  versionName: string,
  statusBarHeight: number
}

/**
 * 调用原生功能
 * 原生API 列表：http://gitlab.jihint.com/jiahui_app/jiahui_container/-/blob/master/API.md
 */
export abstract class NativeCall {

  // 获取从APP中传来的启动参数
  // 这是同步方法，不需要用到@JsBridge或@JsBridgeAsync这两个装饰器
  static getStartupParams() {
    return JiahuiJSBridge.isReady() ? JiahuiJSBridge.getStartupParams() : undefined
  }

  // 获取应用信息
  // 由于应用信息会经常用到，这里使用了缓存，没有用@JsBridge或@JsBridgeAsync这两个装饰器
  // 参数ignoreCache，用于制定是否需要优先从缓存中获取appInfo，默认值为false，即优先使用缓存中的数据
  static async getAppInfo(ignoreCache: Boolean = false): Promise<AppInfo | undefined> {
    const appInfo = ignoreCache ? undefined : syncStorage.getItem('appInfo')
    if (!appInfo) {
      return new Promise<AppInfo | undefined>(resolve => {
        if (JiahuiJSBridge.isReady()) {
          JiahuiJSBridge.call('getAppInfo', null, (resp: NativeCallResult) => {
            const result = resp?.result as AppInfo
            syncStorage.setItem('appInfo', result)
            resolve(result)
          })
        } else {
          resolve(undefined)
        }
      })
    }
    return appInfo
  }

  // 跳转url
  @JsBridge
  static openUrl(params: { url: string, internal?: boolean, params?: Record<string, unknown> }, callback?: NativeCallResultCallback): void { }

  // 启动APP中的一个页面
  @JsBridge
  static startPage(params: { pageName: string, params?: Record<string, unknown>, waitResult?: boolean }, callback?: NativeCallResultCallback) { }

  // 启动一个H5离线包
  @JsBridge
  static startWebApp(params: { appId: string, path?: string, testUrl?: string, params?: Record<string, unknown> }, callback?: NativeCallResultCallback) { }

  // 设置系统状态栏的颜色模式
  @JsBridge
  static setColor(params: { lightStatusBar?: boolean }, callback?: NativeCallResultCallback) { }

  // 是否能使用某一个接口
  @JsBridgeAsync
  static async canUse(params: { methodName: string }): Promise<NativeCallResult> { return }

  // 关闭当前容器
  @JsBridge
  static close() { }

  // 使用原生打点日志
  @JsBridge
  static log(params: {event: string, result?: string, extra?: Record<string, unknown>}) { }

  // 判读是否登录
  @JsBridgeAsync
  static async login(params?: {}): Promise<NativeCallResult> { return }
}

/**
 * 交互跳转的路由URL
 * 
 */
export const JS_BRIDGE_ROUTE_URL = {
  // 我的报告
  MY_REPORT_PAGE: 'myReportPage',
  // 我的预约
  MY_APPT_PAGE: 'myApptPage',
  // 我的家人
  FAMILY_MANAGER: 'familyManager',
  // 医疗证明
  MEDICAL_CERTIFICATE: 'medicalCertificate',
  // 商保权益 - 离线包(appId: '10000001', testUrl: `https://h5-wechat-dev.jiahui.com/wechat-offline`, path: '/insurance/family' )
  // 自助流调
  SELF_DECLARATION_RN_PAGE: 'selfDeclarationRNPage',
  // 我的评价
  MY_EVALUATE_RN_PAGE: 'myEvaluateRNPage',
  // 调查问卷 - 暂未开放
  // 我的签署 - 暂未开放
  // 电子发票 - 暂未开放
  // 意见反馈
  FEEDBACK_PAGE: 'feedbackPage'
}