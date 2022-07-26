# 通用的工具

## 脱敏手机号码
``` javascript
/**
 * @param val 手机号
 * @returns 得到脱敏的手机号
 * @position 脱敏的位置,默认脱敏中间位置 start | center | end
 */
export function desensitizationWithMobile(val, position = 'center') {
  if (typeof val !== 'string' || !val) {
    return '';
  }
  // 判断length
  if (position === 'start' && val.length > 5 && val.length < 11) {
    const patter = /^\S*(\S{5})/;
    const len = val.length - 5;
    const replaceString = '*'.repeat(len);
    return val.replace(patter, `${replaceString}$1`);
  }
  if (position === 'start' && val.length >= 11) {
    const patter = /^\S*(\S{7})/;
    const len = val.length - 7;
    const replaceString = '*'.repeat(len);
    return val.replace(patter, `${replaceString}$1`);
  }
  // 判断length
  if (position === 'center' && val.length > 5 && val.length < 11) {
    const patter = /(^\S{2})\S*(\S{3})/;
    const len = val.length - 5;
    const replaceString = '*'.repeat(len);
    return val.replace(patter, `$1${replaceString}$2`);
  }
  if (position === 'center' && val.length >= 11) {
    const patter = /(^\S{3})\S*(\S{4})/;
    const len = val.length - 7;
    const replaceString = '*'.repeat(len);
    return val.replace(patter, `$1${replaceString}$2`);
  }

  // 判断length
  if (position === 'end' && val.length > 5 && val.length < 11) {
    const patter = /(^\S{5})\S*/;
    const len = val.length - 5;
    const replaceString = '*'.repeat(len);
    return val.replace(patter, `$1${replaceString}`);
  }
  if (position === 'end' && val.length >= 11) {
    const patter = /(^\S{7})\S*/;
    const len = val.length - 7;
    const replaceString = '*'.repeat(len);
    return val.replace(patter, `$1${replaceString}`);
  }
  return val;
}
```