# 常用正则工具

```javascript
export type RuleType =
  | 'date'
  | 'url'
  | 'hex'
  | 'email'
  | 'mobile'
  | 'idCard'
  | 'address'
  | 'exceptionsCode'
  | 'any';
// 校验规则
export const JHPattern = {
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  url: new RegExp("^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$", 'i'),
  hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i,
  mobile: /^(1)\d{10}$/,
  idCard: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
  exceptionsCode: /[`~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]$/,
};

const Rules: { [key: string]: (value: any) => boolean } = {
  date: (value: Date) => typeof value.getTime === 'function' && typeof value.getMonth === 'function' && typeof value.getFullYear === 'function' && !isNaN(value.getTime()),
  hex: (value: string) => typeof value === 'string' && !!value.match(JHPattern.hex),
  url: (value: string) => typeof value === 'string' && !!value.match(JHPattern.url),
  mobile: (value: string) => typeof value === 'string' && !!value.match(JHPattern.mobile),
  email: (value: string) => typeof value === 'string' && !!value.match(JHPattern.email) && value.length < 255,
  idCard: (value: string) => typeof value === 'string' && !!value.match(JHPattern.idCard),
  address: (value: string) => typeof value === 'string' && value.length > 0,
  exceptionsCode: (value: string) => typeof value === 'string' && !!value.match(JHPattern.exceptionsCode),
};

/**
 * 通用校验规则
 * @param type 校验类型
 * @param value 校验的数据
 * @returns 是否校验通过
 */
const validatorUtil = {
  checkMobile: (value: string) => Rules.mobile(value),
  checkEmail: (value: string) => Rules.email(value),
  checkUrl: (value: string) => Rules.url(value),
  checkDate: (value: Date) => Rules.date(value),
  checkIdCard: (value: string) => Rules.idCard(value),
  checkHex: (value: string) => Rules.hex(value),
  checkAddress: (value: string) => Rules.address(value),
  checkExceptionsCode: (value: string) => Rules.exceptionsCode(value),
};

export default validatorUtil;
```