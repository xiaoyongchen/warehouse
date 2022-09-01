## date 使用过程中遇到的bug

```javascript
  // today is '2022-08-31';
    const time = new Date();
    time.setMonth(8); // 1664627025471
    time.getMonth(); // 9 这里得到10月份，应该是8的
    const time1 = new Date();
    time1.setMonth(9);  // 1667219112264
    time1.getMonth(); // 10


```
[官方解释](https://github.com/mdn/content/issues/20170)
// 大致意思就是，以当前月份计算下个月的的月份，例如当前月有31天，下个月没有31天 => 计算的得到就是10月份

:::tip
  const time = new Date('2022-08');

  time.getMonth(); // 7

  time.setMonth(8); // 1661990400000

  time.getMonth(); // 8

  // 或者dayjs
  time = new Date(dayjs(startDate).add(1, 'month').valueOf());

:::