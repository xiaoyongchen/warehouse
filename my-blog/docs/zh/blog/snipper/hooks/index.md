### 请求Hooks

```javascript
// 请求数据
import { isArray } from 'lodash';
import { Ref, watch, shallowRef, unref, isRef } from 'vue';
/**
 * RequestDepFlag: 参数是否需要依赖值， RequestDeps, 依赖的对象， ReplaceFields: 需要从依赖项替换的的字段，value: 依赖项的字段 { phoneNo: 'phone' }
 * deps: 接口依赖值
 * requiredParmas 必须依赖的变量，有值了才请求数据。
 * params: 接口参数 ReplaceFields: { key: value }, key: 请求参数的key， value: 依赖对象的key
 * options: 其他可选参数refetch: 是否重新加载，showLoading: 是否展示loading, immediate: 是否立即执行
 * requestData: 外部接口请求
 * @name chenxiaoyong
 */
type MaybeRef<T> = T | Ref<T>;
// D 依赖， M 映射关系
type RequestParams<D = false, M = false, P = Record<string, any> | undefined, F = Record<string, string>> = [
  D,
  M,
] extends [true, false]
  ? [P & Record<string, any>]
  : [D, M] extends [true, true]
  ? [P & Record<string, any>, F]
  : P;
type Options = Partial<
  {
    refetch: MaybeRef<boolean | undefined>;
    loading: boolean;
    immediate: boolean;
    delay: number;
  } & Record<string, any>
>;

type RequestOptions<R = any, P = Record<string, any> | undefined, D = false, M = false> = Readonly<{
  deps?: MaybeRef<Record<string, any>>;
  requiredParmasKeys?: string[];
  params?: RequestParams<D, M, P>;
  initialData?: any;
  options?: Options;
  // eslint-disable-next-line no-unused-vars
  requestData: RequestData;
  // eslint-disable-next-line no-unused-vars
  filter?: (arg: R) => R;
}>;

interface RequestData<Arg = any> {
  // eslint-disable-next-line no-unused-vars
  (arg?: Arg, opt?: any): Promise<any | undefined>;
}

export type ResponseReturn<T = any> = [
  data: Ref<T | null>,
  isFirst: Ref<boolean>,
  loading: Ref<boolean>,
  // eslint-disable-next-line no-unused-vars
  execute: <R, P, D = false, M = false>(arg: RequestOptions<R, P, D, M>) => Promise<R>,
];

/**
 * @范型约束参数1：表示结果类型 
 * @范型约束参数2：表示参数是否需要依赖
 * @param requestOptions { deps: 依赖，params: 请求参数， initialData: 初始值可用于测试， options: 拓展参数，requestData：外部接口，filter: 过滤函数 }
 * @例子
 *  const [relatedFamilyList] = useRequest<RelatedFamilyItem[], true>({
 *    requiredParmas 这个依赖值属于deps的子集， 这个有值才能请求数据。
      deps: appInfo,
      params: [{ phoneNo: appInfo.value?.phone || "15639198257" }, true, { phoneNo: "phone" }],
      options: { loading: true },
      initialData: initialData,
      requestData: (arg: any, res: any) => familyAPI.getRelatedFamilyList(arg, res),
    });
 * @returns 
 */
export const useRequest = <RES = any, Params = Record<string, any> | undefined, NEED_DEPS = false, NEED_MAP = false>(
  requestOptions: RequestOptions<RES, Params, NEED_DEPS, NEED_MAP>,
): ResponseReturn<RES> => {
  const { filter } = requestOptions || {};
  const { immediate = true, refetch = false, delay = 0 } = requestOptions.options || {};
  const data = shallowRef<RES | null>(requestOptions?.initialData);
  const loading = shallowRef(false);
  const isFirst = shallowRef(false);

  const execute = async <R, P, D, M>(arg: RequestOptions<R, P, D, M>): Promise<R> => {
    try {
      const { requestData, params, options, deps, requiredParmasKeys } = arg;
      loading.value = true;
      // eslint-disable-next-line no-use-before-define
      const resultParams = await dealRequestParams<R, P, D, M>(params, deps, requiredParmasKeys);
      // 处理数据
      const res = await requestData(resultParams, options);
      data.value = filter ? filter(res?.data) : res?.data;
      isFirst.value = true;
      loading.value = false;
      return res?.data;
    } catch (error) {
      isFirst.value = true;
      loading.value = false;
      data.value = null;
      console.log(error);
      return Promise.reject(error);
    }
  };

  // 监听数据变化
  watch(
    () => [unref(requestOptions.deps), unref(refetch)],
    ([currentDeps, currentRefetch]) => {
      // 监听依赖值变化
      if (currentDeps || currentRefetch) {
        execute<RES, Params, NEED_DEPS, NEED_MAP>(requestOptions);
      }
    },
    { deep: true },
  );

  // 必须参数直接return promise.reject
  // 如果有依赖值，并且参数是必传的话，需要reject处理，取消请求数据
  const dealRequestParams = async <R, P, D, M>(
    requestParams?: RequestParams<D, M, P>,
    deps?: RequestOptions<P, R, D, M>['deps'],
    requiredParmasKeys?: string[],
  ) => {
    if (!isArray(requestParams)) {
      return requestParams || {};
    }

    const [arg, replaceFields = {}] = requestParams;

    const keys = Object.keys(replaceFields || {});
    const depsItem = getCommonObject(deps);

    try {
      // 否则判断大的依赖对象。
      if (depsItem) {
        // 判断依赖项目, 必须参数为空，则不请求数据
        if (isArray(requiredParmasKeys)) {
          if (!checkRequired(depsItem, requiredParmasKeys)) {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject('异步还没有获取到数据');
          }
        }
        // 遍历请求参数，拿到需要替换的key
        Object.keys(arg)?.forEach((key: string) => {
          const replaceFieldsKey = keys.find((i) => i === key);
          // deps的key与参数的key不一致。
          if (replaceFieldsKey) {
            // 获取deps中对应的key, 因为请求参数的key和依赖对象的key可能不同，所以需要映射。
            const replaceFieldsValue = replaceFields[replaceFieldsKey as keyof typeof replaceFields];
            const depsValue = replaceFieldsValue ? getCommonObject(depsItem?.[replaceFieldsValue]) : arg[key];
            arg[key] = depsValue;
            return;
          }
          // 这个value还在依赖对象中, 否则不做处理
          const value = getCommonObject(depsItem?.[key as keyof typeof depsItem]);
          if (value) {
            arg[key] = value;
          }
        });

        return arg;
      }
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('异步还没有获取到数据');
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const checkRequired = (obj: Record<string, any>, keys: string[]) => {
    if (!obj) {
      return false;
    }
    const list = Object.keys(obj);
    if (!list.length) {
      return false;
    }
    return list.every((it) => {
      const item = obj[it];
      const flag = keys.find((key) => key === it);
      if (flag) {
        return !!item;
      }
      return true;
    });
  };

  // tip: 这里不支持，外部是普通的对象，里面是响应对象
  const getCommonObject = (obj: any) => {
    if (isRef(obj)) {
      return obj.value;
    }
    return obj;
  };

  if (immediate) {
    setTimeout(() => {
      execute<RES, Params, NEED_DEPS, NEED_MAP>(requestOptions);
    }, delay);
  }

  return [data, isFirst, loading, execute];
};

```

