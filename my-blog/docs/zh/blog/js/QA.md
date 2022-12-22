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


  ## eval Function区别

  ```javascript
    var a = 'global scope'
    function b(){
         var a = 'local scope'
         eval('console.log(a)') //local scope
         ;(new Function('','console.log(a)'))() //global scope
    }
    b()
  ```
:::tip
都可以动态解析和执行字符串。但是它们对解析内容的运行环境判定不同。
eval中的代码执行时的作用域为当前作用域。它可以访问到函数中的局部变量。
new Function中的代码执行时的作用域为全局作用域，不论它的在哪个地方调用的。所以它访问的是全局变量a。它根本无法访问b函数内的局部变量。
:::

## if else block块中不要使用函数声明

```javascript
// 千万别这样做！
// 因为有的浏览器会返回first的这个function，而有的浏览器返回的却是第二个

if (true) {
  function foo() {
    return 'first';
  }
} else {
  function foo() {
    return 'second';
  }
}
foo();

// 解决方式使用函数表达式来解决

let foo = null;
if (true) {
  foo = function foo() {
    return 'first';
  }
} else {
  foo = function foo() {
    return 'second';
  }
}
foo();
```