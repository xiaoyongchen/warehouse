# 实际用到的工具函数


## 导出excel模版

```javascript
  # 第一种
  const XLSX = require('xlsx')
  /*
      * 导出 excel 文件
      * @param array JSON 数组
      * @param sheetName 第一张表名
      * @param fileName 文件名
  */
  export function downloadSheetTemplate (array, sheetName = '表1', fileName = 'example.xlsx') {
    const jsonWorkSheet = XLSX.utils.json_to_sheet(array)
    const workBook = {
      SheetNames: [sheetName],
      Sheets: {
        [sheetName]: jsonWorkSheet
      }
    }
    return XLSX.writeFile(workBook, fileName)
  }

  # 使用
  const template = [{ 姓名: '', 手机号: '', MRN: '' }]
    downloadSheetTemplate(template, '企业成员列表模版', '企业成员列表模版.xlsx')

```

## 导出excel
```javascript
  const exportSheet = async (url = '', data = {}) => {
    try {
      const apiService = axios.create({
        headers: {
          post: { 'Content-Type': 'application/octet-stream;charset=UTF-8' }
        },
        responseType: 'arraybuffer',
        baseURL: process.env.VUE_APP_BASE_API_2
      })
      const res = await apiService.post(url, data, { params: removeEmptyValue({ ...getCommonParams() }) })
      if (res.status === 200) {
        return res.data
      }
      return Promise.reject(res)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const download = (data, fileName = '') => {
    if (!data) {
      return
    }
    const url = window.URL.createObjectURL(new Blob([data]))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', `${fileName}.xlsx`)
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(link.href) // 释放URL 对象
    document.body.removeChild(link)
    link = null
  }

  # 使用
  exportWithCorrection: async (params) => {
      try {
        const data = await exportSheet('/report/finance/report/verificationRecordExport', params)
        download(data, '线上核销表')
      } catch (error) {
        console.log(error)
      }
    }

  // 第二种方式


  export function open (url) {
    var a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('target', '_blank')
    a.setAttribute('id', 'd2admin-link-temp')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(document.getElementById('d2admin-link-temp'))
  }

  # 使用params 中需要拼接token信息
  open(url + QS.stringfy(params));

```


## 获取日期

```javascript
  /**
   *
   * @param isZh 是否中文环境
   * @param num 数组长度
   * @returns
   */
  export function getNextMonths(
    isZh: boolean,
    currentDate: Date | string = new Date(),
    replaceFirstItem = false,
    ArrayLength = 12,
    format = 'YYYY-MM-DD',
  ): ReturnDateType[] {
    if (ArrayLength < 1) {
      return [];
    }

    const monthNameObject = {
      '01': isZh ? '1月' : 'Jan',
      '02': isZh ? '2月' : 'Feb',
      '03': isZh ? '3月' : 'Mar',
      '04': isZh ? '4月' : 'Apr',
      '05': isZh ? '5月' : 'Mar',
      '06': isZh ? '6月' : 'Jun',
      '07': isZh ? '7月' : 'July',
      '08': isZh ? '8月' : 'Aug',
      '09': isZh ? '9月' : 'Sep',
      '10': isZh ? '10月' : 'Oct',
      '11': isZh ? '11月' : 'Nov',
      '12': isZh ? '12月' : 'Dec',
    };

    const dateArr = [];
    const currentDateDay = dayjs(currentDate).startOf('day');
    const today = dayjs().startOf('day');
    const isBefore = currentDateDay.isBefore(today);
    const replaceCurrentDate = isBefore && replaceFirstItem ? new Date() : currentDate;
    let time: any = new Date(replaceCurrentDate);
    for (let i = 0; i < ArrayLength; i++) {
      // 计算单前时间
      const nowYear = time.getFullYear();
      const nowMonth = time.getMonth();
      const firstDay = new Date(nowYear, nowMonth, 1); // 本月开始时间
      const lastDay = new Date(nowYear, nowMonth + 1, 0); // 本月结束时间
      let startDate = dayjs(firstDay).format(format);
      const month = dayjs(firstDay).format('MM');
      const monthName = monthNameObject[month as keyof typeof monthNameObject];
      const endDate = dayjs(lastDay).format(format);
      startDate = replaceFirstItem && i === 0 ? dayjs(new Date(replaceCurrentDate)).format(format) : startDate,
        // 下个月变量
        time = new Date(dayjs(startDate).add(1, 'month').valueOf());
      dateArr.push({
        endDate,
        monthName,
        year: nowYear,
        startDate,
      });
    }

    return dateArr;
  }
```

## 金额保留2位小数

