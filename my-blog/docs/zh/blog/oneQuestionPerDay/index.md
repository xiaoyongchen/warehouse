## 每日一题
### 数组转树形结构
```javascript
 const array = [
  { id: 1, name: "部门1", pid: 0 },
  { id: 2, name: "部门2", pid: 1 },
  { id: 3, name: "部门3", pid: 1 },
  { id: 4, name: "部门4", pid: 3 },
  { id: 5, name: "部门5", pid: 4 },
];
=> 
const result = [
  [
    {
      "id": 2,
      "name": "部门2",
      "pid": 1
    },
    {
      "id": 3,
      "name": "部门3",
      "pid": 1,
      "children": [
        {
          "id": 4,
          "name": "部门4",
          "pid": 3,
          "children": [
            {
              "id": 5,
              "name": "部门5",
              "pid": 4
            }
          ]
        }
      ]
    }
  ]
]

// 这里数组引用
// 原理是因为浅拷贝。
const getArray = (arr = []) => {
  const result = arr.reduce((sum, it ) => {
    const item = arr.filter(i => i.pid === it.id);
    if (item.length) {
      it.children = item;
    }
    if (!it.pid) {
      sum.push(it);
    }
    return sum;
    
  }, []);
  return result;
}

getArray(array);

```

## 数组拷贝

```javascript
  // 数组
  Array.slice(arr);
  [...arr];
  Array.map(it => it);
  Array.from(arr);
  Object.assign([], arr);
  arr.filter(it => it);
  // set 转 Array
  [...new Set(array)];
  // map 转 Array 不过是二维数组
  [...new Map([[1, 'one'], [2, 'two']])];
  // lodash 里面的方法
  // todo...
```

## 排序
需求 const arr = [1, 9, 234, 432, 12, 9, 2, 98, 34] => [1,2,9,9,12,34,98,234,432]
```javascript

// 方案一 reduce 函数, 实际也会这样用。
arr.reduce((pre, current) => pre < current); // cosole.log(arr)

// 方案二 快速排序
const quickySort = (arr = []) => {
  if (!arr.length) {
    return [];
  }
  if (arr.length === 1) {
    return arr;
  }

  const leftList = [];
  const rightList = [];
  const centerIndex = Math.floor(arr.length/2);
  const centerItem = arr.splice(centerIndex, 1);
  arr.forEach(it => {
    if (it < centerItem) {
      leftList.push(it);
    } else {
      rightList.push(it);
    }
  });
  return quickySort(leftList).concat(centerItem, quickySort(rightList));
}

// 方案三 冒泡排序
const bubblingSort = (arr = []) => {
  if (!arr.length) {
    return arr;
  }

  const length = arr.length;
  // 第一级表示多少层数
  for(let i = 0; i < length; i ++) {
    // 第二级交换位置
    for(let j = 0; j < length - i - 1; j ++) {
      // 冒泡的原理，因为水压，越来越小，后面的泡越来越大
      // 前面一个大于后面的，交互位置
      if (arr[j + 1] < arr[j]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

const res = bubblingSort([2, 34, 1, 78, -12]);
console.log(res);

```


## 字符串出现的次数

```typescript
  const getRepeatNum = (str = '') => {
    if (!str) {
      return {};
    }
    const strOrNumber = typeof str === 'number' || typeof str === 'string';
    if (!strOrNumber) {
      return {};
    }
    const strValue = typeof str === 'number' ? str + '' : str;
    const map = {};
    strValue.split('').forEatch(it => {
      // 0, false, null, undefined  -~0 为1、 -～1 为 2
      map[it] = -~map[it];
    })
    return map;
  }
```

## flat实现
你可以使用递归的方式来实现 flat() 方法。下面是一个实现例子：

```typescript
  function(arr) {
    let result = [];
    for(let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i])) {
        result = result.concat(flat(arr[i]))
      } else {
        result.push(arr[i])
      }
    }
    return result;
  }
```

你也可以使用非递归的方式来实现 flat() 方法。下面是另一个例子：

```typescript

  // 方案1
  function(arr) {
    let stack = [...arr];
    let result = [];
    while(stack.length) {
      let current = stack.pop();
      if (Array.isArray(item)) {
        result.push(...current);
      } else {
        result.push(item);
      }
    }
    return result.reverse();
  }
  // 方案2
  const array = [1, [2, [3, 4]],[[[1,2]]]];
  const flatList = (arr = []) {
    while(arr.some(it => Array.isArray(it))) {
      arr = [].concat(...arr));
    }
    return arr;
  }
```


## 微信红包算法。

* 最小金额0.01
* 最大金额200, 个数大于1，最大金额就是一半。
* 平均金额大于0.01

```javascript
  function getWechatRedPacket(totalMoney, totalPeople, random = true) {
  if (!totalMoney) {
    throw new Error("请填写金额");
  }
  if (!totalPeople) {
    throw new Error("请填写人数");
  }
  if (totalMoney > 200) {
    throw new Error("红包金额不能超过200");
  }
  if (totalMoney < 0.01) {
    throw new Error("红包金额不能小于0.01");
  }
  if (totalPeople * 0.01 > totalMoney) {
    throw new Error("单个红包金额不能小于0.01");
  }
  if (totalPeople === 1) {
    return [totalMoney];
  }

  // 平均。
  if (!random) {
    const currentMoney = totalMoney / totalPeople;
    return Array.from({ length: totalPeople }).map(() => Math.round(currentMoney * 100) / 100);
  }

  const minMoney = 0.01;
  let maxMoney;
  let currentMoney;
  let result = [];
  while (totalPeople > 1) {
    maxMoney = totalMoney / 2.0;
    currentMoney = Math.random() * totalMoney;
    currentMoney = currentMoney < minMoney ? 0.01 : currentMoney > maxMoney ? maxMoney : currentMoney;
    // maxMoney = totalMoney * 2.0 / totalPeople;
    // currentMoney = Math.random() * maxMoney;
    // currentMoney = currentMoney < minMoney ? 0.01 : currentMoney
    currentMoney = Math.round(currentMoney * 100) / 100;
    totalMoney -= currentMoney;
    totalPeople--;
    result.push(currentMoney);
  }

  result.push(Math.round(totalMoney * 100) / 100);
  return result;
}

// getWechatRedPacket(0.01, 2);

```

## 防抖和截流

```javascript

// 防抖
function debounce (func, wait) {
  let timer = null;
  return (...args) => {
    // 下个请求在时间段内，直接return
    if (timer) {
      clearTimerout(timer);
      timer = null;
      return;
    }
    timer = setTimeout(() => {
      func.apply(this, args);
      clearTimerout(timer);
      timer = null;
    }, wait);
  }
}

// 节流
function throttle(func, wait) {
  let lastTime = null;
  return (...args) => {
    if (!lastTime) {
      func.apply(this, args);
      lastTime = Date.new();
      return;
    }
    const newTime = Date.new();
    if (newTime - lastTime >= wait) {
      func.apply(this, args);
      lastTime = Date.new();
    }
  }
}

```
:::tip
防抖：在时间段内，只执行一次。
节流：n秒后执行，如果在n秒被重复触发，则重新计时
:::