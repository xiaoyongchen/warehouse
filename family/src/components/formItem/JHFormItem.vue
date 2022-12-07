<template>
  <div class="jh-cell" :style="[{ borderRadius: Radius + 'px', marginTop: marginTop + 'px', marginLeft: marginHorizontal + 'px', marginRight: marginHorizontal + 'px' }, boxStyle]">
    <!-- 熏染内容 -->
    <div class="detail" :class="[{ 'is-column': isColumn }]" :style="[detailStyle]">
      <slot v-if="$slots.leftView" name="leftView"></slot>
      <div v-else class="leftView" :style="[{ width: isColumn ? '100%' : maxLeftWidth + 'px' }]">
        <!-- 标题前缀 -->
        <slot v-if="$slots.labelPrefix" name="labelPrefix"></slot>
        <span v-else v-show="required" class="labelPrefix">*&nbsp;</span>

        <!-- 标题 -->
        <slot v-if="$slots.label" name="label"></slot>
        <span v-else class="label" v-bind="labelProps">{{ label }}</span>

        <!-- 标题后缀 -->
        <slot v-if="$slots.labelSuffix" name="labelSuffix"></slot>
        <span v-else class="labelSuffix"></span>
      </div>
      <slot v-if="$slots.rightView" name="rightView"></slot>
      <div v-else class="rightView" :class="[{ 'is-alignLeft': alignLeft }]" :style="[rightViewStyle]">
        <slot v-if="$slots.value"></slot>
        <template v-else>
          <template v-if="formType === 0">
            <div v-show="value" class="textView" :class="[{ 'is-color-value': !!value, 'is-color-disabled': disabled }]" :style="[valueStyle]">{{ value }}</div>
          </template>
          <template v-else-if="formType === 1">
            <div class="inputView" :style="[valueStyle]">
              <textarea
                v-if="multiple"
                class="textarea"
                :type="inputType"
                :required="required"
                :readonly="disabled"
                :maxlength="maxlength"
                :class="[{ 'is-invalid': required && invalid }]"
                :placeholder="placeholder"
                @input="(value) => onChangeText(value)"
                @change="onEndEditing"
                :v-text="value"
                v-bind="textareaProps"
              />
              <input
                v-else
                class="input"
                :type="inputType"
                :required="required"
                :readonly="disabled"
                :maxlength="maxlength"
                :class="[{ 'is-invalid': required && invalid }]"
                :placeholder="placeholder"
                @input="(value) => onChangeText(value)"
                @change="onEndEditing"
                :v-text="value"
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
              :class="[{ 'is-arrow': showArrow, 'is-color-placeholder': !value, 'is-color-invalid': required && invalid && !value, 'is-color-value': value }]"
              :style="[valueStyle]"
              @click="onSelect"
            >
              <span>
                {{ value || placeholder }}
              </span>
            </div>
          </template>
          <template v-else>
            <!-- 这是自定义rightView -->
            <div class="custom"></div>
          </template>
        </template>
      </div>
    </div>
    <!-- 熏染下划线 -->
    <slot v-if="$slots.separator" name="separator"></slot>
    <div v-else v-show="showSeparator" class="separator" :style="[separatorStyle]"></div>
  </div>
</template>

<script lang="ts">
// value 类型
export enum FormType {
  TEXT,
  INPUT,
  SELECT,
  CUSTOM,
}
export default {
  name: "JHFormItem",
  props: {
    label: String,
    bodyClass: Object,
    value: [Object, String, Number],
    boxStyle: Object,
    detailStyle: Object,
    rightViewStyle: Object,
    valueStyle: Object,
    isColumn: Boolean,
    required: Boolean,
    invalid: Boolean,
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
      default: 15,
    },
    marginTop: {
      type: Number,
      default: 0,
    },
    Radius: {
      type: Number,
      default: 0,
    },
    maxLeftWidth: {
      type: Number,
      default: 160,
    },
    labelProps: Object,
    formType: FormType,
    disabled: Boolean,
    inputType: {
      type: String,
      default: "text",
    },
    placeholder: {
      type: String
    },
    maxlength: Number,
    // 文本行数
    number: Number,
    textareaProps: Object,
    inputProps: Object,
    // 下划线
    showSeparator: Boolean,
    separatorStyle: Object,
    onChangeText: Function,
    onEndEditing: Function,
    onSelect: Function,
  },
  setup() {
    return {};
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
.is-color-placeholder {
  color: #c6cdd2;
}
.is-color-value {
  color: #36444e;
  font-weight: 600;
}
.is-color-disabled {
  color: #86949e;
  font-weight: 600;
}
.is-color-invalid {
  font-weight: 400;
  color: #f05b5b;
}
.jh-cell {
  min-height: 54px;
  background-color: #ffffff;
  font-size: 14px;
  overflow: hidden;
  // 默认是row
  .column;
  .detail {
    flex: 1;
    display: flex;
    flex-direction: row;
    &.is-column {
      padding-top: 16px;
      min-height: 76px;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      .rightView {
        justify-content: flex-start;
        .inputView {
          .input,
          .textarea {
            text-align: left;
            justify-content: flex-start;
          }
        }
        .buttonView {
          text-align: left;
          justify-content: flex-start;
        }
      }
    }
    .leftView {
      .row-center;
      padding-left: 15px;
      .labelPrefix {
        width: 8px;
        height: 14px;
        color: #f4894c;
      }
      .label {
        font-size: 14px;
        color: #36444e;
        font-weight: 400;
      }
    }
    .rightView {
      flex: 1;
      display: flex;
      flex-direction: row;
      width: 100%;
      padding-left: 15px;
      padding-right: 15px;
      // 这里设置主要是input换行问题
      min-height: 46px;
      // 右边内容是靠左布局还是靠右开始布局
      justify-content: flex-end;
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
        font-size: 14px;
        color: #36444e;
      }
      .inputView {
        .row-center;
        justify-content: flex-end;
        width: 100%;
        text-align: right;
        .input,
        .textarea {
          flex: 1;
          text-align: right;
          outline-style: none;
          border: 0;
          font-size: 14px;
          .is-color-value;
          &::placeholder {
            font-weight: 400;
            .is-color-placeholder;
          }
          &.is-invalid,
          &.is-invalid::placeholder {
            .is-color-invalid;
          }
        }
        .textarea {
          resize: none;
          padding-top: 15px;
        }
      }
      .buttonView {
        .row-center;
        justify-content: flex-end;
        width: 100%;
        font-size: 14px;
        text-align: right;
        &.is-arrow {
          position: relative;
          padding-right: 16px;
          &::after {
            position: absolute;
            content: "";
            right: 0;
            top: 0;
            height: 100%;
            width: 16px;
            // TODO chenxiaoyong 需要设置图片
            background-image: url(../../assets/img/right_arrow.png);
            background-size: auto 11px;
            background-repeat: no-repeat;
            background-position: right center;
          }
        }
      }
    }
  }
  .separator {
    height: 1px;
    transform: scaleY(0.5);
    background-color: #e6e9ed;
    margin-left: 15px;
    margin-right: 15px;
    width: calc(100% - 30px);
  }
}
</style>
