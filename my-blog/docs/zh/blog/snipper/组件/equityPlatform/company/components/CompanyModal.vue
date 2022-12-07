<template>
   <el-dialog
    :title="navTitle"
    :visible="visible"
    width="500px"
    destroy-on-close
    :close-on-press-escape="false"
    center
    @close="cancel"
  >
    <div class="form-view">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        size="small"
        label-suffix=":"
        label-width="120px"
        class="form-content"
        inline
      >
        <el-col :span="24"  v-for="(it, index) in formKeys" :key="it.prop + index">
          <el-form-item
              class="form-item"
              v-bind="it"
            >
            <template v-if="it.formType === 'input'">
              <el-input v-bind="it" v-model="form[it.prop]" class="input-item"></el-input>
            </template>
            <template v-if="it.formType === 'uploadImage'">
              <z-upload
                :value.sync="form[it.prop]"
                :size="it.size"
                :limitKbSize="it.limitKbSize"
                :removeShow="!it.disabled"
              />
              <div class="upload-marker">
                {{ it.tips }}
              </div>
            </template>
            <template v-if="it.formType === 'select'">
              <el-select
                v-bind="it"
                v-model="form[it.prop]"
                class="select-item"
              >
                <el-option
                  v-for="(selectIt, selectIndex) in (it.isLink ? it.optionMap[form[it.linkKey]] : it.options)"
                  :key="selectIndex"
                  :label="selectIt.label"
                  :value="selectIt.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <div slot="footer" class="bottom-view">
      <el-button  size="small" @click="cancel" class="button" v-show="!isCheck">{{'取消'}}</el-button>
      <el-button type="primary" size="small" @click="onSubmit" class="button">{{ isCheck ? '返回' : '确认' }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import zUpload from '../../../../components/z-upload'
import { computed, defineComponent, onBeforeMount, reactive, toRefs, watch } from '@vue/composition-api'
import { cloneDeep, debounce, isEmpty } from 'lodash'
import { CompanyApi } from '../../../../api/equityPlatform'
import { initialForm, formKeys, initialRules } from '../config/companyModal'
import { Notification } from 'element-ui'
import jsCookie from 'js-cookie'

const Props = {
  visible: Boolean,
  modalType: String,
  data: [String, Number]
}
export default defineComponent({
  name: 'CompanyModal',
  props: Props,
  components: {
    zUpload
  },
  setup (props, { emit }) {
    const state = reactive({
      formRef: null,
      isCreate: computed(() => props.modalType === '0'),
      isEdit: computed(() => props.modalType === '1'),
      isCopy: computed(() => props.modalType === '2'),
      isCheck: computed(() => props.modalType === '3'),
      form: cloneDeep(initialForm),
      rules: cloneDeep(initialRules),
      formKeys: computed(() => cloneDeep(state.isCheck ? formKeys.map(it => ({ ...it, disabled: true })) : formKeys)),
      navTitle: computed(() => getNavTitle()),
      userInfo: computed(() => ({ operatorId: jsCookie.get('USER_ID'), operatorName: jsCookie.get('USER_NAME') }))
    })

    watch(() => [props.data, props.modalType], (val) => {
      const [companyId, modalType] = val || []
      if (companyId && ['1', '2'].some(key => key === modalType)) {
        requestDetail({ companyId })
      }
    })

    const requestDetail = async (params = {}) => {
      try {
        const res = await CompanyApi.detail(params)
        if (res.code === 0 && !isEmpty(res?.data)) {
          state.form = { ...res.data }
        }
      } catch (error) {
        console.log(error)
      }
    }

    const getNavTitle = () => {
      if (state.isCreate || state.isCopy) {
        return '新建企业'
      }
      if (state.isEdit) {
        return '修改企业'
      }
      if (state.isCheck) {
        return '查看企业'
      }
      return ''
    }

    const onSubmit = debounce(async () => {
      if (state.isCheck) {
        cancel()
        return
      }
      try {
        await checkForm()
        // 只有编辑才有id，新建拷贝都没有
        const params = {
          ...state.form,
          companyId: state.isEdit ? state.form.companyId : '',
          ...state.userInfo
        }

        const res = await CompanyApi.update(params, state.isEdit)
        if (res.code === 0) {
          Notification({
            title: '提示',
            type: 'success',
            duration: 2000,
            message: state.isEdit ? '保存成功' : '添加成功'
          })
          emit('ok')
          cancel()
        }
      } catch (error) {
        console.log(error)
      }
    }, 300)

    const checkForm = async () => {
      try {
        await state.formRef.validate()
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    }

    const cancel = () => {
      emit('cancel')
      resetFieldWithForm()
    }

    const resetFieldWithForm = () => {
      state.formRef && state.formRef.resetFields()
    }

    onBeforeMount(() => {
      resetFieldWithForm()
    })

    return {
      cancel,
      onSubmit,
      ...toRefs(state)
    }
  }
})
</script>

<style lang="scss" scoped>
  .form-view {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding: 16px 0;
    .form-content {
      flex: 1;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .form-item {
        display: flex;
        flex-direction: row;
        margin-bottom: 36px;
        /deep/ .el-form-item__content {
          width: 260px !important;
        }
        .input-item,.select-item,.checkBox{
          width: 100%;
        }
        .checkBox {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .upload-marker {
          font-size: 14px;
          color: #999;
        }
        .button {
          width: 80px;
          &:first-child {
            margin-left: 80px;
          }
        }
      }
    }
  }
  .bottom-view {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .button {
      width: 64px;
    }
  }
</style>
