import syncStorage from '@/storage';
import devConfig from './dev.config';
import uatConfig from "./uat.config";
import fatConfig from "./fat.config";
import prodConfig from "./prod.config";
import stagingConfig from "./staging.config";
enum envType {
  dev = "dev",
  uat = "uat",
  fat = "fat",
  staging = "staging",
  prod = "prod",
}

/**
 * 通过path查询配置表中的值
 * @param {string} path
 * @return {*} 
 */
const getHostWithKey = (path: string): string | number => {
  const store = syncStorage.getItem('appInfo');
  const env = store?.env as envType;
  const envObject = {
    dev: devConfig,
    uat: uatConfig,
    fat: fatConfig,
    staging: stagingConfig,
    prod: prodConfig,
  }
  const splitArray = path?.split('/');
  return splitArray?.reduce((preEnvObject: any, T) => {
    return preEnvObject?.[T] ? preEnvObject?.[T] : undefined;
  }, envObject[env]);
};

export default getHostWithKey;