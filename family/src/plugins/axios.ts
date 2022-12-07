import axios, { AxiosInstance } from "axios";
import { requestFailFunc, requestSuccessFunc, responseFailFunc, responseSuccessFunc } from "@/interceptors/axios";
import { AXIOS_DEFAULT_CONFIG, SERVER_URLS } from '@/config';
import { PlatformUtil } from "@/utils/platformUtil";
import qs from 'qs';
import syncStorage from "@/storage";

let axiosInstance: AxiosInstance;

export function initAxios(config?: Record<string, any>): AxiosInstance | null {
  return setAxiosConfig(config);
}

function getAxiosInstance(): AxiosInstance | null {
  if (!axiosInstance) {
    const config = syncStorage.getItem('appInfo');
    return setAxiosConfig(config);
  }
  return axiosInstance;
}


function setAxiosConfig(config?: Record<string, any>): AxiosInstance | null {
  if (!config) {
    return null;
  }
  const axiosInstance = axios.create(
    {
      ...AXIOS_DEFAULT_CONFIG,
      baseURL: SERVER_URLS[config?.env],
      headers: {
        token: config?.token,
        lang: config?.language,
        version: config?.versionName,
        terminal: PlatformUtil.osName(),
      }
    })
  axiosInstance.interceptors.request.use(requestSuccessFunc, requestFailFunc);
  axiosInstance.interceptors.response.use(responseSuccessFunc, responseFailFunc);
  return axiosInstance;
}

export default function request(config: JHRequest): Promise<JHResponse['data']> | undefined {
  let { url } = config;
  // 首字符应该为“/”
  if (typeof url === 'string' && !/^\//.test(url)) {
    url = '/' + url;
  }

  const axiosConfig = _normalize(config);
  const axios = getAxiosInstance();
  return axios?.(axiosConfig);
}

/**
 * 标准化axios config 参数
 * @param options 接口请求基本配置 {Object}
 * @param data
 * @private
 */
function _normalize(config: JHRequest): JHRequest {
  const { data, params, method } = config;
  const _data = { ...params, ...data } ?? {};
  const _method = method?.toLowerCase();
  if (_method === "post" || _method === "patch" || _method === "put") {
    // 是否序列化，看后端配置
    config.data = qs.stringify(_data);
    // 如果配置是application/json
    if (config?.contentType === 'application/json') {
      config.data = _data;
    }
  } else {
    config.params = _data;
  }
  return config;
}

