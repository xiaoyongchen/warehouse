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
        <el-button size="small"  type="primary" @click="showMemberModal(true, '0')">+新增员工</el-button>
        <el-upload
          multiple
          action="action"
          :before-upload="beforeUpload"
          :on-change="customUpload"
          class="upload-drag"
        >
          <el-button size="small" type="primary">批量导入用户</el-button>
        </el-upload>
        <el-button size="small"  type="primary" @click="downloadTemplate">模版下载</el-button>
      </template>
    </HeaderForm>
    <el-table
      class="table"
      :data="tableData"
      v-loading="loading"
      style="width: 100%"
    >
    <el-table-column v-for="(tableIt, index) in column" v-bind="tableIt" :key="tableIt.prop" :index="index">
        <template #default="{ row }" v-if="['userName','actions'].some(it => it === tableIt.prop)">
          <span v-if="tableIt.prop === 'userName'" class="name">{{ row.name }}</span>
          <template v-if="tableIt.prop === 'actions'">
            <el-button class="action-button" type="text" size="small" @click="deleteMember(row)">删除</el-button>
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
    <MemberModal
      :visible="memberModalInfo.visible"
      :data="memberModalInfo.data"
      :modalType="memberModalInfo.modalType"
      @cancel="showMemberModal(false)"
      @ok="funs('search')"
    />
  </div>
</template>

<script>
import { Column, FormKeys } from './config/member'
import { reactive, toRefs, defineComponent, getCurrentInstance } from '@vue/composition-api'
import { MemberApi } from '../../../api/equityPlatform'
import { useRequestTable } from '../../../composition/useRequestTable'
import HeaderForm from '../../../components/HeaderForm.vue'
import MemberModal from './components/MemberModal.vue'
import { Message, MessageBox, Notification } from 'element-ui'
import { isEmpty, pick, debounce } from 'lodash'
import { downloadSheetTemplate } from '../utils'

export default defineComponent({
  name: 'CompanyMember',
  components: { HeaderForm, MemberModal },
  setup () {
    const { proxy } = getCurrentInstance()
    const state = reactive({
      formKeys: FormKeys,
      column: Column,
      memberModalInfo: { visible: false, data: null, modalType: null }
    })

    // 目前写死的JIH, 这个是租户，以后可能会有JIC  JRC 等等
    const [tableData, form, pagination, funs, loading] = useRequestTable({
      initialForm: {
        mobile: null,
        userName: null,
        mrnNo: null,
        tenantCode: 'JIH',
        comboId: proxy.$route.query?.comboId || ''
      },
      requestBefore: (preForm) => {
        if (isEmpty(preForm)) {
          return {}
        }
        // 目前写死的JIH
        preForm.pageIndex = preForm.current
        preForm.pageSize = preForm.size
        return preForm
      },
      requestData: MemberApi.list
    })

    // 控制文件大小/格式
    const beforeUpload = (file = {}) => {
      const fileName = file.name
      const fileType = fileName.substring(fileName.lastIndexOf('.') + 1)
      const enableUpload = fileType === 'xlsx' || fileType === 'xls'
      if (!enableUpload) {
        Message.warning('附件格式错误，请重新上传！')
      }
      return enableUpload
    }

    const customUpload = debounce(async (file) => {
      if (isEmpty(file.raw)) {
        return
      }
      try {
        const reader = new FileReader()
        reader.readAsArrayBuffer(file.raw)
        reader.onload = async () => {
          const buffer = reader.result
          const bytes = new Uint8Array(buffer)
          const length = bytes.byteLength
          let binary = ''
          for (let i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          const XLSX = require('xlsx')
          const wb = XLSX.read(binary, {
            type: 'binary'
          })
          const result = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
          if (!result?.length) {
            return
          }
          const list = result.map(it => {
            it.mobileNo = it['手机号']
            it.nickName = it['姓名']
            it.mrnNo = it.MRN
            return it
          })
          if (!list?.length) {
            return
          }
          const phones = list.map(it => it.mobileNo) || []
          if (!phones?.length) {
            return
          }
          const asyncRes = await MemberApi.asyncMemberSystem({ phones: phones?.toString() })
          if (asyncRes.code !== 0 || isEmpty(asyncRes.data)) {
            return
          }
          const filterKeys = asyncRes.data.map((it = {}) => {
            const keys = Object.keys(it)
            if (keys?.length) {
              return keys[0]
            }
            return null
          })?.filter(Boolean) || []
          const paramsList = list?.map(it => {
            // eslint-disable-next-line eqeqeq
            const mobileNo = filterKeys?.find(key => key == it.mobileNo)
            if (mobileNo) {
              it.mrnNo = asyncRes.find(i => i[mobileNo])
            }
            return it
          })
          const params = {
            comboId: proxy.$route.query?.comboId || '',
            list: paramsList
          }
          const res = await MemberApi.updateCompanyMember(params)
          res.code === 0 && funs('search')
        }
      } catch (error) {
        console.log(error)
      }
    }, 300)

    /**
     * @param {*} visible 新增｜编辑｜查看 展开 否则 关闭
     * @param {*} modalType 新增 0 ，编辑 1 查看 2
     * @param {*} data 一般是id
     */
    const showMemberModal = (visible = true, modalType = '0') => {
      state.memberModalInfo = { ...state.memberModalInfo, visible, data: proxy.$route.query?.comboId || '', modalType }
    }

    const exportAllMember = () => {

    }

    const downloadTemplate = debounce(() => {
      const template = [{ 姓名: '', 手机号: '', MRN: '' }]
      downloadSheetTemplate(template, '企业成员列表模版', '企业成员列表模版.xlsx')
    }, 300)

    const deleteMember = async (row) => {
      try {
        await MessageBox.confirm(
          '移除用户会同时删掉该用户身上的权益，是否确定移除',
          '提示',
          {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          })
        const params = pick(row, ['userId', 'comboId'])
        const res = await MemberApi.deleteCompanyMember(params)
        if (res.code === 0) {
          Notification({
            title: '提示',
            type: 'success',
            duration: 2000,
            message: '移除成功'
          })
          funs('deleteRecord')
        }
      } catch (error) {
        console.log(error)
      }
    }

    return {
      ...toRefs(state),
      tableData,
      form,
      pagination,
      funs,
      loading,
      showMemberModal,
      exportAllMember,
      downloadTemplate,
      deleteMember,
      beforeUpload,
      customUpload
    }
  }
})
</script>

<style scoped>
  .upload-drag {
    margin: 0 8px;
  }
  .action-button {
    margin: 0 4px;
  }
</style>
