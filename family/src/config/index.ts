/**
 * 嘉会业务登录错误码
 */
 export const ERROR_LOGIN_CODE: Record<number, string> = {
	8: "Token为空",
	9: "Token过期,请重新登录",
	10: "Token不正确",
	11: "用户未登录"
}

// axios开发配置
export const CONSOLE_REQUEST_ENABLE = false; // 开启请求参数打印
export const CONSOLE_RESPONSE_ENABLE = false; // 开启响应参数打印
export const CONSOLE_MONITOR_ENABLE = false; // 监控记录打印
export const AXIOS_DEFAULT_CONFIG = {
	timeout: 20000,
	maxContentLength: 2000,
	withCredentials: false,
	headers: {
		"X-Requested-With": "XMLHttpRequest",
		"Access-Control-Allow-Origin": "*",
		'Content-Type': '"application/json; charset=utf-8',
		"Accept-Language": 'en-US'
	}
};
// APP 手动切换配置
export const SERVER_URLS: Record<string, string> = {
  prod: 'https://api.jiahui.com',
  uat: 'http://uat-api.jiahui.com',
  fat: 'http://fat-api.jiahui.com',
  dev: 'http://dev-api.jiahui.com'
}