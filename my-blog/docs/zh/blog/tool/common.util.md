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

## 设置tree

```javascript
    const getTabelList = () => {
      if (!state.treeList?.length) {
        return []
      }
      const loop = (it, prop = { children: 'children', label: 'label' }) => {
        // 有值
        it.label = it[prop.label]
        if (it[prop.children]?.length) {
          it.children = it[prop.children]
          const children = it.children?.map(childrenIt => {
            return loop(childrenIt, { children: 'childrenTagList', label: 'tagNameCn' })
          })
          it.children = children
        }
        return it
      }
      const list = state.treeList.map(it => loop(it, { children: 'childrenTagList', label: 'tagNameCn' }))
      return list
    }
```

## 下载网络图片

```javascript
      const downloadPicture = async (url = '') => {
        if (url) {
          try {
            const base64 = await getUrlBase64(url)
            const link = document.createElement('a')
            link.href = base64
            link.download = 'qrCode.png'
            link.click()
          } catch (error) {
            console.log(error)
          }
        }
      }
      const getUrlBase64 = (url) => {
        return new Promise(resolve => {
          let canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const img = new Image()
          img.crossOrigin = 'Anonymous' // 允许跨域
          img.src = url
          img.onload = function () {
            canvas.height = 240
            canvas.width = 240
            ctx.drawImage(img, 0, 0, 240, 240)
            const dataURL = canvas.toDataURL('image/png')
            canvas = null
            resolve(dataURL)
          }
        })
      }

```

### 打开网络图片

```javascript
  window.location.href = url;
```

