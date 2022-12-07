/* eslint-disable */
import axios, { AxiosInstance, AxiosResponse } from "axios";
import QueryString from "qs";
import { AppInfo } from "./jsBridgeUtil";
import { PlatformUtil } from "./platformUtil";

const SERVER_URLS: Record<string, string> = {
    'prod': 'https://api.jiahui.com',
    'uat': 'http://Uat-api.jiahui.com',
    'fat': 'http://fat-api.jiahui.com'
}

let axiosInstance: AxiosInstance
export function initAxios(appInfo: AppInfo) {
    axiosInstance = axios.create({
        baseURL: SERVER_URLS[appInfo.env],
        timeout: 5000,
        headers: {
            'token': appInfo.token,
            'lang': appInfo.language,
            'version': appInfo.versionName,
            'terminal': PlatformUtil.osName(),
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
}

function GET(path: string, config?: Record<string, unknown>) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        // 如果config中有配置async为true，返回async方法，其promise中直接返回response的内容
        // 否则直接返回axios的promise对象
        if (config && config["async"] === true) {
            descriptor.value = async (params?: Record<string, unknown>) => {
                return new Promise((resolve, reject) => {
                    axiosInstance?.get(path, { params: params, ...config }).then(response => {
                        if (response.status === 200) {
                            resolve(response.data)
                        } else {
                            console.log(JSON.stringify(response))
                            resolve(undefined)
                        }
                    }).catch(reason => {
                        console.log(JSON.stringify(reason))
                        resolve(undefined)
                    })
                })
            }
        } else {
            descriptor.value = (params?: Record<string, unknown>) => {
                return axiosInstance?.get(path, { params: params, ...config })
            }
        }
    }
}

function POST(path: string, config?: Record<string, unknown>) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        if (config && config["async"] === true) {
            descriptor.value = async (data?: Record<string, unknown>) => {
                return new Promise((resolve, reject) => {
                    axiosInstance?.post(path, data, config).then(response => {
                        if (response.status === 200) {
                            resolve(response.data)
                        } else {
                            console.log(JSON.stringify(response))
                            resolve(undefined)
                        }
                    }).catch(reason => {
                        console.log(JSON.stringify(reason))
                        resolve(undefined)
                    })
                })
            }
        } else {
            descriptor.value = (data?: Record<string, unknown>) => {
                return axiosInstance?.post(path, data, config)
            }
        }
    }
}

function formDataTransformer(data: Record<string, unknown>, headers: Record<string, unknown>) {
    headers["Content-Type"] = "application/x-www-form-urlencoded"
    return QueryString.stringify(data)
}

export interface JiahuiServiceBaseBody<T = any> {
    code: number,
    msg: string,
    language: string,
    st: number
    data: T
}

// 嘉会app和小程序的统一返回值定义，用于直接使用axios promise的情况
export type JiahuiServicePromise<T = any> = Promise<AxiosResponse<JiahuiServiceBaseBody<T>, any>> | undefined

// 嘉会app和小程序的统一返回值定义，用于async await调用方式的情况
export type JHAsyncPromise<T = any> = Promise<JiahuiServiceBaseBody<T> | undefined>

// 用于第三方服务的返回值定义，因为其返回格式不确定
export type AnyServicePromise<T = any> = Promise<AxiosResponse<T>> | undefined

// 用于第三方服务的返回值定义，因为其返回格式不确定，用于async await调用方式的情况
export type AnyAsyncPromise<T = any> = Promise<T | undefined>

/**
 * 嘉会APP的服务的接口定义
 *
 * 每个服务端接口定义可以有1个可选参数：
 * params/data: Record<string, unknown>，参数名主要用于区分是get(params，参数会组装在url后面)还是post(data，参数会放在body中)请求
 *
 * 装饰器可以有两个参数：
 * 1. path: string，必选参数，定义接口的路径
 * 2. config: Record<string, unknown>，可选参数，用于额外的配置，其内容和axios的config相同，详见http://www.axios-js.com/zh-cn/docs/#axios-request-config
 * 3. config中有一个特殊参数：async，类型为boolean，装饰器会处理该参数，如果async为true，装饰器返回对应的async方法
 * 4. POST请求的body格式默认为json，如果需要使用form data格式的body，可以在config中配置{ transformRequest: formDataTransformer }
 * 
 * 例如：
 * @GET("/h5-rest/app/hospitalization/info/isInHospital")
 * static isInHospital(params: { patientCode: string }): JiahuiServicePromise { return }
 *
 * @POST("/some/api", { baseURL: "https://some/domain" })
 * static callSomeApi(data: {key: string}): AnyServicePromise { return }
 *
 * @POST("/some/api", { async: true, baseURL: "https://some/domain", transformRequest: formDataTransformer })
 * static async callSomeApi(data: {key: string}): AnyAsyncPromise<SomeType> { return }
 */
export abstract class JiahuiService {

    @GET("/app-rest/app/user/getUserInfo")
    static getUserInfo(): JiahuiServicePromise { return }

    @GET("/app-rest/app/user/getUserInfo", { async: true })
    static async getUserInfoAsync(): JHAsyncPromise { return }
}
