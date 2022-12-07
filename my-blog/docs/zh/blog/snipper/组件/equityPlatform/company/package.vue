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
        <el-button size="small"  type="primary" @click="showEquityModal(true, '0')">新增权益套餐</el-button>
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
            <el-button class="action-button" type="text" size="small" @click="showEquityModal(true, '1', row)">编辑</el-button>
            <el-button class="action-button" type="text" size="small" @click="showEquityModal(true, '3', row)">查看</el-button>
            <el-button class="action-button" type="text" size="small" @click="showQRCodeModal(true, '1', row.comboId)">二维码</el-button>
            <el-button class="action-button" type="text" size="small" @click="lookMember(row)">成员查看</el-button>
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
    <ReviewQRCodeModal
      v-bind="qrCodeModalInfo"
      @cancel="showQRCodeModal(false)"
    />
    <EquityOptionModal
      v-bind="equityOptionModalInfo"
      @cancel="showEquityModal(false)"
      @ok="funs('search')"
    />
  </div>
</template>

<script>
import { Column, FormKeys } from './config/package'
import { isEmpty, isArray } from 'lodash'
import moment from 'moment'
import { reactive, toRefs, defineComponent, getCurrentInstance } from '@vue/composition-api'
import { PackageApi } from '../../../api/equityPlatform'
import { useRequestTable } from '../../../composition/useRequestTable'
import HeaderForm from '../../../components/HeaderForm.vue'
import ReviewQRCodeModal from './components/ReviewQRCodeModal.vue'
import EquityOptionModal from './components/EquityOptionModal.vue'

export default defineComponent({
  name: 'CompanyPackage',
  components: { HeaderForm, ReviewQRCodeModal, EquityOptionModal },
  setup () {
    const { proxy } = getCurrentInstance()
    const state = reactive({
      formKeys: FormKeys,
      column: Column,
      companyVisible: false,
      equityOptionModalInfo: { visible: false, data: null, modalType: null, companyId: proxy.$route.query?.companyId || '' },
      qrCodeModalInfo: { visible: false, data: null, modalType: null, page: 'pages/activities/benefit/index' }
    })

    // comboAcquireStatus 1: 可以领用， 0 不允许领用
    // JIH 目前写死，还有很多业务类型
    const [tableData, form, pagination, funs, loading] = useRequestTable({
      initialForm: {
        comboName: null,
        companyId: proxy.$route.query?.companyId || '',
        tenantCode: 'JIH',
        time: [moment().subtract(1, 'month').startOf('day').toDate(), moment().endOf('day').toDate()]
      },
      requestBefore: (preForm) => {
        if (isEmpty(preForm)) {
          return {}
        }
        const [createBeginTime = '', createEndTime = ''] = getTimes(preForm) || []
        preForm.createBeginTime = createBeginTime
        preForm.createEndTime = createEndTime
        preForm.pageIndex = preForm.current
        preForm.pageSize = preForm.size
        return preForm
      },
      requestData: PackageApi.list,
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
      if (isArray(preForm.time) && preForm.time?.length > 0) {
        const [first, sconde] = preForm.time
        return [moment(first).format('YYYY-MM-DD HH:mm:ss'), moment(sconde).endOf('day').format('YYYY-MM-DD HH:mm:ss')]
      }
      return []
    }

    /**
     * @param {*} visible
     * @param {*} modalType 新增 0 ，编辑 1 克隆 2 查看 3
     * @param {*} data 一般是id
     */
    const showEquityModal = (visible = true, modalType = '0', data = {}) => {
      state.equityOptionModalInfo = { ...state.equityOptionModalInfo, visible, data: data.comboId, modalType }
    }

    /**
     * @param {*} visible 新增｜编辑｜查看 展开 否则 关闭
     * @param {*} modalType 新增 0 ，编辑 1 查看 2
     * @param {*} data 一般是id
     */
    const showQRCodeModal = (visible = true, modalType, data) => {
      state.qrCodeModalInfo = { ...state.qrCodeModalInfo, visible, data, modalType }
    }

    // 关联成员
    const lookMember = (row = {}) => {
      proxy.$router.push({
        name: 'CompanyMember',
        query: {
          ...(row && { comboId: row.comboId })
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
      lookMember,
      showEquityModal,
      showQRCodeModal
    }
  }
})
</script>

<style scoped>
  .action-button {
    margin: 0 4px;
  }
</style>
