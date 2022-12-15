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

## falt实现

```typescript
  const array = [1, [2, [3, 4]],[[[1,2]]]];
  const flatList = (arr = []) {
    while(arr.some(it => Array.isArray(it))) {
      arr = [].concat(...arr));
    }
    return arr;
  }
```