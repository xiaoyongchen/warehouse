// 本地存储
const syncStorage = {
  getItem: (key: SKey) => {
    const value = sessionStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  },

  setItem: (key: SKey, value: Record<string, any>) => {
    const _value = JSON.stringify(value)
    return sessionStorage.setItem(key, _value);
  },

  removeItem: (key: SKey) => {
    return sessionStorage.removeItem(key);
  },
}

type StorageKeys = {
  APP_INFO: 'appInfo';
}

type SKey = StorageKeys[keyof StorageKeys];


export default syncStorage;