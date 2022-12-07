<template>
  <div v-if="isInitData">
    <router-view v-wechat-title="$route.meta.title"></router-view>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { initAxios } from "@/plugins/axios";
import { NativeCall } from "@/utils/jsBridgeUtil";
import syncStorage from '@/storage';
import { getCurrentInstance } from "@vue/runtime-core";

export default class App extends Vue {
  data() {
    return {
      // 是否初始化
      isInitData: false,
    };
  }

  async mounted() {
    // 获取vm
    const vm: any = getCurrentInstance()?.proxy;

    // 获取Appinfo
    const appInfo = await NativeCall.getAppInfo();

    if (appInfo) {
      // 初始化请求
      initAxios(appInfo);
      // 已经初始化
      vm.isInitData = true;
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      // 浏览器环境使用模拟app数据，方便调试
      const fakeAppInfo = {
        token: process.env.VUE_APP_TOKEN,
        env: process.env.VUE_APP_ENV,
        language: process.env.VUE_APP_LANG,
        deviceId: "fake",
        userId: process.env.VUE_APP_USER_ID,
        versionCode: process.env.VUE_APP_VERSION_CODE,
        versionName: process.env.VUE_APP_VERSION_NAME,
        statusBarHeight: 0,
      };
      // 存储appinfo
      syncStorage.setItem('appInfo', fakeAppInfo);
      // 初始化请求
      initAxios(fakeAppInfo);
      // 已经初始化
      vm.isInitData = true;
    }
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  max-height: 100vh;
  width: 100vw;
}
</style>
