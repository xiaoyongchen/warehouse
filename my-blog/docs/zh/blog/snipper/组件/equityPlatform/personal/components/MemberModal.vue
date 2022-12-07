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
              <el-input v-bind="it" v-model.trim="form[it.prop]" class="input-item"></el-input>
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
import { computed, defineComponent, onBeforeMount, reactive, toRefs } from '@vue/composition-api'
import { cloneDeep, debounce } from 'lodash'
import { MemberApi } from '../../../../api/equityPlatform'
import { initialForm, formKeys, initialRules } from '../config/memberModal'
import { Notification } from 'element-ui'

const Props = {
  visible: Boolean,
  modalType: String,
  data: [Object, String, Number]
}
export default defineComponent({
  name: 'MemberModal',
  props: Props,
  components: {
    zUpload
  },
  setup (props, { emit }) {
    const state = reactive({
      isCreate: computed(() => props.modalType === '0'),
      isEdit: computed(() => props.modalType === '1'),
      isCopy: computed(() => props.modalType === '2'),
      isCheck: computed(() => props.modalType === '3'),
      formRef: null,
      form: cloneDeep(initialForm),
      rules: cloneDeep(initialRules),
      formKeys: computed(() => cloneDeep(state.isCheck ? formKeys.map(it => ({ ...it, disabled: true })) : formKeys)),
      navTitle: computed(() => getNavTitle())
    })

    const getNavTitle = () => {
      if (state.isCreate || state.isCopy) {
        return '新增员工'
      }
      if (state.isEdit) {
        return '编辑员工'
      }
      if (state.isCheck) {
        return '查看员工'
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
        const params = {
          comboId: props.data,
          list: [{ ...state.form }]
        }
        const res = await MemberApi.updatePersonalMember(params)
        if (res.code === 0) {
          Notification({
            title: '提示',
            type: 'success',
            duration: 2000,
            message: '添加成功'
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
        .input-item,.select-item,.checkBox,.date-picker-item{
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
