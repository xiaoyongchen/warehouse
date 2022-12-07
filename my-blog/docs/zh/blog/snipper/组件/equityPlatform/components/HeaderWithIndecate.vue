<template>
  <div class="bjx-title">
    <div class="bjx-title-indicate" />
    <div class="bjx-title-text">{{title}}</div>
  </div>
</template>

<script>

import { defineComponent } from '@vue/composition-api'
export default defineComponent({
  name: 'HeaderWithIndecate',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
})
</script>

<style scoped lang="scss">
  .bjx-title {
    display: flex;
    align-items: center;
    position: relative;
    font-size: 14px;
    line-height: 22px;

    .bjx-title-indicate {
      width: 4px;
      height: 14px;
      background-color: rgba(24, 144, 255, 1);
      border-radius: 2px;
      margin-right: 8px;
    }
    .bjx-title-text {
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      height: 22px;
      line-height: 22px;
    }
  }

</style>
