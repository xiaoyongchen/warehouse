import i18n from "@/locales/i18n";
import { NativeCall } from "@/utils/jsBridgeUtil";
import { Toast } from "vant";
import { CONSOLE_REQUEST_ENABLE, CONSOLE_RESPONSE_ENABLE, ERROR_LOGIN_CODE } from '@/config';

// (value: V) => T | Promise<T>
export function requestSuccessFunc(requestConfig: any): JHRequest | Promise<JHRequest> {
	// showLoading在自定义属性，还可以设置其他参数设置
	const { showLoading = true } = requestConfig as JHRequest;
	showLoading && Toast.loading({
		message: i18n?.global?.t('i18n_loading_02') || 'loading',
		duration: 0
	});

	CONSOLE_REQUEST_ENABLE &&
		console.log(
			"color: #f00; requestInterceptorFunc",
			`url: ${requestConfig?.url}`,
			requestConfig?.method
		);
	return requestConfig;
}

export function requestFailFunc(requestError: JHRequest) {
	Toast.clear();
	CONSOLE_REQUEST_ENABLE && console.info("requestInterceptorFunc", `url: ${requestError.url}`, requestError);
	return Promise.reject(requestError);
}

export function responseSuccessFunc(responseObj: JHResponse) {
	CONSOLE_RESPONSE_ENABLE && console.info("响应返回成功", `url: ${responseObj.config.url}`, responseObj);
	Toast.clear();

	// 系统报错
	if (responseObj.status !== 200) {
		responseObj?.statusText && Toast(responseObj?.statusText);
		return Promise.reject(responseObj.data);
	}

	// 业务报错
	if (responseObj.data.code !== 0) {
		responseObj.data?.msg && Toast(responseObj.data?.msg);
		// token异常需要重定向
		if (typeof responseObj?.data?.code === 'number' && ERROR_LOGIN_CODE[responseObj?.data?.code]) {
			NativeCall.login()
			return Promise.reject(responseObj.data);
		}

		return Promise.reject(responseObj.data);
	}

	return responseObj.data;
}

export function responseFailFunc(responseError: JHResponse) {
	// 响应失败，可根据 responseError.data?.msg || responseError.statusText 来做监控处理
	responseError.data?.msg || responseError.statusText && Toast({
		message: responseError.data?.msg || responseError.statusText
	});

	// const { status } = responseError.response;
	// const responseObj = responseError.response;
	// const resData = responseObj.data;
	// if (status === 404) {
	// 是否需要有个错误路由页面
	// window.GLOBAL.vbus.$emit('router', {
	//   name: '404'
	// });
	// }

	return Promise.reject(responseError);
}
