### 自定义TreeSelect组件 
```vue
<template>
  <el-select
    ref="selectRef"
    :multiple="true"
    :value="value"
    :placeholder="placeholder"
    :size="size"
    :disabled="disabled"
    :filterable="filterable"
    :filter-method="filterMethod"
    @visible-change="visibleChange"
    @remove-tag="removeTag"
    class="form-select"
  >
    <el-option
      v-for="(it, index) in options"
      :key="it.id"
      :value="it.value"
      :label="it.label"
      v-show="index === 0"
      style="height: auto; background: #ffffff"
    >
      <el-tree
        v-if="index === 0"
        ref="treeRef"
        :node-key="nodeKey"
        :data="data"
        :props="props"
        empty-text="暂无数据"
        highlight-current
        show-checkbox
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :default-expanded-keys="value && value.length ? value : []"
        :default-checked-keys="value && value.length ? value : []"
        @check="handerCheckClick"
      />
    </el-option>
  </el-select>
</template>

<script>
import { isArray } from "lodash";
import { defineComponent, reactive, toRefs, watch, nextTick, computed } from "@vue/composition-api";
const Props = {
  value: {
    type: Array,
    default: () => [],
  },
  // 树形的数据
  data: {
    type: Array,
    default: () => [],
  },
  size: {
    type: String,
    default: "small",
    validator: (v) => ["medium", "small", "mini"].find((it) => it === v),
  },
  placeholder: {
    type: String,
    default: "请选择",
  },
  // 每个树节点用来作为唯一标识的属性
  nodeKey: {
    type: [String, Number],
    default: "id",
  },
  filterable: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  // tree的props配置
  props: {
    type: Object,
    default: () => ({
      label: "label",
      children: "children",
      parentId: "parentId",
    }),
  },
  filter: Function,
  needParentNode: {
    type: Boolean,
    default: true,
  },
};
export default defineComponent({
  name: "TreeSelect",
  props: Props,
  setup(props, { emit }) {
    const state = reactive({
      options: computed(() => getOptions()),
      cacheCheckedNodes: [],
      filterFlag: false,
      treeRef: null,
      selectRef: null,
    });

    watch(
      () => props.value,
      (newValue) => {
        setCheckTreeNode(newValue);
      }
    );

    const getOptions = () => {
      if (!props.data?.length) {
        return [];
      }

      const expanded = [];
      const loop = (nodes = []) => {
        if (nodes && nodes.length) {
          nodes.forEach((it) => {
            const childrenId = it[props.nodeKey] || "";
            const children = it[props.props.children] || [];
            const label = it[props.props.label] || "";
            expanded.push({ ...it, id: childrenId, value: childrenId, label });
            children?.length && loop(children);
          });
        }
      };

      loop(props.data);

      return expanded;
    };

    // 初始化treeList
    const setCheckTreeNode = (nodeIds) => {
      if (isArray(nodeIds) && nodeIds?.length) {
        nextTick(() => {
          state.treeRef[0].setCheckedKeys(nodeIds);
        });
        return;
      }
      nextTick(() => {
        state.treeRef[0].setCheckedKeys([]);
      });
    };

    // 下拉框出现是选中滚动项目
    const visibleChange = (visible) => {
      if (visible) {
        state.filterFlag && state.treeRef[0].filter("");
        state.filterFlag = false;
        const selectDom = state.treeRef[0]?.$el.querySelector(".is-current");
        setTimeout(() => {
          selectDom && state.selectRef.scrollToOption({ $el: selectDom });
        }, 0);
      }
    };

    const handerCheckClick = (currentNode = {}, nodeInfo = {}) => {
      const { checkedKeys = [], checkedNodes = [] } = nodeInfo;
      if (props.needParentNode) {
        state.cacheCheckedNodes = checkedNodes;
        // 缓存节点数据
        emit("change", checkedKeys, checkedNodes);
        return;
      }
      // 自定义筛选
      if (props?.filter) {
        props.filter(checkedKeys, checkedNodes);
      }
      // 这里有个限制，只适用2级，多级的话，最好使用自定义filter函数
      const filterCheckedNodes = checkedNodes.filter((it) => {
        const filterFlag = it[props?.props.children]?.length > 0;
        return !filterFlag;
      });

      const filterCheckedKeys = filterCheckedNodes.map((it) => it[props.nodeKey || "id"]);
      state.cacheCheckedNodes = filterCheckedNodes;
      // 缓存节点数据
      emit("change", filterCheckedKeys, filterCheckedNodes);
    };

    const removeTag = (id) => {
      if (id) {
        const checkedKeys = props.value?.filter((it) => it !== id) || [];
        const checkedNodes = state.cacheCheckedNodes.filter((it) => it[props.nodeKey] !== id) || [];
        emit("change", checkedKeys, checkedNodes);
      }
    };

    // 单选模式的清除
    const clear = () => {
      emit("input", props.multiple ? [] : "");
      state.treeRef[0].setCheckedKeys([]);
    };

    // 自定义搜索方法
    const filterMethod = (val) => {
      state.filterFlag = true;
      state.treeRef[0].filter(val);
    };

    // 自定义tree筛选
    const filterNode = (value, data) => {
      if (!value) return true;
      const label = props.props.label || "name";
      return data[label].indexOf(value) !== -1;
    };

    return {
      ...toRefs(state),
      filterMethod,
      clear,
      removeTag,
      filterNode,
      visibleChange,
      setCheckTreeNode,
      handerCheckClick,
    };
  },
});
</script>
<style lang="scss" scoped>
.form-select {
  width: 100%;
}
</style>

```
