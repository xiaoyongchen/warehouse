### Cell封装
```javascript
<template>
  <div
    class="jh-cell"
    :style="[
      {
        borderRadius: borderRadius + 'px',
        marginTop: marginTop + 'px',
        marginLeft: marginHorizontal + 'px',
        marginRight: marginHorizontal + 'px',
        ...boxStyle,
      },
    ]"
    v-show="!hidden"
  >
    <div class="jh-cell-detail" :class="[{ 'is-column': isColumn }]" :style="[detailStyle]">
      <slot v-if="$slots.leftView" name="leftView"></slot>
      <div
        v-else
        class="leftView"
        :class="[{ top: formType === 1 && !isColumn && multiple }]"
        :style="[{ width: isColumn ? '100%' : typeof maxLeftWidth === 'string' ? maxLeftWidth : maxLeftWidth + 'px' }]"
        @click="onSelectLeftView"
      >
        <slot v-if="$slots.labelPrefix" name="labelPrefix"></slot>
        <span v-else v-show="required" class="labelPrefix">*&nbsp;</span>

        <slot v-if="$slots.label" name="label"></slot>
        <span
          v-else
          class="label"
          labelColor="labelColor"
          :class="[{ labelColor: labelColor }]"
          v-bind="labelProps"
          :style="[labelViewStyle]"
          >{{ label }}</span
        >

        <slot v-if="$slots.labelSuffix" name="labelSuffix"></slot>
        <span v-else class="labelSuffix"></span>
      </div>
      <slot v-if="$slots.rightView" name="rightView"></slot>
      <div v-else class="rightView" :class="[{ 'is-alignLeft': alignLeft }]" :style="[rightViewStyle]">
        <slot v-if="$slots.value" name="value"></slot>
        <template v-else>
          <template v-if="formType === 0">
            <div
              v-show="value"
              class="textView"
              :class="[{ required: required, 'is-value': !!value, 'is-disabled': disabled }]"
              :style="[{ ...valueStyle }]"
            >
              {{ value }}
            </div>
          </template>
          <template v-else-if="formType === 1">
            <div class="inputView" :style="[{ ...valueStyle }]">
              <textarea
                v-if="multiple"
                ref="inputRef"
                class="textarea"
                :type="inputType"
                :required="required"
                :readonly="disabled"
                :maxlength="maxlength"
                :placeholderColor="placeholderColor"
                :invalidColor="invalidColor"
                :disabledColor="disabledColor"
                :valueColor="valueColor"
                :class="[
                  {
                    required: required,
                    'is-invalid': required && invalid && !value,
                    'is-disabled': disabled,
                  },
                ]"
                :style="[textareaStyle]"
                :placeholder="placeholder"
                @input="(value: any) => onChangeText(value.currentTarget?.value)"
                @change="onEndEditing"
                :value="value"
                v-bind="textareaProps"
              />
              <input
                v-else
                ref="inputRef"
                class="input"
                :type="inputType"
                :required="required"
                :readonly="disabled"
                :maxlength="maxlength"
                :placeholderColor="placeholderColor"
                :invalidColor="invalidColor"
                :disabledColor="disabledColor"
                :valueColor="valueColor"
                :class="[
                  {
                    required: required,
                    'is-invalid': required && invalid && !value,
                    'is-disabled': disabled,
                  },
                ]"
                :style="[inputStyle]"
                :placeholder="placeholder"
                @input="(value: any) => onChangeText(value.currentTarget?.value)"
                @change="onEndEditing"
                :value="value"
                v-bind="inputProps"
              />
              <slot v-if="$slots.valueSuffix" name="valueSuffix"></slot>
              <div v-else v-show="showValueSuffix"></div>
            </div>
          </template>
          <template v-else-if="formType === 2">
            <div
              class="buttonView"
              :number="number"
              :class="[
                {
                  required: required,
                  'is-arrow': showArrow,
                  'is-placeholder': !value,
                  'is-value': value,
                  'is-invalid': required && invalid && !value,
                  'is-disabled': disabled,
                },
              ]"
              :style="[{ ...valueStyle }]"
              @click="onSelect"
            >
              <span>
                {{ value || placeholder }}
              </span>
            </div>
          </template>
          <template v-else>
            <slot v-if="$slots.custom" name="custom"></slot>
            <!-- 这是自定义rightView -->
            <div v-else class="custom"></div>
          </template>
        </template>
      </div>
    </div>
    <slot v-if="$slots.expand" name="expand"></slot>
    <!-- 熏染下划线 -->
    <slot v-if="$slots.separator" name="separator"></slot>
    <div v-else v-show="showSeparator" class="separator" :style="[separatorStyle]"></div>
  </div>
</template>

<script lang="ts">
import { ExtractPropTypes, watch, nextTick, ref, onMounted } from 'vue';
import { resizeTextarea } from './formItemUtil';

// eslint-disable-next-line no-shadow
export enum FormType {
  TEXT,
  INPUT,
  SELECT,
  CUSTOM,
}

const formProps = {
  label: String,
  bodyClass: Object,
  value: [Object, String, Number],
  boxStyle: Object,
  detailStyle: Object,
  rightViewStyle: Object,
  labelViewStyle: Object,
  valueStyle: Object,
  inputStyle: Object,
  textareaStyle: Object,
  isColumn: Boolean,
  required: Boolean,
  invalid: Boolean,
  disabled: Boolean,
  hidden: {
    type: Boolean,
    default: false,
  },
  // value 水平布局,默认靠右
  alignLeft: Boolean,
  showValueSuffix: Boolean,
  // 是否多行
  multiple: Boolean,
  //
  showArrow: {
    type: Boolean,
    default: true,
  },
  marginHorizontal: {
    type: Number,
    default: 0,
  },
  marginTop: {
    type: Number,
    default: 0,
  },
  borderRadius: {
    type: Number,
    default: 0,
  },
  maxLeftWidth: {
    type: [Number, String],
    default: 160,
  },
  labelProps: Object,
  formType: Number,
  inputType: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
  },
  labelColor: {
    type: String,
    default: '#36444e',
  },
  placeholderColor: {
    type: String,
    default: '#c6cdd2',
  },
  disabledColor: {
    type: String,
    default: '#86949e',
  },
  invalidColor: {
    type: String,
    default: '#f05b5b',
  },
  valueColor: {
    type: String,
    default: '#36444e',
  },
  maxlength: Number,
  // 文本行数
  number: Number,
  textareaProps: Object,
  inputProps: Object,
  // 下划线
  showSeparator: Boolean,
  separatorStyle: Object,
  onSelectLeftView: {
    type: Function,
    default: () => {
      //
    },
  },
  onChangeText: {
    type: Function,
    default: () => {
      //
    },
  },
  onEndEditing: {
    type: Function,
    default: () => {
      //
    },
  },
  onSelect: {
    type: Function,
    default: () => {
      //
    },
  },
};

export type FORM_PROPS = Partial<ExtractPropTypes<typeof formProps>> & Record<string, any>;

export default {
  name: 'jih-form-item',
  props: formProps,
  setup(props: FORM_PROPS) {
    const inputRef = ref<HTMLInputElement | null>();

    const adjustTextareaSize = () => {
      if (inputRef.value) {
        resizeTextarea(inputRef.value);
      }
    };

    onMounted(() => {
      if (props.formType === FormType.INPUT && props.multiple) {
        nextTick(adjustTextareaSize);
      }
    });

    watch(
      () => props.value,
      () => {
        if (props.formType === FormType.INPUT && props.multiple) {
          nextTick(adjustTextareaSize);
        }
      },
    );

    return { inputRef };
  },
};
</script>

<style lang="less" scoped>
.row-center {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.column {
  display: flex;
  flex-direction: column;
}

.label-color {
  color: v-bind(labelColor);
}
.is-color-placeholder {
  color: v-bind(placeholderColor);
}
.is-color-invalid {
  font-weight: 400;
  color: v-bind(invalidColor);
}
.is-color-disabled {
  font-weight: bold;
  color: v-bind(disabledColor);
}
.is-color-value {
  font-weight: bold;
  color: v-bind(valueColor);
}
.jh-cell {
  outline: none;
  .column;
  min-height: 108px;
  background-color: #ffffff;
  font-size: 28px;
  overflow: hidden;
  .jh-cell-detail {
    flex: 1;
    display: flex;
    flex-direction: row;
    &.is-column {
      padding-top: 32px;
      min-height: 142px;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      .rightView {
        justify-content: flex-start;
        .textView {
          &.required {
            padding-left: 46px;
          }
          &.is-value {
            .is-color-value;
          }
          &.is-disabled {
            .is-color-disabled;
          }
        }
        .inputView {
          .input,
          .textarea {
            // 部分手机又快阴影
            opacity: 1;
            text-align: left;
            justify-content: flex-start;
            &.required {
              padding-left: 46px;
            }
          }
          .textarea {
            margin-top: 0px;
            padding-top: 29px;
            margin-bottom: 8px;
          }
        }
        .buttonView {
          text-align: left;
          justify-content: flex-start;
          &.required {
            padding-left: 46px;
          }
        }
      }
    }
    .leftView {
      .row-center;
      padding-left: 30px;
      .labelPrefix {
        width: 16px;
        height: 28px;
        color: #ff9c5d;
      }
      .label {
        font-size: 28px;
        color: #36444e;
        font-weight: 400;
        flex-shrink: 1;
        &.labelColor {
          .label-color;
        }
      }
      &.top {
        align-items: flex-start;
        margin-top: 34px;
      }
    }
    .rightView {
      flex: 1;
      display: flex;
      flex-direction: row;
      width: 100%;
      // 这里设置主要是input换行问题, 先注释看看有没有什么问题
      // min-height: 92px;
      // 右边内容是靠左布局还是靠右开始布局
      justify-content: flex-end;
      // 默认居中
      align-items: center;
      &.is-alignLeft {
        justify-content: flex-start;
        .inputView {
          justify-content: flex-start;
          .input,
          .textarea {
            text-align: left;
          }
        }
        .buttonView {
          text-align: left;
          justify-content: flex-start;
        }
      }
      .textView {
        word-break: break-all;
        padding: 0 30px;
        font-size: 28px;
        color: #36444e;
        &.is-value {
          .is-color-value;
        }
        &.is-disabled {
          .is-color-disabled;
        }
      }
      .inputView {
        .row-center;
        justify-content: flex-end;
        width: 100%;
        text-align: right;
        .input,
        .textarea {
          flex: 1;
          width: 100%;
          text-align: right;
          outline-style: none;
          border: 0;
          font-size: 28px;
          padding: 0 30px;
          &::placeholder {
            font-weight: 400;
            .is-color-placeholder;
          }
          &.is-invalid::placeholder {
            .is-color-invalid;
          }
          .is-color-value;
          &.is-disabled {
            .is-color-disabled;
            pointer-events: none;
          }
        }
        .textarea {
          resize: none;
          margin-top: 28px;
          padding-top: 7px;
          padding-bottom: 16px;
          background-color: #ffffff;
        }
      }
      .buttonView {
        .row-center;
        justify-content: flex-end;
        width: 100%;
        font-size: 28px;
        text-align: right;
        word-break: break-all;
        padding: 0 30px 0 30px;
        &.is-disabled {
          pointer-events: none;
        }
        &.is-arrow {
          position: relative;
          padding: 0 62px 0 30px;
          &::after {
            margin-right: 30px;
            right: 0;
            top: 0;
            position: absolute;
            content: '';
            height: 100%;
            width: 32px;
            background-image: url(../../assets/images/form_item_indicator.png);
            background-size: auto 32px;
            background-position: right center;
            background-repeat: no-repeat;
          }
        }
        &.is-placeholder {
          .is-color-placeholder;
        }
        &.is-value {
          .is-color-value;
        }
        &.is-invalid {
          .is-color-invalid;
        }
        &.is-disabled {
          .is-color-disabled;
        }
      }
    }
  }
  .separator {
    margin: 0 30px;
    pointer-events: none;
    height: 1px;
    background-color: #e6e9ed;
    transform: scaleY(0.5);
  }
}
</style>

```

### autoHeight

```javascript
/* eslint-disable */
export type ScrollElement = Element | Window;

export function setScrollTop(el: ScrollElement, value: number) {
  if ('scrollTop' in el) {
    el.scrollTop = value;
  } else {
    el.scrollTo(el.scrollX, value);
  }
}

export function getRootScrollTop(): number {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

export function setRootScrollTop(value: number) {
  setScrollTop(window, value);
  setScrollTop(document.body, value);
}

export function resizeTextarea(input: HTMLInputElement) {
  const scrollTop = getRootScrollTop();
  input.style.setProperty('height', 'auto');

  const height = input.scrollHeight;
  if (height) {
    input.style.setProperty('height', `${height}px`);
    // https://github.com/youzan/vant/issues/9178
    setRootScrollTop(scrollTop);
  }
}

```