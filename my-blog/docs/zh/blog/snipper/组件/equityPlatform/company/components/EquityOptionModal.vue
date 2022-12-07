<template>
  <el-dialog
   :title="navTitle"
   :visible="visible"
   width="900px"
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
       label-width="130px"
       class="form-content"
       inline
     >
       <el-col
        :span="it.span || 12"
        v-for="(it, index) in formKeys"
        :key="it.prop + index"
        v-show="!(typeof it.hidden === 'function' ? it.hidden(form) : it.hidden)"
      >
         <el-form-item
             class="form-item"
             v-bind="it"
           >
           <template v-if="it.formType === 'input'">
             <el-input v-bind="it" v-model="form[it.prop]" class="input-item"></el-input>
           </template>
           <template v-if="it.formType === 'radio'">
              <el-radio-group
                v-model="form[it.prop]"
                :disabled="it.disabled"
              >
                <el-radio
                  v-for="radioIt in it.options"
                  :key="radioIt.label"
                  :label="radioIt.label"
                  >
                  {{ radioIt.title }}
                </el-radio>
              </el-radio-group>
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
           <template v-if="it.formType === 'datePicker'">
             <el-date-picker
               v-bind="it"
               v-model="form[it.prop]"
               class="date-picker-item"
             >
             </el-date-picker>
           </template>
           <template v-if="it.formType === 'text'">
             <span>{{ form[it.prop]}}</span>
           </template>
         </el-form-item>
       </el-col>
     </el-form>
     <div class="table-view">
        <HeaderWithIndecate title="关联权益项目" :style="{ marginBottom: '16px' }"></HeaderWithIndecate>
        <el-table
          class="table"
          style="width: 100%"
          :data="tableData"
          default-expand-all
          row-key="benefitId"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        >
        <el-table-column v-for="(tableIt, index) in column" v-bind="tableIt" :key="tableIt.prop" :index="index">
            <template #default="{ row }" v-if="['benefitName','benefitTotalNum','benefitWarnNum','benefitUseType','actions'].some(it => it === tableIt.prop)">
              <template v-if="tableIt.prop === 'benefitName'">
                <span v-show="row.compoundBenefitId">{{ row.benefitName }}</span>
                <el-input
                  v-bind="row"
                  v-model.trim="row.benefitName"
                  placeholder="请选择权益项"
                  size="mini"
                  :disabled="isCheck"
                  style="width: 90%"
                  @focus="showModal(row.benefitId)"
                  v-show="!row.compoundBenefitId"
                />
                <el-card size="small" v-show="row.visible" style="position: absolute; zIndex: 9999">
                  <div slot="header" class="clearfix">
                    <el-button style="float: right; padding: 0;" type="text" @click="dismissModal(row)">关闭</el-button>
                  </div>
                  <EquityOptionTable  :filterTitle="row.benefitName" :filterData="tableData" @ok="(selectRow) => onChangeWithEquityOption(selectRow, row)"/>
                </el-card>
              </template>
              <template v-if="tableIt.prop === 'benefitTotalNum'">
                <el-input-number
                  v-bind="row"
                  v-model.trim="row.benefitTotalNum"
                  size="mini"
                  :min="-1"
                  :disabled="isCheck"
                  v-show="!(row.children && row.children.length)"
                  placeholder="-1无限制"
                />
              </template>
              <template v-if="tableIt.prop === 'benefitWarnNum'">
                <el-input-number
                  v-bind="row"
                  v-model.trim="row.benefitWarnNum"
                  size="mini"
                  v-show="!row.compoundBenefitId && !getWarningNumberHidden(row)"
                  :disabled="isCheck"
                />
              </template>
              <template v-if="tableIt.prop === 'benefitUseType'">
                <el-select
                  v-bind="row"
                  v-model="row.benefitUseType"
                  placeholder="请选择权益享受方式"
                  clearable
                  size="mini"
                  :disabled="isCheck"
                  v-show="!row.compoundBenefitId"
                >
                  <el-option
                    v-for="(selectIt, selectIndex) in benefitUseTypeOptions"
                    :key="selectIndex"
                    :label="selectIt.label"
                    :value="selectIt.value"
                  >
                  </el-option>
                </el-select>
              </template>
              <template v-if="tableIt.prop === 'actions'">
                <el-button class="action-button" type="text" size="small" :disabled="isCheck" @click="saveRow(row)" v-show="!isCheck && !row.isSave && !row.compoundBenefitId">保存</el-button>
                <Popconfirm
                  title="是否确认删除？"
                  @confirm="deleteRow(row, row.compoundBenefitId)"
                >
                  <el-button class="action-button" slot="reference" type="text" size="small" :disabled="isCheck" v-show="!isCheck && !row.compoundBenefitId">删除</el-button>
                </Popconfirm>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" size="small" @click="addEquityOptions" class="add-button" v-show="!isCheck">新增</el-button>
      </div>
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
import { cloneDeep, debounce, isEmpty, omit, isArray, isEqual } from 'lodash'
import { EquityManageApi, PackageApi } from '../../../../api/equityPlatform'
import { initialForm, formKeys, initialRules } from '../config/equityOptionModal'
import { Message } from 'element-ui'
import { getRandomWord } from '../../../../utils/stringUtils'
import HeaderWithIndecate from '../../components/HeaderWithIndecate.vue'
import moment from 'moment'
import EquityOptionTable from '../../components/EquityOptionTable.vue'
import Popconfirm from '../../../../components/Popconfirm.vue'
import jsCookie from 'js-cookie'

