<template>
  <div class="table-view">
    <el-table
      class="table"
      :data="tableData"
      v-loading="loading"
      size="small"
      style="width: 100%"
      :style="{ padding: 0 }"
      @row-click="rowClick"
    >
    <el-table-column v-for="(tableIt) in column" v-bind="tableIt" :key="tableIt.prop">
      <template #default="{ row }" v-if="['isVaild'].some(it => it === tableIt.prop)">
        <template v-if="tableIt.prop === 'isVaild'">
          <span>{{ row.isVaild === 1 ? '启用' : '停用' }}</span>
        </template>
      </template>
    </el-table-column>
    </el-table>
    <div class="text-c mt-10">
      <el-pagination
        background
        small
        @size-change="(val) => funs('changeSize', val)"
        @current-change="(val) => funs('changePage', val)"
        :current-page="pagination.current"
        :page-size="pagination.size"
        layout="prev, pager, next, jumper"
        :total="pagination.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, defineComponent, watch } from '@vue/composition-api'
import { isEmpty } from 'lodash'
import { useRequestTable } from '../../../composition/useRequestTable'
import { EquityManageApi } from '../../../api/equityPlatform'
import { Message } from 'element-ui'

const Column = [
  { prop: 'benefitName', label: '权益名称', align: 'center', showOverflowTooltip: true }
]

export default defineComponent({
  name: 'PromotionTable',
  props: {
    filterData: Array,
    filterTitle: String,
    // 权益项管理，是复合权益，添加权益项compoundFlag只能是0
    compoundFlag: {
      type: [Number, Object],
      default: null
    }
  },
  setup (props, { emit }) {
    const state = reactive({
      column: Column
    })

    // 目前写死的JIH, 这个是租户，以后可能会有JIC  JRC 等等
    const [tableData, form, pagination, funs, loading] = useRequestTable({
      initialForm: { benefitName: null, compoundFlag: props.compoundFlag },
      initialPagination: { current: 1, total: 0, size: 5 },
      requestBefore: (preForm) => {
        if (isEmpty(preForm)) {
          return {}
        }
        preForm.pageIndex = preForm.current
        preForm.pageSize = preForm.size
        return preForm
      },
      requestData: EquityManageApi.list
    })

    watch(() => props.filterTitle, (val) => {
      form.value = { ...form.value, benefitName: val }
      funs('search')
    })

    // 点击table项目
    const rowClick = (row) => {
      if (row.isVaild === 0) {
        Message.error('权益项是停用状态，请重新选择')
        return
      }
      const isInclude = props.filterData.some(it => it.benefitId === row.benefitId)
      if (isInclude) {
        Message.error('权益项已选择，请重新选择')
        return
      }
      emit('ok', row)
    }

    return {
      ...toRefs(state),
      tableData,
      loading,
      pagination,
      funs,
      rowClick
    }
  }
})
</script>

<style lang="scss" scoped>
  .table-view {
    position: relative;
    /deep/ .el-table__header-wrapper {
      display: none;
    }
  }
  .action-button {
    margin: 0 4px;
  }
</style>
