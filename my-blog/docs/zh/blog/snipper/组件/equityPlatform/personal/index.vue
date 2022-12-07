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
        <el-button size="small"  type="primary" @click="showPackageModal(true, '0')">新增套餐</el-button>
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
            <el-button class="action-button" type="text" size="small" @click="showPackageModal(true, '1', row)">编辑</el-button>
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
    <PackageModal
      v-bind="packageModalInfo"
      @cancel="showPackageModal(false)"
      @ok="funs('search')"
    />
  </div>
</template>

<script>
import { Column, FormKeys } from './config'
import { isEmpty, isArray } from 'lodash'
import moment from 'moment'
import { reactive, toRefs, defineComponent, getCurrentInstance } from '@vue/composition-api'
import { PersonalApi } from '../../../api/equityPlatform'
import { useRequestTable } from '../../../composition/useRequestTable'
import HeaderForm from '../../../components/HeaderForm.vue'
import PackageModal from './components/PackageModal.vue'

export default defineComponent({
  name: 'EquityPersonal',
  components: { HeaderForm, PackageModal },
  setup () {
    const { proxy } = getCurrentInstance()
    const state = reactive({
      formKeys: FormKeys,
      column: Column,
      companyVisible: false,
      packageModalInfo: { visible: false, data: null, modalType: null }
    })

    // 目前写死的JIH, 这个是租户，以后可能会有JIC  JRC 等等
    const [tableData, form, pagination, funs, loading] = useRequestTable({
      initialForm: {
        name: null,
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
      requestData: PersonalApi.list,
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
     * @param {*} visible 新增｜编辑｜查看 展开 否则 关闭
     * @param {*} modalType 新增 0 ，编辑 1 拷贝 2 查看 3
     * @param {*} data 一般是id
     */
    const showPackageModal = (visible = true, modalType, data = {}) => {
      state.packageModalInfo = { ...state.packageModalInfo, visible, modalType, data: data?.comboId }
    }

    const lookMember = (row = {}) => {
      proxy.$router.push({
        name: 'PersonalMember',
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
      showPackageModal,
      lookMember
    }
  }
})
</script>

<style scoped>
  .action-button {
    margin: 0 4px;
  }
</style>
