## 安装

## 查看是否安装了python
  * 打开终端 输入python or python3
  * print("hello world")
  * 打开vscode 输入 type -a python3 
    python3 is /usr/bin/python3
  * 安装python拓展

## 字符串变量

  message = "hello world"
  message.title() => Hello World
  message.upper() => HELLO WORLD
  message.lower() => hello world
  message + "" + "!" => hello world!

  // 通过制表符直接拼接
  message + "\t" + "123456" => hello world
                               123456
  delete_message = " hello world "
  // 删除首位空格 strip首位 rstrip 首部 lstrip 首部
  delete_message.rstrip()

## 数字
  2 + 1 => 3
  2 * 2 => 4
  2 / 2 => 1
  2 % 2 => 0
  2 ** 3 => 8

  // 小数不确定跟终端有关
  0.1 + 0.2 => 0.30000000000000004

  // 转字符串str()
  print('happy ' + str(18) + ' birtyDay!')

## 注释 是有“#”标识

  # 这是一条注释

## 列表
  ### 操作
    animal = ['dog', 'fish', 'pig']

    animal[0]

    // 列表最后一个元素
    animal[-1]

    * append添加
    * pop(position) 移除最后一个 不指定position表示最后一个，0表示第一个，得到相应弹出元素。
    * del animal[0] 删除元素 使用del操作符
    * remove('dog') 制定删除的元素
    * clear 清除所有
    * insert(potison, element) 指定位置插入, potison 作为插入的下标 -0 ｜ 0一样的， -1表示倒数第二

  ### 组织列表

    * sort 永久性排序
    * sorted(animal) 临时排序，不改变原函数
    * reverse 反转
    * len 操作符确定长度

  ### 遍历列表 注意冒号，以及换行的缩进，通过缩进来判断单前行与上一行的关系
    ```bash
      animal = ['dog', 'fish', 'pig']
      for element in animal:
        print(element)
    ```
  ### 创建数值列表

    * for value in range(1,6): 使用range函数
      print(value)
    * 创建使用list函数list(range(1,6))
    * list(range(1,11, 2)) 指定步长

  ### 列表切片类似ES6的语法解构
    * num = [1,2,3,4,5,6,7,8] num[0:3] => [1,2,3]
    * num = [1,2,3,4,5,6,7,8] num[:3] => [1,2,3]  
    * num = [1,2,3,4,5,6,7,8] num[1:3] => [2,3]
    * num = [1,2,3,4,5,6,7,8] num[1:] => [2,3,4,5,6,7,8]


  ## 元组 使用括号包含

  ```javascript
    num = (1, 'index')
    print(num[1:]) // ('index',)这个比较奇怪
  ```

  ## 判断语句

  ```javascript
    num = [1,2,3]
    for e in num:
      if e == 2 and (e < 3 or e > 1):
        print('这是if语句输出：' + str(e))
      else:
        print('这是else语句输出：' + str(e))

    // 这是else语句输出：1
    // 这是if语句输出：2
    // 这是else语句输出：3

    // if not in 可以用于判断元素在列表中

  ```
  * if not in 可以用于判断元素在列表中
  * if elif else

## while break 可以退出循环, continue,不在往下执行，执行下个迭代

  ```javascript
    num = 1
    while mum <= 5:
      num += 1
  ```
  
## 字典
  
  * 字典里面的类似json对象
  * obj = { "color": 'red', "age": 19 }
  * del obj['color'] 删除
  * for k, v in obj: 遍历键，值
  * obj.keys() | obj.values()
  
## input 输入的是字符串

  ```javascript
    message = input("请输入数字：")
    print(message)

    // 请输入数字：12
    // 12
  ```

## 函数 def 声明 关键字实参，一对一关系

```javascript
  def funs(message = 'pig'):
  print(message)
  obj = {"name": "dog"}
  funs(message=obj["name"])

  // 不改变实参值
  num = [1,2,3]
  result = funs(num[:])
```

  * 不改变实参值 num[:]
  * def funs(*arg): "*"表示任意参数数量，一般放到最后，作为剩余参数； **arg表示字典

