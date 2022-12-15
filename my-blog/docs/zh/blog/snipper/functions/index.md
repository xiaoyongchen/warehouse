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