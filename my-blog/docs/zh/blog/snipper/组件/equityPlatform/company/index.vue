<template>
  <div class="page">
    <HeaderForm
      :form="form"
      :formKeys="formKeys"
      @reset="funs('reset')"
      @search="funs('search')"
      showExpand
    >
      <template #expandButtons>
        <el-button size="small"  type="primary" @click="showCompanyModal(true, '0')">新增企业</el-button>
      </template>
    </HeaderForm>
    <el-table
      class="table"
      :data="tableData"
      v-loading="loading"
      style="width: 100%"
    >
    <el-table-column v-for="(tableIt, index) in column" v-bind="tableIt" :key="tableIt.prop" :index="index">
        <template #default="{ row }" v-if="['actions'].some(it => it === tableIt.prop)">
          <template v-if="tableIt.prop === 'actions'">
            <el-button class="action-button" type="text" size="small" @click="showCompanyModal(true, '1', row)">编辑</el-button>
            <el-button class="action-button" type="text" size="small" @click="linkPackage(row)">关联权益套餐</el-button>
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
    <CompanyModal
      :visible="companyModalInfo.visible"
      :modalType="companyModalInfo.modalType"
      :data="companyModalInfo.data"
      @ok="funs('search')"
      @cancel="showCompanyModal(false)"
    />
  </div>
</template>

<script>
import { Column, FormKeys } from './config'
import { isEmpty, isArray } from 'lodash'
import moment from 'moment'
import { reactive, toRefs, defineComponent, getCurrentInstance } from '@vue/composition-api'
import { CompanyApi } from '../../../api/equityPlatform'
import { useRequestTable } from '../../../composition/useRequestTable'
import HeaderForm from '../../../components/HeaderForm.vue'
import CompanyModal from './components/CompanyModal.vue'

export default defineComponent({
  name: 'EquityCompany',
  components: { HeaderForm, CompanyModal },
  setup () {
    const { proxy } = getCurrentInstance()
    const state = reactive({
      formKeys: FormKeys,
      column: Column,
      companyVisible: false,
      companyModalInfo: { visible: false, data: null, modalType: null },
      qrCodeModalInfo: { visible: false, data: null, modalType: null }
    })

    const [tableData, form, pagination, funs, loading] = useRequestTable({
      initialForm: {
        companyName: null,
        time: [moment().subtract(1, 'month').startOf('day').toDate(), moment().endOf('day').toDate()]
      },
      requestBefore: (preForm) => {
        if (isEmpty(preForm)) {
          return {}
        }
        const [createBeginTime = '', createEndTime = ''] = getTimes(preForm) || []
        preForm.time = null
        preForm.createBeginTime = createBeginTime
        preForm.createEndTime = createEndTime
        preForm.pageIndex = preForm.current
        preForm.pageSize = preForm.size
        // 目前写死的JIH
        preForm.tenantCode = 'JIH'
        return preForm
      },
      requestData: CompanyApi.list,
      filter: (data) => {
        if (data?.length) {
          const list = data.map(it => {
            return { ...it, gmtCreated: it.gmtCreated ? moment(it.gmtCreated).format('YYYY-MM-DD HH:mm:ss') : '' }
          })
          data = list
        }
        return data
      }
    })

    const getTimes = (preForm = {}) => {
      if (isArray(preForm?.time) && preForm?.time?.length > 0) {
        const [first, sconde] = preForm.time
        return [moment(first).format('YYYY-MM-DD HH:mm:ss'), moment(sconde).endOf('day').format('YYYY-MM-DD HH:mm:ss')]
      }
      return []
    }

    /**
     * @param {*} visible 新增｜编辑｜查看 展开 否则 关闭
     * @param {*} modalType 新增 0 ，编辑 1 拷贝 2 查看 3
     * @param {*} data 一般是id
     */
    const showCompanyModal = (visible = true, modalType, data = {}) => {
      state.companyModalInfo = { ...state.companyModalInfo, visible, data: data?.companyId, modalType }
    }

    // 关联套餐
    const linkPackage = (row = {}) => {
      proxy.$router.push({
        name: 'CompanyPackage',
        query: {
          ...(row && { companyId: row.companyId })
        }
      })
    }

    return {
      ...toRefs(state),
      tableData,
      form,
      pagination,
      funs,
      loading,
      linkPackage,
      showCompanyModal
    }
  }
})
</script>

<style scoped>
  .action-button {
    margin: 0 4px;
  }
</style>