```javascript

 /**
   *
   * @param num
   * @param round 是否四舍五入。
   * @param placeholder
   */
  const getTwoDecimalPlaces = (num: any, round = false, placeholder = "0.00"): string | number => {
    if (num === 0) {
      return placeholder;
    }
    // 过滤掉NaN, null, undefiled
    if (!num) {
      return placeholder;
    }
    // 过滤数组，对象等数据
    const strOrNum = typeof num === "number" || typeof num === "string";
    if (!strOrNum) {
      return placeholder;
    }
    // 判断是否有小数点。
    const numValue = typeof num === "string" ? parseFloat(num) : num;
    const result = Math.floor(numValue * 100) / 100;
    const resultRound = Math.round(numValue * 100) / 100;
    const returnResult = (e: number) => {
      const [first, second = ""] = (e + "").split(".");
      if (!second.length) {
        return first + ".00";
      }
      if (second.length === 1) {
        return e + "0";
      }
      return e;
    };
    if (round) {
      return returnResult(resultRound);
    }
    return returnResult(result);
  };
```

## 移动端textarea自动撑开
```typescript
 // 使用 resizeTextarea(inputRef.value);
  export type ScrollElement = Element | Window;

  export function resizeTextarea(input: HTMLInputElement) {
    const scrollTop = getRootScrollTop();
    input.style.height = 'auto';

    const height = input.scrollHeight;
    if (height) {
      input.style.height = `${height}px`;
      // https://github.com/youzan/vant/issues/9178
      setRootScrollTop(scrollTop);
    }
  }

  export function setScrollTop(el: ScrollElement, value: number) {
    if ('scrollTop' in el) {
      el.scrollTop = value;
    } else {
      el.scrollTo(el.scrollX, value);
    }
  }

  export function getRootScrollTop(): number {
    return (
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0
    );
  }

  export function setRootScrollTop(value: number) {
    setScrollTop(window, value);
    setScrollTop(document.body, value);
  }

```

## 脱敏处理

```typescript
/**
 * @param val 手机号
 * @returns 得到脱敏的手机号
 * @position 脱敏的位置,默认脱敏中间位置 start | center | end
 */
type Position = 'start' | 'center' | 'end';
export function desensitizationWithMobile(val: string, position: Position = 'center') {
  if (typeof val !== 'string' || !val) {
    return '';
  }
  // 判断length
  if (position === 'start' && val.length > 5 && val.length < 11) {
    const patter = /^\S*(\S{5})/;
    const len = val.length - 5;
    const replaceString = '*'.repeat(len);
    return val.replace(patter, `${replaceString}$1`);
  }
  if (position === 'start' && val.length >= 11) {
    const patter = /^\S*(\S{7})/;
    const len = val.length - 7;
    const replaceString = '*'.repeat(len);
    return val.replace(patter, `${replaceString}$1`);
  }
  // 判断length
  if (position === 'center' && val.length > 5 && val.length < 11) {
    const patter = /(^\S{2})\S*(\S{3})/;
    const len = val.length - 5;
    const replaceString = '*'.repeat(len);
    return val.replace(patter, `$1${replaceString}$2`);
  }
  if (position === 'center' && val.length >= 11) {
    const patter = /(^\S{3})\S*(\S{4})/;
    const len = val.length - 7;
    const replaceString = '*'.repeat(len);
    return val.replace(patter, `$1${replaceString}$2`);
  }

  // 判断length
  if (position === 'end' && val.length > 5 && val.length < 11) {
    const patter = /(^\S{5})\S*/;
    const len = val.length - 5;
    const replaceString = '*'.repeat(len);
    return val.replace(patter, `$1${replaceString}`);
  }
  if (position === 'end' && val.length >= 11) {
    const patter = /(^\S{7})\S*/;
    const len = val.length - 7;
    const replaceString = '*'.repeat(len);
    return val.replace(patter, `$1${replaceString}`);
  }
  return val;
}
```

## web复制文本

```typescript
export const copyTextToClipboard = async (text?: string | null): Promise<void> => {
  try {
    const clipboard = navigator.clipboard
    if (text && clipboard) {
      await clipboard.writeText(text)
      return Promise.resolve()
    }
    return Promise.reject()
  } catch (error) {
    return Promise.reject()
  }
}
```

## vue3 全局eventBus
```typescript
  import mitt from "mitt";

  const bus: any = {}
  const emitter = mitt()

  bus.$on = emitter.on
  bus.$off = emitter.off
  bus.$emit = emitter.emit

  export default bus
```

## 阅读量转换
```javascript
  const changeUnitWithClickCount = (number = 0) => {
      if (!number) {
        return 0;
      }
      if (typeof number !== 'number') {
        return number;
      }

      if (number < 10000) {
        return number;
      }

      let count = number / 10000.0;
      return parseFloat(count.toFixed(2)) + 'w';
    }
  }
```

## 拼接url
```javascript
const urlByAppendingParams = (url = '', params) => {
  let result = url;

  if (!params || !Object.entries(params)?.length) {
    return result;
  }

  result = result?.endsWith('?') ? result : result + '?';

  return (
    result +
    Object.entries(params).reduce((pre, current, index, array) => {
      const [key, value] = current;
      let str = '';
      if (typeof value === 'object') {
        str = `${key}=${JSON.stringify(value)}`;
      } else {
        str = `${key}=${value}`;
      }
      if (index === array.length - 1) {
        return pre + str;
      } else {
        return pre + str + '&';
      }
    }, '')
  );
}
```

## 规则校验

```typescript
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

## 移动端屏幕适配


## 
