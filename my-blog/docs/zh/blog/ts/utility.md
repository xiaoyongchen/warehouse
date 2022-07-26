# ts 工具

## Partial 转可选类型

- 例子
  ```typescript
    type Partial<T> = {
      [P in keyof T]?: T[P] | undefined;
    }
  ```

## Required 所有的类型去掉可选类型

- 例子
  ```typescript
    type Partial<T> = {
      [P in keyof T]-?: T[P];
    }
  ```


## Readonly 所有类型增加readonly等同于 <strong>Object.freeze</strong>

- 例子
  ```typescript
    type Readonly<T> = {
      readonly [P in keyof T]: T[P];
    }
  ```

## Record<keys, Type>

- 例子
  ```typescript
    type Record<P extends string | number | symbol, T> = {
      [K in keyof P]: T;
    }
  ```

## Pick<Type, Keys>

- 例子
  ```typescript
    type Pick<T, K extends keyof T> = {
      [P in K]: T[P];
    }
  ```

## Omit<Type, Keys>

- 例子
  ```typescript
    // 1.0
    type Pick<T, K extends keyof T> = {
      [P in K as Exclude<K>]: T[P];
    }
    // 2.0
    type P<T, K extends string | number | symbol> = {
      // 剔除K
      [P in Exclude<keyof T, K>]: T[P];
    }

    type R = P<{index: 1, age: 12, name: '123'}, 'index'>;

  ```

## Exclude<UnionType, ExcludedMembers>

- 例子
  ```typescript
    // 去除交集
    type Ex<T,U> = T extends U ? never : T;
    type A = Ex<string | number, number>; // string

  ```

## Extract<Type, Unit> => 从联合类型中取出与type交集，于楼上相反

- 例子
  ```typescript
    // 去除交集
    type Ex<T,U> = T extends U ? T : never;
    type A = Ex<string | number, number>; // number

  ```

## NonNullable

- 例子
  ```typescript
    // 收集交集
    type NoN<T> = T extends null | undefined ? never : T;
    type A = NoN<number | null | undefined>; // number

  ```

## Parameters 以函数的参数通过infer => 构造一个元组类型

- 例子
  ```typescript
    type Parameters<T extends (...arg: any) => any> =  T extends (...arg: infer R) => any ? R : never;

  ```

## ReturnType => 通过函数返回值构造一个返回值类型

- 例子
  ```typescript
    type Parameters<T extends (...arg: any) => any> =  T extends (...arg: any) => infer R ? R : never;

  ```

## InstanceType => 返回实例的类型

- 例子
  ```typescript
    type Parameters<T extends (...arg: any) => any> =  T extends (...arg: any) => infer R ? R : never;

  ```
- tips: type Ins<T extends abstract new (...arg: any) => any > = T extends abstract new (...arg: any) => infer R ? R : any;
- 只适用 abstract new (...arg: any) => any

## ThisType => 给this实例添加类型

- 例子
  ```typescript
  //
   type ObjectDescriptor<D, M> = {
      data?: D;
      methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M
    };
     
    function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
      let data: object = desc.data || {};
      let methods: object = desc.methods || {};
      return { ...data, ...methods } as D & M;
    }
     
    let obj = makeObject({
      data: { x: 0, y: 0 },
      methods: {
        moveBy(dx: number, dy: number) {
          this.x += dx; // Strongly typed this
          this.y += dy; // Strongly typed this
        },
      },
    });
     
    obj.x = 10;
    obj.y = 20;
    obj.moveBy(5, 5);
  ```
- tips: type Ins<T extends abstract new (...arg: any) => any > = T extends abstract new (...arg: any) => infer R ? R : any;
- 只适用 abstract new (...arg: any) => any


## Lowercase 转小写

- 例子
  ```typescript
    type LowercaseGreeting = "HELLO, WORLD";
    type Greeting = Lowercase<LowercaseGreeting>; // type Greeting = "hello, world"
  ```

## Uppercase 转大写

- 例子
  ```typescript
    type LowercaseGreeting = "hello, world";
    type Greeting = Uppercase<LowercaseGreeting>; // type Greeting = "HELLO, WORLD"
  ```

## Capitalize 首字母大写

- 例子
  ```typescript
    type LowercaseGreeting = "hello, world";
    type Greeting = Capitalize<LowercaseGreeting>; // type Greeting = "Hello, world"
  ```

## Uncapitalize 首字母小写

- 例子
  ```typescript
    type LowercaseGreeting = "HELLO, WORLD";
    type Greeting = Uncapitalize<LowercaseGreeting>; // type Greeting = "hELLO, WORLD"
  ```