## transformAsync 

```javascript
  type Success<T = any> = T extends { success?: (...arg: any) => void }
    ? NonNullable<T['success']> extends (...arg: any) => void
    ? Parameters<NonNullable<T['success']>>[0]
    : never
    : never;
  type Fail<T = any> = T extends { fail?: (...arg: any) => void }
    ? NonNullable<T['fail']> extends (...arg: any) => void
    ? Parameters<NonNullable<T['fail']>>[0]
    : never
    : never;

  export const transformAsync = async <T>(options: T, func: (arg: T) => void): Promise<Success<T>> => {
    return new Promise((resolve, reject) => {
      try {
        func({
          ...options,
          success: (res: Success<T>) => resolve(res),
          fail: (e: Fail<T>) => reject(e),
        });
      } catch (error) {
        reject(error);
      }
    });
  };
```

### PayType

```javascript
  type PayType = 'alipay' | 'wechat';
  export const paySuccessHandle = async (params: { payType: PayType; generateInfo: string | Record<string, any> }) => {
    if (!params.generateInfo) {
      return Promise.reject('generateInfo参数错误');
    }
    try {
      if (params.payType === 'alipay') {
        type Params = NonNullable<Parameters<typeof JhBridge.aliPay>[0]>;
        const res = await transformAsync<Params>({ orderStr: params.generateInfo as Params['orderStr'] }, JhBridge.aliPay);
        const msg = res.memo;
        // 这个接口定义错误了，历史原因就只能用any
        const data = res.result as unknown as string;
        const result = JSON.parse(data);
        if (result?.alipay_trade_app_pay_response.code === '10000') {
          return true;
        }
        return Promise.reject(msg)
      }
      type Params = NonNullable<Parameters<typeof JhBridge.wechatPay>[0]>;
      // partnerid prepayid noncestr timestamp package sign
      const res = await transformAsync<Params>(params.generateInfo as Params, JhBridge.wechatPay);
      if (res.errCode === 0) {
        return true;
      }
      return Promise.reject(res?.errStr)
    } catch (error: any) {
      return Promise.reject(error?.message ? error?.message : error)
    }
  }
```

