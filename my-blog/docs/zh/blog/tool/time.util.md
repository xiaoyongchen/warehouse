# 时间工具

## 时间格式化

```
  /**
   * 时间转换 dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')
   * @param dateTime
   * @param fmt
   * @returns {*|string}
   */
  static dateFormat(dateTime, fmt) {
    let date = new Date(dateTime);
    fmt = fmt || 'yyyy-MM-dd';
    let o = {
      'M+': date.getMonth() + 1, //月份
      'd+': date.getDate(), //日
      'h+': date.getHours(), //小时
      'm+': date.getMinutes(), //分
      's+': date.getSeconds(), //秒
      'q+': Math.floor((date.getMonth() + 3) / 3), //季度
      S: date.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      }
    }
    return fmt;
  }

```

## 获取下个月

```typescript
/**
 * 获取接下来多少月的日期数组
 * @param date 
 * @returns 
 */
export type ReturnDateType = { year: string, month: string, monthName: string, day: string, date: string, [PropsName: string]: any };
export function getNextMonths(isZh: boolean, num = 11): ReturnDateType[] {
  if (num < 1) {
    return []
  }

  const dataArr = []
  const data = new Date()
  data.setMonth(data.getMonth(), 1)
  for (let i = 0; i < num; i++) {
    data.setMonth(data.getMonth() + 1);//每次循环一次 月份值减1
    let m: number | string = data.getMonth() + 1
    m = m < 10 ? "0" + m : m
    dataArr.push(data.getFullYear() + "-" + (m))
  }
  const monthNameObject = {
    ['01']: isZh ? '1月' : 'Jan',
    ['02']: isZh ? '2月' : 'Feb',
    ['03']: isZh ? '3月' : 'Mar',
    ['04']: isZh ? '4月' : 'Apr',
    ['05']: isZh ? '5月' : 'Mar',
    ['06']: isZh ? '6月' : 'Jun',
    ['07']: isZh ? '7月' : 'July',
    ['08']: isZh ? '8月' : 'Aug',
    ['09']: isZh ? '9月' : 'Sep',
    ['10']: isZh ? '10月' : 'Oct',
    ['11']: isZh ? '11月' : 'Nov',
    ['12']: isZh ? '12月' : 'Dec',
  }
  return dataArr.map(it => {
    const [year, month, day = '01'] = it?.split('-')
    return { year, month, monthName: monthNameObject[month as keyof typeof monthNameObject], day, date: year + '-' + month + '-' + day }
  })
}

```