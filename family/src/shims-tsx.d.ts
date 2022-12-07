import Vue, { VNode } from "vue";
import { AxiosRequestConfig, AxiosResponse } from 'axios';

declare global {

  interface JHRequest extends AxiosRequestConfig<any> {
    url: AxiosRequestConfig['url'];
    method: AxiosRequestConfig['method'];
    // 常见的媒体格式
    contentType?: 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'application/octet-stream';
    showLoading?: boolean;

  }

  interface JHResponse<T = any> extends AxiosResponse {
    data: { code?: number, lang?: string, msg?: string, data?: T };
  }
}