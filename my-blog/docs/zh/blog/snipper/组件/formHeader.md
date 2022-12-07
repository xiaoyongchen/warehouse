### HeaderForm

```vue
<template>
  <div class="form-view" v-if="formKeys">
    <slot v-if="$slots.language" name="language"></slot>
    <span v-else-if="showLanguage" class="language"></span>
    <slot v-if="$slots.form" name="form"></slot>
    <el-form
      :model="form"
      size="small"
      label-suffix=":"
      :label-width="typeof labelWidth === 'number' ? labelWidth + 'px' : labelWidth"
      class="form-content"
      inline
    >
      <span v-for="(it, index) in formKeys" :key="it.prop + index">
        <template v-if="it.formType === 'buttons'">
            <span class="buttons">
              <el-button
                v-for="buttonIt in it.buttonList"
                :key="buttonIt.prop"
                v-bind="buttonIt"
                @click="$emit(buttonIt.eventName)"
                class="button"
                >{{ buttonIt.title }}
              </el-button>
            </span>
          </template>
        <el-form-item
          class="form-item"
          :label="it.label"
          :prop="it.prop"
          v-else
          >
          <template v-if="it.formType === 'input'">
            <el-input v-bind="it" v-model.trim="form[it.prop]" class="input-item"></el-input>
          </template>
          <template v-if="it.formType === 'select'">
            <el-select v-bind="it" v-model="form[it.prop]" class="select-item">
              <el-option
                v-for="(selectIt, selectIndex) in it.options"
                :key="selectIndex"
                :label="selectIt.label"
                :value="selectIt.value">
              </el-option>
            </el-select>
          </template>
          <template v-if="it.formType === 'treeSelect'">
            <TreeSelect
              v-bind="it"
              :needParentNode="it.needParentNode"
              :data="it.options"
              :value="form[it.prop]"
              @change="(checkedKeys, checkedNodes) => { form[it.prop] = checkedKeys; form[it.checkedNodes] = checkedNodes }"
            />
          </template>
          <template v-if="it.formType === 'datePicker'">
            <el-date-picker
              v-bind="it"
              v-model="form[it.prop]"
              @change="(val) => it.change && it.change(val, form)"
              class="date-picker-item"
            >
            </el-date-picker>
          </template>
          <template v-if="it.formType === 'timePicker'">
            <el-time-picker
              v-bind="it"
              v-model="form[it.prop]"
              class="time-picker-item"
            >
            </el-time-picker>
          </template>
        </el-form-item>
      </span>
    </el-form>
    <span class="expand-buttons">
      <slot v-if="$slots.expandButtons" name="expandButtons"></slot>
      <span v-else></span>
    </span>
   </div>
</template>

<script>
import { reactive, toRefs, defineComponent } from '@vue/composition-api'
import TreeSelect from './TreeSelect.vue'

const HeaderFormProps = {
  form: {
    type: Object
  },
  labelWidth: {
    type: [Number, String],
    default: 80
  },
  showLanguage: {
    type: Boolean,
    default: true
  },
  justify: {
    type: String,
    validator: (v) => ['start', 'end', 'center', 'space-around', 'space-between'].find(it => it === v),
    default: 'start'
  },
  align: {
    type: String,
    validator: (v) => ['top', 'middle', 'bottom'].find(it => it === v),
    default: 'top'
  },
  formKeys: {
    type: Array
  },
  showExpand: {
    type: Boolean,
    default: true
  }
}
export default defineComponent({
  props: HeaderFormProps,
  components: { TreeSelect },
  setup () {
    const state = reactive({})
    return { ...toRefs(state) }
  }
})
</script>

<style lang="scss" scoped>

  .form-view {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding-bottom: 16px;
    .form-content {
      flex: 1;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .form-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        /deep/ .el-form-item__content {
          width: 260px !important;
        }
        .input-item,.select-item, .date-picker-item,.time-picker-item {
          width: 100%;
        }
        .date-picker-item {
          /deep/.el-range-separator  {
            width: 20px !important;
          }
        }
      }
      .buttons {
        .button {
          width: 80px;
          &:first-child {
            margin-left: 80px;
          }
        }
      }
    }
    .language {
      margin-top: 0px;
      align-self: flex-end;
    }
    .expand-buttons {
      @extend .language;
      display: flex;
      flex-direction: row;
    }
  }
</style>

```