const Props = {
  visible: Boolean,
  modalType: String,
  companyId: String,
  data: [Object, String, Number]
}

const Column = [
  { prop: 'benefitName', label: '权益项名称', align: 'center' },
  { prop: 'benefitTotalNum', label: '数量', width: 140, align: 'center' },
  { prop: 'benefitWarnNum', label: '预警数量', width: 140, align: 'center' },
  { prop: 'benefitUseType', label: '权益分配规则', width: 140, align: 'center' },
  { prop: 'actions', label: '操作', width: 120, align: 'center' }
]

export default defineComponent({
  name: 'EquityOptionModal',
  props: Props,
  components: {
    zUpload,
    HeaderWithIndecate,
    EquityOptionTable,
    Popconfirm
  },
  setup (props, { emit }) {
    const state = reactive({
      formRef: null,
      column: Column,
      isCreate: computed(() => props.modalType === '0'),
      isEdit: computed(() => props.modalType === '1'),
      isCopy: computed(() => props.modalType === '2'),
      isCheck: computed(() => props.modalType === '3'),
      // eslint-disable-next-line no-use-before-define
      form: cloneDeep({ ...initialForm, companyReferralCode: getRandomWord(6) }),
      rules: cloneDeep(initialRules),
      formKeys: computed(() => cloneDeep(state.isCheck ? formKeys.map(it => ({ ...it, disabled: true })) : formKeys)),
      navTitle: computed(() => getNavTitle()),
      benefitUseTypeOptions: [
        {
          value: 1,
          label: '企业共享'
        },
        {
          value: 2,
          label: '个人独享'
        }],
      tableData: [],
      // 用于对比数据，编辑的时候是否调用权益接口
      comparativeTableData: [],
      userInfo: computed(() => ({ operatorId: jsCookie.get('USER_ID'), operatorName: jsCookie.get('USER_NAME') }))
    })

    // 设置rules
    watch(() => state.form?.comboActivationMode, (comboActivationMode) => {
      const companyMailSuffixItem = state.rules?.companyMailSuffix?.map(it => ({ ...it, required: comboActivationMode === 2 }))
      state.rules = { ...state.rules, companyMailSuffix: companyMailSuffixItem }
    })

    watch(() => [props.data, props.modalType], (val) => {
      const [comboId, modalType] = val || []
      if (comboId && ['1', '2', '3'].some(key => key === modalType)) {
        requestPackageDetail({ comboId })
      }
    })

    /**
     * 预警值组件是否显示
     * 无children， -1无限制不显示,children有一个为-1
     * @param {*} row
     */
    const getWarningNumberHidden = (row = {}) => {
      const children = row.children || []
      if (children?.length) {
        const hidden = children.some(it => it.benefitTotalNum === -1)
        return hidden
      }
      return row.benefitTotalNum === -1
    }

    /**
     * 请求套餐详情
     * 需要设置table的数据源
     * @param {*} params { comboId }
     */
    const requestPackageDetail = async (params) => {
      try {
        const res = await PackageApi.detail(params)
        if (res.code === 0 && !isEmpty(res?.data)) {
          state.form = {
            ...state.form,
            ...(res.data?.effectBeginTime && res.data?.effectEndTime && { time: [moment(res.data?.effectBeginTime).format('YYYY-MM-DD HH:mm:ss'), moment(res.data?.effectEndTime).format('YYYY-MM-DD HH:mm:ss')] }),
            ...omit(res.data, ['benefitResults'])
          }
          // 设置table
          if (res.data?.benefitResults?.length) {
            // 需要判断套餐可用
            const list = res.data.benefitResults
            const getChildren = (arr, compoundBenefitId = '') => {
              if (!arr?.length) {
                return []
              }
              // 判断是否可以用
              const children = arr.filter(it => {
                it = { ...it }
                return it.compoundBenefitId === compoundBenefitId
              })
              return children
            }

            if (list?.length) {
              // 复合权益数组
              const compoundBenefitIds = list.filter(it => !!it.compoundBenefitId)?.map(it => it.compoundBenefitId)
              const table = list.map(it => {
                // 复合权益的父类
                if (compoundBenefitIds.some(i => i === it.benefitId)) {
                  it = { ...it, benefitUseType: it.benefitUseType, isSave: false, visible: false, compoundFlag: 1, children: getChildren(cloneDeep(list), it.benefitId) }
                  return it
                }
                // 子权益
                if (it.compoundBenefitId) {
                  return null
                }
                // 并且benfitId !== compoundBenefitId
                it = { ...it, visible: false, isSave: false, compoundFlag: 0 }
                return it
              }) || [{ visible: false, isSave: false, companyId: '0' }]
              // 这里要深拷贝，要不然后面对比有问题
              state.tableData = cloneDeep(table.filter(Boolean))
              state.comparativeTableData = cloneDeep(table.filter(Boolean))
            }
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    /**
     * 新增table空数据
     */
    const addEquityOptions = () => {
      // 新增数组空对象
      if (!state.tableData?.length) {
        state.tableData = [{ benefitId: '0', benefitName: '', benefitTotalNum: null, benefitWarnNum: null, isSave: false, visible: false, benefitUseType: null }]
        return
      }
      const pass = state.tableData.every(it => it.isSave)
      if (!pass) {
        Message.error('权益项数据未保存')
        return
      }
      // 存在，push
      state.tableData = [...state.tableData, ...[{ benefitId: '0', benefitName: '', benefitTotalNum: null, benefitWarnNum: null, isSave: false, visible: false, benefitUseType: null }]]
    }

    // 设置当前选项
    const onChangeWithEquityOption = (selectRow = {}, row = {}) => {
      if (!isEmpty(selectRow)) {
        // 重置单前项目， 这里有compoundFlag字段
        const tableData = cloneDeep(state.tableData) || []
        const list = tableData.map(it => {
          if (it.benefitId === row.benefitId) {
            it = { ...it, ...selectRow, visible: false, isSave: false }
          }
          return it
        })
        // 复合权益
        if (selectRow.compoundFlag === 1) {
          requestEquityDetail(selectRow.benefitId, list)
          return
        }
        state.tableData = list
      }
    }

    // 复合权益，需要设置table的children ,字段为compoundBenefits
    const requestEquityDetail = async (benefitId = '', list = []) => {
      try {
        const res = await EquityManageApi.detail({ benefitId })
        if (res.code === 0 && !isEmpty(res.data)) {
          const tableData = list.map(it => {
            if (it.benefitId === benefitId) {
              const children = res.data?.compoundBenefits || []
              it.children = children.map(i => {
                return { ...i, compoundBenefitId: benefitId }
              })
            }
            return it
          })
          state.tableData = tableData
        }
      } catch (error) {
        console.log(error)
      }
    }

    /**
     * 设置row里面的编辑状态
     * 设置tableRow数据源
     * todo 判断是否是子表
     */
    const saveRow = (row) => {
      // 判断数据源，判断是否是子表
      let pass = true
      let warningTitle = '权益项数量不正确'
      if (row.benefitId === '0' || !row.benefitUseType) {
        warningTitle = !row.benefitName ? '请选择权益项目' : !row.benefitUseType ? '请选择权益享受方式' : '权益项数量不正确'
        Message.error(warningTitle)
        return
      }
      const tableData = cloneDeep(state.tableData || [])
      const list = tableData?.map(it => {
        if (it.benefitId !== row.benefitId) {
          return it
        }
        const hasChildren = it?.children?.length
        if (hasChildren) {
          // 有值，保留操作，判断benefitTotalNumy有值为true，此时为子children的和
          const hasNum = row.children.every(i => {
            return !!i.benefitTotalNum
          })

          if (!hasNum) {
            it.save = false
            pass = false
            warningTitle = '权益子项数据不正确'
            return it
          }

          // 设置总数量数据
          const notLimit = it.children.some(it => it.benefitTotalNum === -1)
          if (notLimit) {
            it.benefitTotalNum = -1
            it.benefitWarnNum = null
            it.isSave = true
            return it
          }
          it.benefitTotalNum = it.children?.reduce((sum, i) => {
            sum += i.benefitTotalNum || 0
            return sum
          }, 0)

          if (it.benefitWarnNum && it.benefitWarnNum > it.benefitTotalNum) {
            it.benefitWarnNum = null
            it.isSave = false
            pass = false
            warningTitle = '预警数量不能大于总数量'
            return it
          }
          it.isSave = hasNum
          return it
        }

        // 当个权益
        if (it.benefitWarnNum && (it.benefitTotalNum !== -1 && it.benefitWarnNum > it.benefitTotalNum)) {
          it.benefitWarnNum = null
          it.isSave = false
          pass = false
          warningTitle = '预警数量不能大于总数量'
          return it
        }

        // 没有children
        if (it.benefitTotalNum === -1) {
          it.isSave = true
          it.benefitWarnNum = null
          return it
        }

        pass = it.benefitTotalNum
        it.isSave = it.benefitTotalNum
        return it
      })

      if (!pass) {
        Message.error(warningTitle)
        return
      }
      state.tableData = list
    }

    /**
     * 删除tableRow数据源
     */
    const deleteRow = (row, compoundBenefitId = '') => {
      if (!isEmpty(row)) {
        if (compoundBenefitId) {
          const list = state.tableData.filter(it => it.benefitId !== compoundBenefitId) || []
          state.tableData = list
          return
        }
        const list = state.tableData.filter(it => it.benefitId !== row.benefitId) || []
        state.tableData = list
      }
    }

    // 设置modal的visible
    const showModal = (benefitId) => {
      const list = state.tableData?.map(it => {
        if (it.benefitId === benefitId) {
          it.visible = true
        }
        return it
      })
      state.tableData = list
    }

    const dismissModal = (row = {}) => {
      if (!isEmpty(row)) {
        const list = state.tableData.map(it => {
          if (it.benefitId === row.benefitId) {
            it.visible = false
          }
          return it
        })
        state.tableData = list
      }
    }

    const getNavTitle = () => {
      if (state.isCreate || state.isCopy) {
        return '新增权益项'
      }
      if (state.isEdit) {
        return '编辑权益项'
      }
      if (state.isCheck) {
        return '查看权益项'
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
        const [effectBeginTime = '', effectEndTime = ''] = getTimes(state.form.time) || []
        state.form.effectBeginTime = effectBeginTime
        state.form.effectEndTime = effectEndTime
        const params = {
          ...state.form,
          companyId: props.companyId || '',
          ...state.userInfo
        }

        // 编辑情况以及table的数组跟初始化数组不一致
        const notEqualTable = !isEqual(state.tableData, state.comparativeTableData) && state.isEdit

        let warningTitle = '权益项数据不完整'
        let pass = true
        // 设置权益项
        if (state.tableData.length) {
          // 过滤有效的table, 是编辑过后的
          const list = state.tableData.map(it => {
            // benefitTotalNum是需要计算的，所以不一起判断
            if (!it.benefitUseType || it.benefitId === '0') {
              pass = false
              warningTitle = it.benefitId === '0' ? '请选择权益项目' : !it.benefitUseType ? '请选择权益享受方式' : '权益项数据不完整'
              return it
            }
            const childrenFilter = it?.children?.filter(i => {
              i.benefitUseType = it.benefitUseType
              return !!i.benefitTotalNum
            })
            // 复合权益子项没有设置
            if (it.children?.length > 0 && it.children?.length !== childrenFilter?.length) {
              pass = false
              warningTitle = '权益子项数据不完整'
              return it
            }

            // 复合权益，子项都有数据
            it.children = childrenFilter || []
            const hasChildren = it?.children?.length
            if (hasChildren) {
              const notLimit = it.children.some(it => it.benefitTotalNum === -1)
              if (notLimit) {
                it.benefitTotalNum = -1
                it.benefitWarnNum = null
                return it
              }
              // benefitWarnNum 不能大于复合权益总数量
              it.benefitTotalNum = it.children?.reduce((sum, i) => {
                sum += i.benefitTotalNum || 0
                return sum
              }, 0)
              if (it.benefitWarnNum && it.benefitWarnNum > it.benefitTotalNum) {
                it.benefitWarnNum = null
                pass = false
                warningTitle = '预警数量不能大于总数量'
                return it
              }

              pass = it.benefitTotalNum
              return it
            }

            // 不是复合权益
            if (it.benefitTotalNum === -1) {
              it.benefitWarnNum = null
              return it
            }

            if (it.benefitWarnNum && (it.benefitTotalNum !== -1 && it.benefitWarnNum > it.benefitTotalNum)) {
              it.benefitWarnNum = null
              warningTitle = '预警数量不能大于总数量'
              pass = false
              return it
            }

            pass = !!it.benefitTotalNum
            return it
          }) || []
          // 组合数据
          if (list?.length) {
            const comboBenefits = list.reduce((sumArray, i) => {
              // 遍历
              if (i.children?.length) {
                const list = i.children?.map(j => ({ ...j, compoundBenefitId: i.benefitId }))
                sumArray = [...sumArray, ...list]
              }
              sumArray = [...sumArray, ...[{ ...i }]]
              return sumArray
            }, [])
            params.comboBenefits = comboBenefits
          }
        }
        if (!pass) {
          Message.error(warningTitle)
          return
        }

        if (notEqualTable) {
          PackageApi.modifyRelation(params)
        }
        const res = await PackageApi.update(params, state.isEdit)
        if (res.code === 0) {
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

    const getTimes = (time = {}) => {
      if (isArray(time) && time?.length > 0) {
        const [first, sconde] = time
        return [moment(first).format('YYYY-MM-DD HH:mm:ss'), moment(sconde).endOf('day').format('YYYY-MM-DD HH:mm:ss')]
      }
      return []
    }

    const cancel = () => {
      emit('cancel')
      state.tableData = []
      state.comparativeTableData = []
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
      ...toRefs(state),
      saveRow,
      deleteRow,
      showModal,
      dismissModal,
      addEquityOptions,
      onChangeWithEquityOption,
      getWarningNumberHidden
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

   .table {
      margin-top: 16px;
      overflow: visible;
      /deep/ .el-table__body-wrapper {
        overflow: visible !important;
      }
    }
   .add-button {
      margin-top: 16px;
    }
   .form-content {
     flex: 1;
     display: flex;
     flex-direction: row;
     flex-wrap: wrap;
     .form-item {
       display: flex;
       flex-direction: row;
       margin-bottom: 16px;
       /deep/ .el-form-item__content {
         width: 260px !important;
       }

       &.custom {
        /deep/ .el-form-item__content {
          width: 460px !important;
        }
       }
       .input-item,.select-item,.checkBox,.date-picker-item{
         width: 100%;
       }
       .date-picker-item {
         /deep/.el-range-separator  {
           width: 20px !important;
         }
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
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
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
 .table {
  overflow: visible !important;
  /deep/ .el-table__body-wrapper {
      overflow: visible !important;
    }
 }
</style>
