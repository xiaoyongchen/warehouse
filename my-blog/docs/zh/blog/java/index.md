## this

  * 函数内部this指向当前类对应的实例。
## 可变参数

  * 类型 ...
## 传参

  * 基础数据类型为深拷贝，修改外部变量不影响实际的值
  * 引用类型的是浅拷贝，引用的是地址。（和js的传值是一样的）
## 构造方法可以写两个一个有参数一个无参数。

## extends 继承最好的代码是继承抽象类 Object是所有的类的抽象类（父类）

## 关键字
  * protected访问的权限在树的内部。
  * provite 自己能访问自己，独有属性。
  * final 可以阻止继承。final表示最终的，可以阻止派生和继承。抽象类不可以使用final修饰。
  * implements 实现接口而生。
  * interface 定义一个借口的声明符号（可以看作js的type和interface）。
  * default可以接口中，修饰一个方法，此方法可以不用复写父类的方法。
  * provite（自己） < default(包访问级别) < protected（子类级别） < public（公共）
  * static 修饰的静态属性属于所有的实例共享的属性他，通过类名去访问这个静态变量。可以作为累加器使用。
  * interface 中定义的静态字段必须要有final修饰 （public static final）也可以去掉。

## 构造函数

  * 如果父类没有构造函数，或者构造函数为默认的（Public Parent(){}）,子类需要重写super()方法。因为编译器自动生成。
  * 如果有构造方法并且有参数。必须要调用super($) {},并且参数个数类型要对。

## 继承和组合 继承is关系，组合有has关系。

## @Override 多态使用。
  * 多态作用只对一个方法拓展有用，在对数据统计有点作用
  * 如果定义的方法仅仅是为了继承，可以考虑使用抽象的abstract定义
  * 定义的abstract必须要执行一次。
  * 根root定义的接口使用abstract本意是为了规范。
  * 一个类可以实现过个接口（类似iOS的协议只要签订了协议不要重写一次）

## 包 packge，定义类不需要要声明一个包。否则是全局类名非常容易引起变量冲突。
​
## java流程

```java
  // 控制器中设置
  @Api(tags="事故") // 用于设置swagger
  @Slf4j           
  @RestController
  @RequestMapping("/accident")  // 服务

  // list请求
  @ApiOperation("事故列表") // spring 用于aop设置事务
  @PostMapping("/list")    // 具体的路径
  /**
   * @RequestBody AccidentListReq req 请求报文
   * AccidentListReq 在
   * PageResponse<AccidentResp> 返回报文
   * 
   */
  public PageResponse<AccidentResp> list(@RequestBody AccidentListReq req) {
    // 拿到请求参数
    // 通过服务区请求结果。
    // 对结果进行处理，设置返回报文。
    return PageResponse.of(businessAccidentService.list(req));
  }

  // businessAccidentService抽象类中设置接口
  // 在实现类中调用。BusinessAccidentServiceImpl


```