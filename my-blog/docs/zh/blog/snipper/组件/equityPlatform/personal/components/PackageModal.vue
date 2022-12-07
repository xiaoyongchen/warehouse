<template>
   <el-dialog
    :title="navTitle"
    :visible.sync="visible"
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
        label-width="120px"
        class="form-content"
        inline
      >
        <el-col :span="12"  v-for="(it, index) in formKeys" :key="it.prop + index">
          <el-form-item
              class="form-item"
              v-bind="it"
            >
            <template v-if="it.formType === 'input'">
              <el-input v-bind="it" v-model="form[it.prop]" class="input-item"></el-input>
            </template>
            <template v-if="it.formType === 'datePicker'">
              <el-date-picker
                v-bind="it"
                v-model="form[it.prop]"
                class="date-picker-item"
              >
              </el-date-picker>
            </template>
          </el-form-item>
        </el-col>
      </el-form>
      <div class="table-view">
        <HeaderWithIndecate title="关联权益项目" :style="{ marginBottom: '16px' }"></HeaderWithIndecate>
        <el-table
          class="table"
          style="width: 70%"
          :data="tableData"
          row-key="benefitId"
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        >
        <el-table-column v-for="(tableIt, index) in column" v-bind="tableIt" :key="tableIt.prop" :index="index">
            <template #default="{ row }" v-if="['benefitName','benefitTotalNum','actions'].some(it => it === tableIt.prop)">
              <template v-if="tableIt.prop === 'benefitName'">
                <span v-show="row.compoundBenefitId">{{ row.benefitName }}</span>
                <el-input
                  v-bind="row"
                  v-model.trim="row.benefitName"
                  placeholder="请选择权益项"
                  size="mini"
                  :disabled="isCheck"
                  @focus="showModal(row.benefitId)"
                  style="width: 90%"
                  v-show="!row.compoundBenefitId"
                />
                <el-card size="small" v-show="row.visible" style="position: absolute; zIndex: 9999">
                  <div slot="header" class="clearfix">
                    <el-button style="float: right; padding: 0;" type="text" @click="dismissModal(row)">关闭</el-button>
                  </div>
                  <EquityOptionTable :filterTitle="row.benefitName" :filterData="tableData"  @ok="(selectRow) => onChangeWithEquityOption(selectRow, row)"/>
                </el-card>
              </template>
              <template v-if="tableIt.prop === 'benefitTotalNum'">
                <el-input-number
                  v-bind="row"
                  size="mini"
                  :min="-1"
                  v-model.trim="row.benefitTotalNum"
                  :disabled="isCheck"
                  v-show="!(row.children && row.children.length)"
                  placeholder="-1无限制"
                />
              </template>
              <template v-if="tableIt.prop === 'actions'">
                <el-button class="action-button" type="text" size="small"  :disabled="isCheck" @click="saveRow(row)" v-show="!isCheck && !row.isSave && !row.compoundBenefitId">保存</el-button>
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
      <el-button  size="small" @click="cancel" class="button" v-show="!isCheck">取消</el-button>
      <el-button type="primary" size="small" @click="onSubmit" class="button">{{ isCheck ? '返回' : '确认' }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import zUpload from '../../../../components/z-upload'
import { computed, defineComponent, onBeforeMount, reactive, toRefs, watch } from '@vue/composition-api'
import { cloneDeep, debounce, isEmpty, isArray, omit, isEqual } from 'lodash'
import { PackageApi, EquityManageApi } from '../../../../api/equityPlatform'
import { initialForm, formKeys, initialRules } from '../config/packageModal'
import { Message } from 'element-ui'
import moment from 'moment'
import HeaderWithIndecate from '../../components/HeaderWithIndecate.vue'
import EquityOptionTable from '../../components/EquityOptionTable.vue'
import Popconfirm from '../../../../components/Popconfirm.vue'
import jsCookie from 'js-cookie'

const Props = {
  visible: Boolean,
  modalType: String,
  data: [Object, String, Number]
}

const Column = [
  { prop: 'benefitName', width: 300, label: '权益项名称', align: 'center' },
  { prop: 'benefitTotalNum', label: '数量', align: 'center' },
  { prop: 'actions', label: '操作', width: 120, align: 'center' }
]

export default defineComponent({
  name: 'PackageModal',
  props: Props,
  components: {
    zUpload,
    HeaderWithIndecate,
    EquityOptionTable,
    Popconfirm
  },
  setup (props, { emit }) {
    const state = reactive({
      isCreate: computed(() => props.modalType === '0'),
      isEdit: computed(() => props.modalType === '1'),
      isCopy: computed(() => props.modalType === '2'),
      isCheck: computed(() => props.modalType === '3'),
      formRef: null,
      column: Column,
      tableData: [],
      // 用于对比数据
      comparativeTableData: [],
      form: cloneDeep(initialForm),
      rules: cloneDeep(initialRules),
      formKeys: computed(() => cloneDeep(state.isCheck ? formKeys.map(it => ({ ...it, disabled: true })) : formKeys)),
      navTitle: computed(() => getNavTitle()),
      userInfo: computed(() => ({ operatorId: jsCookie.get('USER_ID'), operatorName: jsCookie.get('USER_NAME') }))
    })

    // 请求接口
    watch(() => props.data, (comboId) => {
      if (comboId) {
        requestPackageDetail({ comboId })
      }
    })

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
                return it.compoundBenefitId === compoundBenefitId
              })
              return children
            }

            if (list?.length) {
              // 复合权益数组
              const compoundBenefitIds = list.filter(it => !!it.compoundBenefitId)?.map(it => it.compoundBenefitId)
              const table = list.map(it => {
                // 复合权益的childen
                if (it.compoundBenefitId) {
                  return false
                }
                // 复合权益的父类
                if (compoundBenefitIds.some(i => i === it.benefitId)) {
                  it = { ...it, benefitUseType: 2, visible: false, compoundFlag: 1, children: getChildren(cloneDeep(list), it.benefitId) }
                  return it
                }
                // 复合权益的childen
                if (it.compoundBenefitId) {
                  return null
                }
                // 不是复合权益, benefitTotalNum：-1 or > 0 不可以编辑
                it = { ...it, benefitUseType: 2, visible: false, compoundFlag: 0 }
                return it
              }) || [{ visible: false, isSave: false, benefitId: '0' }]
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

    const getNavTitle = () => {
      if (state.isCreate || state.isCopy) {
        return '新增个人套餐'
      }
      if (state.isEdit) {
        return '编辑个人套餐'
      }
      if (state.isCheck) {
        return '查看个人套餐'
      }
      return ''
    }

    const getTimes = (time = {}) => {
      if (isArray(time) && time?.length > 0) {
        const [first, sconde] = time
        return [moment(first).format('YYYY-MM-DD HH:mm:ss'), moment(sconde).endOf('day').format('YYYY-MM-DD HH:mm:ss')]
      }
      return []
    }

    /**
     * 新增table空数据
     */
    const addEquityOptions = () => {
      // 新增数组空对象
      if (!state.tableData?.length) {
        state.tableData = [{ benefitId: '0', benefitName: '', benefitTotalNum: null, isSave: false, visible: false, benefitUseType: 2 }]
        return
      }
      // 这里判断要优化下
      const pass = state.tableData.every(it => it.isSave)
      if (!pass) {
        Message.error('权益项数据未保存')
        return
      }
      // 存在，push
      state.tableData = [...state.tableData, ...[{ benefitId: '0', benefitName: '', benefitTotalNum: null, isSave: false, visible: false, benefitUseType: 2 }]]
    }

    // 设置当前选项
    const onChangeWithEquityOption = (selectRow = {}, row = {}) => {
      if (!isEmpty(selectRow)) {
        // 重置单前项目， 这里有compoundFlag字段
        const tableData = cloneDeep(state.tableData) || []
        const list = tableData.map(it => {
          if (it.benefitId === row.benefitId) {
            it = { ...it, ...selectRow, visible: false, benefitTotalNum: 0, isSave: false, benefitUseType: 2 }
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
                return { ...i, benefitTotalNum: 0, benefitUseType: 2, compoundBenefitId: benefitId }
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
      if (row.benefitId === '0') {
        pass = false
        warningTitle = '请选择权益项目'
        Message.error(warningTitle)
        return
      }
      const tableData = cloneDeep(state.tableData || [])
      const list = tableData?.map(it => {
        if (it.benefitId !== row.benefitId) {
          return it
        }
        const hasChildren = it?.children?.length
        // 判断是否是父节点, 并且有子节点
        // 有父节点，有子节点
        if (hasChildren) {
          // 有值，保留操作，判断benefitTotalNumy有值为true，此时为子children的和
          const hasNum = it.children.every(i => {
            return !!i.benefitTotalNum
          })

          if (!hasNum) {
            it.save = false
            pass = false
            warningTitle = '权益子项数量不正确'
            return it
          }

          const notLimit = it.children.some(it => it.benefitTotalNum === -1)
          if (notLimit) {
            it.benefitTotalNum = -1
            it.isSave = true
            return it
          }

          it.benefitTotalNum = it.children?.reduce((sum, i) => {
            sum += i.benefitTotalNum || 0
            return sum
          }, 0)
          it.isSave = hasNum
          return it
        }

        // 有父节点，没有子节点
        it.isSave = !!it.benefitTotalNum
        pass = !!it.benefitTotalNum
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
        // 需要传一个comboActivationMode 激活方式：默认1，兼容
        const params = {
          ...state.form,
          comboActivationMode: 1,
          ...state.userInfo
        }

        // 编辑情况以及table的数组跟初始化数组不一致
        const notEqualTable = !isEqual(state.tableData, state.comparativeTableData) && state.isEdit

        // 设置权益项
        let pass = true
        let warningTitle = '权益项数量不正确'
        if (state.tableData.length) {
          // 过滤有效的table, 是编辑过后的
          const list = state.tableData.map(it => {
            if (it.benefitId === '0') {
              pass = false
              warningTitle = '请选择权益项目'
              return it
            }
            const childrenFilter = it?.children?.filter(it => {
              return !!it.benefitTotalNum
            })
            if (it.children?.length > 0 && childrenFilter?.length !== it.children?.length) {
              pass = false
              warningTitle = '权益子项数量不正确'
              return it
            }
            it.children = childrenFilter || []
            const hasChildren = it?.children?.length
            // 设置值
            if (hasChildren) {
              const notLimit = it.children.some(it => it.benefitTotalNum === -1)
              if (notLimit) {
                it.benefitTotalNum = -1
                return it
              }
              it.benefitTotalNum = it.children?.reduce((sum, i) => {
                sum += i.benefitTotalNum || 0
                return sum
              }, 0)
              return it
            }
            pass = it.benefitTotalNum
            return it
          }) || []
          // 组合数据
          if (list?.length) {
            const comboBenefits = list.reduce((sumArray, i) => {
              // 遍历
              if (i.children?.length) {
                const list = i.children?.map(j => ({ ...j, benefitUseType: 2, compoundBenefitId: i.benefitId }))
                sumArray = [...sumArray, ...list]
              }
              // 个人共享写死
              sumArray = [...sumArray, ...[{ ...i, benefitUseType: 2 }]]
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
        // 新建 拷贝都是新建
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
      deleteRow,
      saveRow,
      showModal,
      dismissModal,
      addEquityOptions,
      onChangeWithEquityOption,
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
    .table {
      margin-top: 16px;
      overflow: visible !important;
      /deep/ .el-table__body-wrapper {
          overflow: visible !important;
        }
    }
    .input-item {
      /deep/ .el-form-item__content {
        width: 460px !important;
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
        margin-bottom: 36px;
        /deep/ .el-form-item__content {
          width: 260px !important;
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
</style>
