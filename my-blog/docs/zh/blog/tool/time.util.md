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

## 获取最近一年日期

```javascript
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
      startDate =  replaceFirstItem && i === 0 ? dayjs(new Date(replaceCurrentDate)).format(format) : startDate,
      // 下个月变量
      // 使用一个月的开头的第一天也可以。
      // setMonth不能使用单前时间
      
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

:::tip
  这里有个bug： **setMonth不能使用单前时间的bug**
:::


## 获取时间段的日期
```javascript
  /**
  * 获取某月日历数据
  * @param {Number} year 年份
  * @param {Number} month 月份
  * @returns 返回日历数据
  */
  function getMonthDate(year: number, month: number) {
    const days = []
    const weeks = []
    if (!year || !month) {
      const today = new Date()
      year = today.getFullYear()
      month = today.getMonth() + 1
    }

    // 获取当月第一天
    const firstDay = new Date(year, month - 1, 1)
    // 获取星期几，才好判断排在第几列
    const firstDayWeekDay = firstDay.getDay()

    year = firstDay.getFullYear()
    month = firstDay.getMonth() + 1

    // 获取上月最后一天
    const lastDayOfLastMonth = new Date(year, month - 1, 0)
    const lastDateOfLastMonth = lastDayOfLastMonth.getDate()
    const lastDay = new Date(year, month, 0)
    const lastDate = lastDay.getDate()

    for (let i = 0; i < 7 * 5; i++) {
      const date = i + 1 - firstDayWeekDay
      let thatDay = date
      let thatMonth = month
      let thatDayYear = year

      // 上一月
      if (date <= 0) {
        thatMonth = month - 1
        thatDay = lastDateOfLastMonth + date
      } else if (date > lastDate) {
        // 下一月
        thatMonth = month + 1
        thatDay = thatDay - lastDate
      }
      if (thatMonth === 0) {
        thatDayYear -= 1;
        thatMonth = 12
      }
      if (thatMonth === 13) {
        thatDayYear += 1;
        thatMonth = 1
      }

      const currentDate = new Date(thatDayYear, thatMonth - 1, thatDay)
      const startNow = currentDate.getTime()
      // 第二天0点
      const endNow = startNow + 24 * 60 * 60 * 1000 - 1
      const week = currentDate.getDay()

      const thatDayObject = {
        year: thatDayYear,
        month: thatMonth,
        date,
        thatDay,
        startNow,
        endNow,
        week
      }

      // 分周
      if (i % 7) {
        weeks[weeks.length - 1].push(thatDayObject)
      } else {
        weeks.push([thatDayObject])
      }

      days.push(thatDayObject)
    }

    // 月份Item当前月份开始now
    const startNow = new Date(year, month - 1, 1).getTime();
    const endNow = lastDay.setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1;

    return {
      year,
      month,
      startNow,
      endNow,
      days,
      weeks
    }
  }

  // 获取年月日
  function format(time: number) {
    const dateInstance = new Date(time)

    const year = dateInstance.getFullYear()
    const month = dateInstance.getMonth() + 1
    const date = dateInstance.getDate()
    return { year, month, date }
  }

  /**
  * 获取下一个月日期
  * @param {Number} year 年份
  * @param {Number} month 月份
  * @returns 当前月份
  */
  function getNextMonth(year: number, month: number) {
    let currentYear = year
    let nextMonth = month

    if (nextMonth > 11) {
      nextMonth = 0
      currentYear += 1
    }

    const now = new Date(currentYear, nextMonth, 1).getTime()
    return {
      now,
      year: currentYear,
      month: nextMonth
    }
  }

  /**
  * 递归获取日历数据
  * @param {Number} startTime 当前时间
  * @param {Number} endTime 结束时间
  * @returns 返回日历数据
  */
  const _runCalendar = (calendar: Record<string, any>, startTime: number, endTime: number) => {
    const date = format(startTime)
    const dateGroup = getMonthDate(date.year, date.month)
    const nextMonth = getNextMonth(date.year, date.month)

    calendar.push(dateGroup)

    if (nextMonth.now <= endTime) {
      _runCalendar(calendar, nextMonth.now, endTime)
    }

    return calendar
  }

  /**
  * 获取日历数据
  * @param {Number} startTime 开始时间
  * @param {Number} endTime 结束时间
  * @returns 返回日历数据
  */
  export function getCalendar(startTime: number, endTime: number) {
    return _runCalendar([], startTime, endTime)
  }


  // 获取时间范围内的数组
  const getDays = () => {
    return state.calendar?.reduce((accumulator: any[], currentValue: Record<string, any>) => {
      const { days } = currentValue || {};
      days.forEach((currentValue: any) => {
        const { startNow, date, thatDay } = currentValue;
        if (startNow >= startTime && startNow < endTime && date === thatDay) {
          accumulator.push(currentValue);
        }
      });
      return accumulator;
    }, []);
  };

  // 获取当前年月下的选择项
    const getSelectIndex = (selectDate: number | string) => {
      if (state?.calendar?.length) {
        const currentIndex = state.calendar.findIndex((it: any) => {
          const { days } = it || {};
          const daysIndex = days?.findIndex((day: Day) => {
            // date === thatDay 确定是那个月
            const { startNow, endNow, date, thatDay } = day;
            const currentSelectDate = typeof selectDate === 'number' ? selectDate : dayjs(selectDate).valueOf();
            return startNow <= currentSelectDate && endNow > currentSelectDate && date === thatDay;
          });

          return daysIndex >= 0;
        });

        const swiperCurrentIndex = currentIndex >= 0 ? currentIndex : 0;
        state.selectIndex = swiperCurrentIndex;
      }
    };


    
```