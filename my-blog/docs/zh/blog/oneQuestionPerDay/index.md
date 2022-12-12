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
const getArray = (arr = []) => {
  const result = arr.reduce((sum, it ) => {
    const item = arr.filter(i => i.pid === it.id);
    if (item.length) {
      it.children = item;
    }
    if (!it.pid) {
      sum.push(item);
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