## 模块

  ### 命名
    * from 模块名 import 变量名
    * form 模块名 import 变量名 as 别名 或者这样 => form 模块名 as 别名
    * form 模块名 import * 导入所有的函数等变量

## 类

```javascript
  class Dog():
    def __init__(self, name):
      self.name = name
  
      def move(self):
        print(self.name)

  // dog = Dog('小黑')
  // dog.move()

  // 继承, super(子类名，self)
  class BigDog(Dog):
    def __init__(self, name):
      super(BigDog, self).__init__(name)
      self.name = name

  dog = Dog('小黑')
  dog.move()

```

## 文件处理

### 读文件操作

  ```bash

    import os
    # 可以查看文件路径
    os.path.exists('text.txt') 
    path = '/Users/chenxiaoyong/Desktop/warehouse/my-blog/docs/text.txt'
    # 每个文件末尾都有一个看不见的换行符
    with open(path) as file_object:
      content = file_object.read()
      print(content.strip()) 
    # readlines读取每个行，得到一个列表， readline读取第一行
  ```
### 写操作

```bash
  # w表示文件的写权限
  path = '/Users/chenxiaoyong/Desktop/warehouse/my-blog/docs/write.txt'
  with open(path, 'w') as file_object:
    file_object.write('hello world')
```

## try except 代码块

  ```bash
    try:
    first = input('\n输入分子:')
    second = input('输入分母:\n')
    print(int(first)/int(second))
  except ZeroDivisionError:   # print('分母不能为0') 还可以使用pass来跳过
    print('分母不能为0')
    # pass
  else:
    print('成功都在这里执行')

  # 文件未找到FileNotFoundError：是这个枚举值
  ```
## json 存储数据

```bash
  import json
  path = 'jsonResult.json'
  numbers = [1,2,3,4,5]
  with open(path, 'w') as json_file:
    json.dump(numbers, json_file)
```


## 单元测试

```bashu
import unittest

class TestNum(unittest.TestCase):
  def setUp(self):
    self.numArray = [1,2,3]
    self.isTrue = True
    self.isNum = 1
  def testIsTrue(self):
    self.assertTrue(self.isTrue)
  
  def testIsInt(self):
    self.assertIn(self.isNum, self.numArray)
  
unittest.main()
```

## 游戏

  ### 安装Pygame
    # 书上安装报错
    * brew install hg sdl sdl_image sdl_ttf 
      * 如果遇到权限问题执行下面两个操作（error：You should change the ownership of these directories to your user. 2.And make sure that your user has write permission.）
        * sudo chown -R $(whoami) /usr/local/lib/pkgconfig /usr/local/share/zsh /usr/local/share/zsh/site-functions
        * chmod u+w /usr/local/lib/pkgconfig /usr/local/share/zsh /usr/local/share/zsh/site-functions
      *  python@3.9: the bottle needs the Apple Command Line Tools to be installed.需要执行下面操作
         *  xcode-select --install
         *  brew install --build-from-source python@3.9

    * 直接使用pips install pygame

  ### 简单设置窗口
  ```bash
    import sys
    import pygame

    def run_game():
      pygame.init()
      screen = pygame.display.set_mode((800, 400))
      pygame.display.set_caption("Alien Invasion")
      bg_color = (230, 210, 230)

      while True:
        for event in pygame.event.get():
          if event.type == pygame.QUIT:
            sys.exit()
          # 每次循环都渲染
          screen.fill(bg_color)

        # 让最近绘制的屏幕可见
        pygame.display.flip()
    run_game()
  ```

  ### 


  ## matplotlib制作表格
    ### 安装
      * pip3 install --user matplotlib
      * 查看 python3 
        * >>> import matplotlib
      * 示例画廊(http://matplotlib.org/)。