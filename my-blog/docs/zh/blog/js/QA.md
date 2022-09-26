## 常见js问题

### cloneDeep 深度克隆的注意事项

:::tip
  在对对象进行深度克隆的时候，注意重复问题。
  const form = ref(cloneDeep(initialForm))
  // tip这里调用也要深度克隆，否则引用又问题。
  const reset = () => {

    form.value = cloneDeep(initialForm)
  }
:::

### Array sort bug

```bash
  [3, 5, 9, 10, 8, 1, -11].sort();
  # [-11, 1, 10, 3, 5, 8, 9]

  [3, 5, 9, 10, 8, 1, -11].sort((a, b) => a-b);
  # [-11, 1, 3, 5, 8, 9, 10]

```
:::tip

  sort不加比较函数的时候，是通过toString来比较的，字符串来比较的时候可能不准确。
  低版本可能有bug，不按照原样返回
  [3, 5, 9, 10, 8, 1, -11].sort(() => 0);
  
:::

### hasOwnProperty 使用注意事项

* 直接使用hasOwnProperty的缺陷

  ```bash
    const bar = {
      hasOwnProperty: () => false,
      bar: 'bar'
    }
    # 直接使用bar.hasOwnProperty('bar') 永远返回false
    # 正确用户如下
    {}.hasOwnProperty.call(bar, 'bar'); 
    # bar
  ```
* 使用for in 
  ```bash
    Object.prototype.bar = 1;
    var foo = { index: 1 };
    for(const i in foo ) {
      console.log(i); 
      # error
    }
    # bar index 
    # 正确的处理
    for(const i in foo) {
      if(foo.hasOwnProperty(i)) {
        console.log(i);
      }
    }
    # index ok
  ```