### 获取日期

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

### useTableRequest

```javascript
// 请求数据
import { isFunction, cloneDeep } from 'lodash'
import { shallowRef, ref } from '@vue/composition-api'

// form 必须要制定对应的key，要不然不响应
export const useRequestTable = (requestOptions) => {
  const {
    initialPagination = { current: 1, total: 0, size: 10 },
    initialForm = {}, filter, requestData, options, initialData = [],
    requestBefore
  } = requestOptions || {}
  const { immediate = true, delay = 0, removeKeyWithEmpty = false } = options || {}
  const data = shallowRef(cloneDeep(initialData))
  const pagination = ref(cloneDeep(initialPagination))
  const form = ref(cloneDeep(initialForm))
  const loading = shallowRef(false)
  const isFirst = shallowRef(false)

  const submit = async () => {
    try {
      loading.value = true
      // eslint-disable-next-line no-use-before-define
      const resultParams = await getRequestParams()
      // 处理数据
      const res = await requestData(resultParams, options)
      if (res?.code === 0 && res?.data) {
        const { records = [], ...other } = res?.data || {}
        data.value = filter ? filter(records) : records
        // 这里只需要total就行了，his的接口不规范，size是当前数据条数，很无语
        pagination.value = { ...pagination.value, total: other?.total }
      }
      isFirst.value = true
      loading.value = false
      return res?.data
    } catch (error) {
      isFirst.value = true
      loading.value = false
      data.value = null
      console.log(error)
      return Promise.reject(error)
    }
  }

  const getRequestParams = async () => {
    try {
      let requestArg = { ...pagination.value, ...form.value } || {}
      if (isFunction(requestBefore)) {
        requestArg = requestBefore(requestArg)
      }

      // 是否过滤空值, 空值
      if (removeKeyWithEmpty) {
        const result = {}
        // 这里不用
        Object.keys(requestArg).filter(key => {
          const element = requestArg?.[key]
          if (!element && element !== 0) {
            return true
          }
          result[key] = element
          return true
        })

        requestArg = result
      }

      return requestArg
    } catch (error) {
      console.log(error)
      return {}
    }
  }

  // 切换分页大小, current重置
  const changeSize = (size) => {
    pagination.value = { ...pagination.value, size, current: 1 }
    submit()
  }

  // 切换分页
  const changePage = (current) => {
    // current 是否需要计算。
    pagination.value = { ...pagination.value, current }
    submit()
  }

  // 删除某条记录，是否需要定位到单前页面？？？
  const deleteRecord = () => {
    if (pagination.value.current === 1) {
      submit()
      return
    }
    // page - 1
    if (pagination.value.current > 1 && data.value?.length === 1) {
      pagination.value = { ...pagination.value, size: pagination.value.size - 1 }
      submit()
      return
    }
    submit()
  }

  const search = () => {
    pagination.value = { ...pagination.value, current: 1 }
    submit()
  }

  const reset = () => {
    pagination.value = { ...pagination.value, current: 1 }
    form.value = cloneDeep(initialForm)
    submit()
  }

  // 外部调用的接口
  const callback = (eventName, res = null) => {
    const func = {
      search: search,
      reset: reset,
      changePage: changePage,
      changeSize: changeSize,
      deleteRecord: deleteRecord
    }
    if (func[eventName]) {
      func[eventName](res)
    }
  }

  if (immediate) {
    setTimeout(() => {
      submit()
    }, delay)
  }

  return [data, form, pagination, callback, loading, isFirst, submit]
}

```

### 导出excel模版

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