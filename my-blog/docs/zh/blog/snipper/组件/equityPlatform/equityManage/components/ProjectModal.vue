<template>
  <el-dialog
   title="优惠券项目范围设置"
   :visible.sync="visible"
   width="900px"
   destroy-on-close
   :close-on-press-escape="false"
   append-to-body
   @close="cancel"
  >
    <div class="form-view">
      <HeaderWithIndecate title="Promotion信息" />
      <el-row type="flex" justify="space-between" style="margin: 16px 0;" v-show="promotion">
        <el-col :span="6">promotion：{{ promotion && promotion.promotionCode }}</el-col>
        <el-col :span="9">promotion名称：{{ promotion && promotion.promotionName }}</el-col>
        <el-col :span="9">promotion有效期：{{ promotion && promotion.effectiveTime }}</el-col>
      </el-row>
      <el-row style="margin: 16px 0 8px 0;">
        <HeaderWithIndecate title="选择项目" :style="{ marginBottom: '16px' }"/>
      </el-row>
      <HeaderForm
        :form="form"
        :labelWidth="0"
        :formKeys="formKeys"
        @reset="reset"
        @search="search"
      />
      <el-col style="margin: 0 0 8px 0">
        已选项目：<span>{{selectedData && selectedData.length ? selectedData.length : 0}}&nbsp;</span>个项目
      </el-col>
      <el-table
        ref="multipleTable"
        class="table"
        row-key="projectId"
        :data="computedTableData"
        style="width: 100%"
        @select="selectSingle"
        @select-all="selectAll"
      >
        <el-table-column v-for="(tableIt, index) in column" v-bind="tableIt" :key="tableIt.prop" :index="index">
            <template #default="{ row }" v-if="['isVaild'].some(it => it === tableIt.prop)">
              <span>{{ row.isVaild}}</span>
            </template>
        </el-table-column>
      </el-table>
      <div class="text-c mt-10">
        <el-pagination
          background
          @size-change="changeSize"
          @current-change="changeCurrent"
          :current-page="pagination.currentPage || 1"
          :page-sizes="[10, 20, 30, 40, 50, 100, 500]"
          layout="total, prev, pager, next, sizes, jumper"
          :total="tableData && tableData.length ? tableData.length : 0">
        </el-pagination>
      </div>
   </div>
   <div slot="footer">
     <el-button  size="small" @click="cancel" class="button" v-show="!isCheck">{{'取消'}}</el-button>
     <el-button type="primary" size="small" @click="onSubmit" class="button">{{ isCheck ? '返回' : '确认' }}</el-button>
   </div>
 </el-dialog>
</template>

<script>
import zUpload from '../../../../components/z-upload'
import { computed, defineComponent, reactive, toRefs, watch, nextTick } from '@vue/composition-api'
import { debounce, cloneDeep } from 'lodash'
import HeaderWithIndecate from '../../components/HeaderWithIndecate.vue'
import HeaderForm from '../../../../components/HeaderForm.vue'
import { FormKeys, Column } from '../config/projectModal'
import { Message } from 'element-ui'

const Props = {
  visible: Boolean,
  modalType: String,
  promotion: {
    type: Object
  },
  data: Array,
  filterData: Array
}

const initialForm = { projectType: null, keyword: '' }
const initialPagination = { pageSize: 10, currentPage: 1 }

