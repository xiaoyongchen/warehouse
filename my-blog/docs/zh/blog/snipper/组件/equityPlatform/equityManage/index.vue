<template>
  <div class="page">
    <HeaderForm
      :form="form"
      :labelWidth="120"
      :formKeys="formKeys"
      @reset="funs('reset')"
      @search="funs('search')"
      showExpand
    >
      <template #expandButtons>
        <el-button size="small"  type="primary" @click="showEquityOptionModal(true, '0')">新增权益项</el-button>
      </template>
    </HeaderForm>
    <el-table
      class="table"
      :data="tableData"
      v-loading="loading"
      style="width: 100%"
    >
    <el-table-column v-for="(tableIt) in column" v-bind="tableIt" :key="tableIt.prop">
        <template #default="{ row }" v-if="['benefitType','actions'].some(it => it === tableIt.prop)">
          <template v-if="tableIt.prop === 'benefitType'">
            <span>{{ getBenefitType(row) }}</span>
          </template>
          <template v-if="tableIt.prop === 'actions'">
            <el-button class="action-button" type="text" size="small" @click="showEquityOptionModal(true, '1', row.benefitId)">编辑</el-button>
            <el-button class="action-button" type="text" size="small" @click="showEquityOptionModal(true, '2', row.benefitId)">克隆</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="text-c mt-10">
      <el-pagination
        background
        @size-change="(val) => funs('changeSize', val)"
        @current-change="(val) => funs('changePage', val)"
        :current-page="pagination.current"
        :page-sizes="[10, 20, 30, 40, 50, 100, 500]"
        :page-size="pagination.size"
        layout="total, prev, pager, next, sizes, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
    <EquityOptionModal
      :visible="equitOptionModalInfo.visible"
      :data="equitOptionModalInfo.data"
      :modalType="equitOptionModalInfo.modalType"
      @ok="funs('search')"
      @cancel="showEquityOptionModal(false)"
    />
  </div>
</template>

<script>
import { Column, FormKeys } from './config'
import { reactive, toRefs, defineComponent } from '@vue/composition-api'
import { EquityManageApi } from '../../../api/equityPlatform'
import { useRequestTable } from '../../../composition/useRequestTable'
import HeaderForm from '../../../components/HeaderForm.vue'
import EquityOptionModal from './components/EquityOptionModal.vue'
import moment from 'moment'
import { isEmpty } from 'lodash'

export default defineComponent({
  name: 'EquityManage',
  components: { HeaderForm, EquityOptionModal },
  setup () {
    const state = reactive({
      formKeys: FormKeys,
      column: Column,
      companyVisible: false,
      equitOptionModalInfo: { visible: false, data: null, modalType: null }
    })

    // 目前写死的JIH, 这个是租户，以后可能会有JIC  JRC 等等
    const [tableData, form, pagination, funs, loading] = useRequestTable({
      initialForm: {
        benefitName: null,
        tenantCode: 'JIH'
      },
      requestBefore: (preForm) => {
        if (isEmpty(preForm)) {
          return {}
        }
        preForm.pageIndex = preForm.current
        preForm.pageSize = preForm.size
        return preForm
      },
      requestData: EquityManageApi.list,
      filter: (data) => {
        if (data?.length) {
          const list = data.map(it => {
            return { ...it, gmtCreated: it.gmtCreated ? moment(it.gmtCreated).format('YYYY-MM-DD HH:mm:ss') : '' }
          })
          data = [...list]
        }
        return data
      }
    })
    // 权益类型
    const getBenefitType = (row = {}) => {
      const obj = {
        1: '图文问诊',
        2: '视频问诊',
        3: '体检预约',
        4: '体检报告解读',
        5: '线下门诊预约',
        6: '其他'
      }
      return obj[row?.benefitType] || ''
    }

    /**
     * @param {*} visible 新增｜编辑｜查看 展开 否则 关闭
     * @param {*} modalType 新增 0 ，编辑 1 查看 2 克隆 3
     * @param {*} data 一般是id
     */
    const showEquityOptionModal = (visible = true, modalType, data) => {
      state.equitOptionModalInfo = { ...state.equitOptionModalInfo, visible, data, modalType }
    }

    return {
      ...toRefs(state),
      tableData,
      form,
      pagination,
      funs,
      loading,
      getBenefitType,
      showEquityOptionModal
    }
  }
})
</script>

<style scoped>
  .action-button {
    margin: 0 4px;
  }
</style>
