<template>
  <div class="default-view-container">
    <nav-bar :title="title" backgroundColor="#ffff00">
      <template v-slot:rightContainer>
        <div class="nav-bar-right-container">
          <span @click="onNavBarRightTextClicked">Click</span>
        </div>
      </template>
    </nav-bar>
    <div>{{ message }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "@vue/runtime-core";
import NavBar from "@/components/NavBar.vue";
// import familyAPI from "@/services/family";
// import JHFormItem from "@/components/formItem/JHFormItem.vue";
import { useStore } from "@/store";
// import qs from "qs";

export default defineComponent({
  components: {
    NavBar,
  },

  setup() {
    const title = ref("我是标题");
    const countValue = 1;
    const store = useStore();
    const message = computed(() => {
      return store.state["familyManager"].message;
    });

    const onNavBarRightTextClicked = () => {
      store.commit("familyManager/updateMessage", "changeMessage");
    };

    return {
      title,
      countValue,
      message,
      onNavBarRightTextClicked,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scope>
.default-view-container {
  background-color: #f5f5f5;
  .nav-bar-right-container {
    margin-right: 12px;
    font-size: 14px;
  }
}
</style>
