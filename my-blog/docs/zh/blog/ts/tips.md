# typescript 使用注意点
## unknown替代any

+ 都可以转任何类型，同时保留静态检查能力。
+ 但是在静态编译的时候unknown不能调用任何方法
  * 场景一：
  
  ```
    const num: number = 10;
    (num as unknown as string).split('');  	// 注意，这里和any一样完全可以通过静态检查

  ```

    * 场景二：
  
  ```
  
    function test(input: unknown): number {
      if (Array.isArray(input)) {
        return input.length;    // Pass: 这个代码块中，类型守卫已经将input识别为array类型
      }
      return input.length;      // Error: 这里的input还是unknown类型，静态检查报错。如果入参是any，则会放弃检查直接成功，带来报错风险
    }


  ```