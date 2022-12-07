<template>
  <div class="nav-bar-container" :style="{ backgroundColor: backgroundColor }">
    <div :style="{ height: statusBarHeight + 'px' }"></div>
    <div class="nav-bar">
      <div class="back-arrow-container" @click="onClickBack">
        <div :class="backIcon"></div>
      </div>
      <div class="title" :style="{ color: titleColor }">{{ title }}</div>
      <div class="right-container">
        <slot name="rightContainer"></slot>
      </div>
    </div>
    <slot name="footer"></slot>
  </div>

  <div class="nav-bar-placeholder-container">
    <div :style="{ height: statusBarHeight + 'px' }"></div>
    <div class="nav-bar-placeholder"></div>
    <div style="visibility: hidden;">
      <slot name="footer"></slot>
    </div>
</div>

</template>

<script lang="ts">
import { NativeCall } from "@/utils/jsBridgeUtil";
import { defineComponent, onMounted, ref } from "@vue/runtime-core";
import { useRouter } from "vue-router";

export default defineComponent({
  props: {
    title: String, // 导航栏标题文字
    backgroundColor: String, // 导航栏背景色，格式同css的颜色值字符串
    dark: Boolean, // 导航栏是否是深色背景，设置该值将使导航栏的图标和文字设置为浅色
    clickLeft: () => Boolean, // 点击导航栏左边按钮的回调方法，该函数返回true将拦截导航栏的默认行为，返回false会继续执行默认行为
  },

  computed: {
    backIcon() {
      return this.dark ? "back-arrow-white" : "back-arrow";
    },

    titleColor() {
      return this.dark ? "white" : "#30322C";
    },
  },

  setup(props) {
    const statusBarHeight = ref(0);
    const router = useRouter();

    onMounted(() => {
      // 获取系统状态栏高度，整体内容区域往下移，避免覆盖状态栏
      getStausBarHeight();
    });

    const getStausBarHeight = async () => {
      let appInfo = await NativeCall.getAppInfo();
      if (appInfo) {
        statusBarHeight.value = appInfo.statusBarHeight;
      }
    };

    const onClickBack = () => {
      if (!props.clickLeft || !props.clickLeft()) {
        // 没有上一页就直接关闭容器
        // 上界面的path
        const _back = router?.options?.history?.state?.back;
        // 当前位置
        const _position = router?.options?.history?.state?.position;
        if (!_back && _position === 0) {
          NativeCall.close();
        } else {
          router.go(-1);
        }
      }
    };

    return {
      statusBarHeight,
      onClickBack,
    };
  },
});
</script>

<style lang="less">
.nav-bar-container {
  background-color: white;
  position: fixed;
  z-index: 100;
  left: 0%;
  right: 0%;

  .nav-bar {
    height: 44px;
    display: flex;
    align-items: center;
    position: relative;

    .back-arrow-container {
      margin-left: 12px;
      position: absolute;
      padding: 6;

      .back-arrow {
        width: 16px;
        height: 16px;
        background-image: url(../assets/img/back_arrow_black.png);
        background-size: auto 16px;
        background-repeat: no-repeat;
      }

      .back-arrow-white {
        .back-arrow;
        background-image: url(../assets/img/back_arrow_white.png);
      }
    }

    .title {
      font-size: 16px;
      font-weight: 500;
      margin-left: auto;
      margin-right: auto;
    }

    .right-container {
      position: absolute;
      right: 0%;
    }
  }
}

.nav-bar-placeholder-container {
  z-index: -1;
  left: 0%;
  right: 0%;

  .nav-bar-placeholder {
    height: 44px;
  }
}
</style>
