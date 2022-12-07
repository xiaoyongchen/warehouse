<template>
  <div class="promotionTable">
    <el-table
      class="table"
      :data="computedTableData"
      v-loading="loading"
      size="small"
      style="width: 100%; padding: 0;"
      row-key="promotionCode"
      @row-click="rowClick"
    >
    <el-table-column v-for="(tableIt) in column" v-bind="tableIt" :key="tableIt.prop">
        <template #default="{ row }" v-if="['isVaild','benefitType','actions'].some(it => it === tableIt.prop)">
          <template v-if="tableIt.prop === 'benefitType'">
            <span>{{ getBenefitType(row) }}</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      small
      @size-change="changeSize"
      @current-change="changeCurrent"
      :current-page="pagination.currentPage || 1"
      :page-sizes="[5, 20]"
      layout="total, prev, pager, next, sizes"
      :total="allList && allList.length ? allList.length : 0">
    </el-pagination>
  </div>
</template>

<script>
import { Column } from '../config/promotionTable'
import { reactive, toRefs, defineComponent, computed, watch } from '@vue/composition-api'
import { useRequest } from '../../../../composition/useRequest'
import { EquityManageApi } from '../../../../api/equityPlatform'

export default defineComponent({
  name: 'PromotionTable',
  props: {
    keyword: String
  },
  setup (props, { emit }) {
    const [allList, loading] = useRequest({
      requestData: EquityManageApi.promotion,
      filter: (data) => {
        if (data?.length) {
          const list = data.map(it => {
            return { ...it, effectiveTime: it.promotionEffectiveBeginTime && it.promotionEffectiveEndTime ? `${it.promotionEffectiveBeginTime}~${it.promotionEffectiveEndTime}` : '' }
          })
          data = [...list]
        }
        return data
      }
    })

    const state = reactive({
      column: Column,
      computedTableData: computed(() => {
        if (state.tableData && state.tableData.length) {
          return state.tableData.slice((state.pagination.currentPage - 1) * state.pagination.pageSize, state.pagination.currentPage * state.pagination.pageSize)
        }
        return []
      }),
      tableData: computed(() => {
        if (allList.value?.length) {
          if (props.keyword) {
            return allList.value.filter(it => {
              return (
                it.promotionName.indexOf(props.keyword) > -1 ||
                it.promotionCode.indexOf(props.keyword) > -1
              )
            })
          }
          return allList.value || []
        }
        return []
      }),
      pagination: { pageSize: 5, currentPage: 1, total: 0 }
    })

    watch(() => props.keyword, () => {
      state.pagination = { ...state.pagination, currentPage: 1 }
    })

    const changeSize = (pageSize = 5) => {
      state.pagination = { ...state.pagination, pageSize, currentPage: 1 }
    }
    const changeCurrent = (currentPage = 1) => {
      state.pagination = { ...state.pagination, currentPage }
    }

    const rowClick = (row) => {
      emit('ok', row)
    }

    return {
      allList,
      loading,
      ...toRefs(state),
      rowClick,
      changeCurrent,
      changeSize
    }
  }
})
</script>

<style scoped>
  .promotionTable {
    position: relative;
  }
  .action-button {
    margin: 0 4px;
  }
</style>