export default defineComponent({
  name: 'ProjectModal',
  props: Props,
  components: {
    zUpload,
    HeaderForm,
    HeaderWithIndecate
  },
  setup (props, { emit }) {
    const state = reactive({
      multipleTable: null,
      formKeys: FormKeys,
      column: Column,
      formRef: null,
      form: cloneDeep(initialForm),
      pagination: cloneDeep(initialPagination),
      isCreate: computed(() => props.modalType === '0'),
      isEdit: computed(() => props.modalType === '1'),
      isCopy: computed(() => props.modalType === '2'),
      isCheck: computed(() => props.modalType === '3'),
      tableData: [],
      computedTableData: computed(() => {
        if (state.tableData && state.tableData.length) {
          const filterTableDate = state.tableData.slice((state.pagination.currentPage - 1) * state.pagination.pageSize, state.pagination.currentPage * state.pagination.pageSize)
          return filterTableDate
        }
        return []
      }),
      selectedData: [] // 选择的项目数组
    })

    // 初始化tableData, 设置checkBox的值
    watch(() => [props.data, props.filterData, props.visible], (val = []) => {
      const [tableData = [], selectedData = []] = val
      state.tableData = tableData
      state.selectedData = selectedData
    })

    watch(() => [state.computedTableData, state.selectedData], (val = []) => {
      const [filterTableDate, selectedData] = val
      if (selectedData.length && filterTableDate.length) {
        // 找到在当前list的selectBox
        const list = filterTableDate.filter(it => {
          const isSome = selectedData.some(i => i.projectId === it.projectId)
          return isSome
        })
        nextTick(() => {
          list.length && list.forEach(row => {
            // eslint-disable-next-line no-unused-expressions
            state.multipleTable?.toggleRowSelection(row, true)
          })
        })
      }
    }, { deep: true })

    // 重置
    const reset = () => {
      state.form = cloneDeep(initialForm)
      state.pagination = cloneDeep(initialPagination)
      state.tableData = props.data
    }

    // 搜索
    const search = () => {
      state.pagination = cloneDeep(initialPagination)
      if (state.form.keyword || state.form.projectType) {
        // 过滤
        const list = props.data.filter(item => {
          const inputFlag = (item.projectId.indexOf(state.form.keyword) > -1) || (item.projectName.indexOf(state.form.keyword) > -1)
          const selectFalg = state.form.projectType ? state.form.projectType === item.projectType : true
          return inputFlag && selectFalg
        })

        state.tableData = list
        return
      }
      state.tableData = props.data
    }

    const changeSize = (pageSize = 10) => {
      state.pagination = { ...state.pagination, pageSize, currentPage: 1 }
    }
    const changeCurrent = (currentPage = 1) => {
      state.pagination = { ...state.pagination, currentPage }
    }

    // 切换current 会默认调用一次, 数据源是当前分页的tableSlice
    const selectSingle = (selection = [], row = {}) => {
      const isSelect = selection?.some(it => it.projectId === row.projectId)
      // 选择
      if (isSelect) {
        const isSome = state.selectedData?.some(it => it.projectId === row.projectId)
        if (!isSome) {
          state.selectedData = [...state.selectedData, ...[row]]
        }
        return
      }

      // 取消
      const selectedData = state.selectedData?.filter(it => it.projectId !== row.projectId)
      state.selectedData = selectedData
    }

    const selectAll = (selection) => {
      // 取消全部
      if (!selection?.length) {
        const selectedData = state.selectedData?.filter(it => {
          const inside = state.computedTableData?.some(i => i.projectId === it.projectId)
          return !inside
        })
        state.selectedData = selectedData
        return
      }

      // 添加
      if (!state.selectedData?.length) {
        state.selectedData = selection
        return
      }

      // 添加缓存中不存在的。
      const filterTableList = selection?.filter(it => {
        const inside = state.selectedData.some(i => i.projectId === it.projectId)
        return !inside
      })
      state.selectedData = [...state.selectedData, ...filterTableList]
    }

    const onSubmit = debounce(async () => {
      if (state.isCheck) {
        cancel()
        return
      }
      if (!state.selectedData?.length) {
        Message('请选择项目')
        return
      }
      emit('ok', state.selectedData)
      cancel()
    }, 300)

    const cancel = () => {
      resetForm()
      emit('cancel')
    }

    // 单例导致需要手动reset
    const resetForm = () => {
      state.form = cloneDeep(initialForm)
      state.pagination = cloneDeep(initialPagination)
      state.selectedData = []
    }

    return {
      cancel,
      onSubmit,
      reset,
      search,
      changeSize,
      changeCurrent,
      selectAll,
      selectSingle,
      ...toRefs(state)
    }
  }
})
</script>

<style lang="scss" scoped>
   .button {
     width: 64px;
   }
</style>
