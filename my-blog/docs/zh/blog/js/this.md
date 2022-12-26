## this

### 执行上下文栈

![image](https://box.kancloud.cn/2015-07-15_55a601412a346.png)

* 当一段程序开始，会先进入全局执行上下文【global execution context】。
* 初始化对象【objects】【functions】，可能会激活一些其他方法，进入其他方法的上下文，然后将新的元素压入堆栈。
* 执行完后推栈。

### 执行上下文组成

![image](https://box.kancloud.cn/2015-07-15_55a601471db6c.png)

* 所需要的属性(变量对象(variable object)，this指针(this value)，作用域链(scope chain) )
* 变量对象(variable object) 是与执行上下文相关的 数据作用域(scope of data) ,用于存储定义在上下文中的变量和函数声明。


  变量对象
  * 变量对象，不同的上下文中，它表示不同的object，在全局上下文中，变量对象也是全局变量对象【global object】
  * 函数内部创建的变量和内部函数，不会污染全局对象。使用eval的时候，我们会同样使用新的【eval创建】执行上下文。

    ```js
    var foo = 10;

    function bar() {} // // 函数声明
    (function baz() {}); // 函数表达式

    console.log(
      this.foo == foo, // true
      window.bar == bar // true
    );

    console.log(baz); // 引用错误，baz没有被定义
    ```
    ![image](https://box.kancloud.cn/2015-07-15_55a60148097ac.png)

  
  活动对象

  * 当函数被调用者激活，[activation object]就被创建了，
  * 它包含普通参数（formal parameters）和特殊参数（arguments）对象。

    ```js
    function foo(x, y) {
      var z = 30;
      function bar() {} // 函数声明
      (function baz() {}); // 函数表达式
    }

    foo(10, 20);
    ```
    ![image](https://box.kancloud.cn/2015-07-15_55a601487675f.png)


  作用域链

  * 我们在js中会使用内部函数，在内部函数会使用到父函数变量，或者全局变量，我们把这些变量对象成为上下文作用域对象[scope object of the context]. 类似于上面讨论的原型链[prototype chain]。
  * 当内部函数在自身函数体内，需要引用一个变量，这个变量不在函数内部声明或者不是某个参数名。我们称呼这个函数为自由变量。我们搜索这个自由变量就需要作用域链。
  * 一般情况作用域链，包含并不完全只有，父级变量（variable object）、函数自身变量、活动对象（activation object）还会产生一些临时的作用域对象。如catch（导致作用域变更）、with。

  ```js
  var x = 10;

  (function foo() {
    var y = 20;
    (function bar() {
      var z = 30;
      // "x"和"y"是自由变量
      // 会在作用域链的下一个对象中找到（函数”bar”的互动对象之后）
      console.log(x + y + z);
    })();
  })();
  ```
  ![image](https://box.kancloud.cn/2015-07-15_55a60148deaf8.png)

  * with 改变作用域
  * __parent__之前，首先会去__proto__的链接中。

```js
  Object.prototype.x = 10;

  var w = 20;
  var y = 30;

  // 在SpiderMonkey全局对象里
  // 例如，全局上下文的变量对象是从"Object.prototype"继承到的
  // 所以我们可以得到“没有声明的全局变量”
  // 因为可以从原型链中获取
   
  console.log(x); // 10
   
  (function foo() {

    // "foo" 是局部变量
    var w = 40;
    var x = 100;

    // "x" 可以从"Object.prototype"得到，注意值是10哦
    // 因为{z: 50}是从它那里继承的
   
    with ({z: 50}) {
      console.log(w, x, y , z); // 40, 10, 30, 50
    }

    // 在"with"对象从作用域链删除之后
    // x又可以从foo的上下文中得到了，注意这次值又回到了100哦
    // "w" 也是局部变量
    console.log(x, w); // 100, 40
   
    // 在浏览器里
    // 我们可以通过如下语句来得到全局的w值
    console.log(window.w); // 20
   
  })();

```
![image](https://box.kancloud.cn/2015-07-15_55a6014a87a6e.png)

闭包 
  * 闭包作用域包含活动对象 + [[Scope]]
  * Scope会共享变量。

  ```js
  // 全局变量 "x"
  var x = 10;

  // 全局function
  function foo() {
    console.log(x);
  }

  (function (funArg) {

    // 局部变量 "x"
    var x = 20;

    // 这不会有歧义
    // 因为我们使用"foo"函数的[[Scope]]里保存的全局变量"x",
    // 并不是caller作用域的"x"
   
    funArg(); // 10, 而不是20
   
  })(foo); // 将foo作为一个"funarg"传递下去

  ```
:::tip
foo可以看成全局global的一个闭包。所以它的scope中存的是 10；
this指向window
:::


this
  * this是执行上下文环境的一个属性，而不是某个变量对象的属性。
  * this值直接从上下文获取，而不会从作用域链中搜寻。只取决于执行上下文的情况。

全局上下文中

  * this为变量本身
    ```js
    var x = 10;
    console.log(
      x, // 10
      this.x, // 10
      window.x // 10
    );
    ```

函数上下文中[function context]
  * this每次调用会成为不同的值，this会有每次caller提供，caller是通过调用表达式[call expression]产生的（也就是这个函数如何被激活调用的）

    ```js
    // "foo"函数里的alert没有改变
    // 但每次激活调用的时候this是不同的
     
    function foo() {
      alert(this);
    }

    // caller 激活 "foo"这个callee，
    // 并且提供"this"给这个 callee
     
    foo(); // 全局对象
    foo.prototype.constructor(); // foo.prototype
     
    var bar = {
      baz: foo
    };

    bar.baz(); // bar
     
    (bar.baz)(); // also bar
    // 哲理的caller为window
    (bar.baz = bar.baz)(); // 这是一个全局对象
    (bar.baz, bar.baz)(); // 也是全局对象
    (false || bar.baz)(); // 也是全局对象
     
    var otherFoo = bar.baz;
    otherFoo(); // 还是全局对象
    ```



    ```js
    var foo = {x: 10};

    var bar = {
      x: 20,
      test: function () {

        alert(this === bar); // true
        alert(this.x); // 20
     
        this = foo; // 错误，任何时候不能改变this的值
     
        alert(this.x); // 如果不出错的话，应该是10，而不是20
     
      }

    };

    // 在进入上下文的时候
    // this被当成bar对象
    // determined as "bar" object; why so - will
    // be discussed below in detail
     
    bar.test(); // true, 20
     
    foo.test = bar.test;

    // 不过，这里this为foo
     
    foo.test(); // false, 10


    // 例2 
    var foo = {
      bar: function () {
        alert(this);
        alert(this === foo);
      }
    };

    foo.bar(); // foo, true
     
    var exampleFunc = foo.bar;

    alert(exampleFunc === foo.bar); // true
     
    // 再一次，同一个function的不同的调用表达式，this是不同的
     
    exampleFunc(); // global, false
    ```

    :::tip
    例2: 可以看作赋值到一个全局的函数，直接调用全局的函数时，this === global
    :::
