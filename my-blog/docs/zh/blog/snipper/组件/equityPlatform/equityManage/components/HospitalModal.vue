<template>
  <el-dialog
   title="适用院区科室设置"
   :visible="visible"
   width="900px"
   destroy-on-close
   :close-on-press-escape="false"
   append-to-body
   :center="false"
   @close="cancel"
 >
   <div class="form-view">
     <div class="tip-view">
        <i class="el-icon-info"></i>
        <span>{{ tips }}</span>
     </div>
      <el-collapse>
        <el-collapse-item v-for="item in sites" :key="item.siteId">
          <template slot="title">
            <span class="header">
              {{item.siteName}}
              <span @click.stop="" style="margin-left: 16px;">
                <el-checkbox
                  :disabled="disabled"
                  :value="hasCheckAll(item.siteId)"
                  @change="checked => onCheckAll(checked, item.siteId)"
                  :indeterminate="getIndeterminate(item.siteId)"
                >
                  全选
                </el-checkbox>
              </span>
              <span class="right-view">
                已选{{ getSelectLength(item.siteId) }}个科室
              </span>
            </span>
          </template>
          <el-checkbox-group :value="getCheckValues(item.siteId)" :disabled="disabled">
            <el-checkbox
              v-for="dept in item.depts"
              :label="dept.deptId"
              :key="dept.deptId"
              @change="checked => onCheck(checked, item.siteId, dept.deptId)"
            >
              {{dept.deptName}}
            </el-checkbox>
          </el-checkbox-group>
        </el-collapse-item>
      </el-collapse>
   </div>
   <div slot="footer">
     <el-button  size="small" @click="cancel" v-show="!isCheck">{{'取消'}}</el-button>
     <el-button type="primary" size="small" @click="onSubmit">{{ isCheck ? '返回' : '确认' }}</el-button>
   </div>
 </el-dialog>
</template>

<script>
import { computed, defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
import { debounce, isArray, cloneDeep } from 'lodash'

const Props = {
  visible: Boolean,
  modalType: String,
  disabled: Boolean,
  data: Array,
  promotionCode: String,
  filterSites: Array,
  tips: {
    type: String,
    default: '当前可设置的院区和科室范围来源于HIS系统中promotion已维护数据，若未查询到您所需的数据，请先维护HIS promotion。'
  }
}

export default defineComponent({
  name: 'HospitalModal',
  props: Props,
  setup (props, { emit }) {
    const state = reactive({
      isCreate: computed(() => props.modalType === '0'),
      isEdit: computed(() => props.modalType === '1'),
      isCopy: computed(() => props.modalType === '2'),
      isCheck: computed(() => props.modalType === '3'),
      sites: [],
      selected: []
    })

    // 初始化数据
    watch(() => props.data, (val) => {
      if (val && val.length) {
        state.sites = val
        // 设置选中状态
      }
    })

    // 初始化数据
    watch(() => [props.filterSites, props.visible], (val = []) => {
      const [selected] = val
      if (selected && selected.length) {
        state.selected = cloneDeep(selected)
      }
    })

    // 计算是否是选中
    const hasCheckAll = (siteId) => {
      const siteItem = state.sites.find(item => item.siteId === siteId)
      if (siteItem && isArray(siteItem?.depts)) {
        return siteItem?.depts.every(dept => {
          return state.selected.find(item => item.departmentId === dept.deptId && item.siteId === siteId)
        })
      }
      return false
    }

    const onCheckAll = (checked, siteId) => {
      const selected = state.selected.filter(item => item.siteId !== siteId)
      if (checked) {
        const site = state.sites.find(item => item.siteId === siteId)
        if (site && isArray(site.depts)) {
          selected.push(...site.depts.map(item => ({
            departmentId: item.deptId,
            departmentName: item.deptName,
            siteId: siteId,
            siteName: site.siteName
          })))
        }
      }
      state.selected = selected
    }

    // 设置状态值
    const getIndeterminate = (siteId) => {
      const siteItem = state.sites.find(item => item.siteId === siteId)
      if (siteItem && isArray(siteItem.depts)) {
        const len = siteItem.depts.filter(dept => {
          return state.selected?.find(item => item.departmentId === dept.deptId && item.siteId === siteId)
        }).length
        return len > 0 && len !== siteItem.depts.length
      }
      return false
    }

    // 获取选择院区下的科室个数
    const getSelectLength = (siteId) => {
      const siteItem = state.sites.find(item => item.siteId === siteId)
      if (siteItem && isArray(siteItem.depts)) {
        const len = siteItem.depts.filter(dept => {
          return state.selected.find(item => item.departmentId === dept.deptId && item.siteId === siteId)
        }).length
        return len
      }
      return 0
    }

    // 获取checkBoxGroun 数组
    const getCheckValues = (siteId) => {
      return state.selected?.filter(item => item.siteId === siteId)?.map(item => item.departmentId) || []
    }

    // 单个选择
    const onCheck = (checked, siteId, deptId) => {
      const site = state.sites?.find(item => item.siteId === siteId)
      const dept = site.depts?.find(item => item.deptId === deptId)
      const list = state.selected || []
      if (checked) {
        list.push({
          departmentId: deptId,
          departmentName: dept.deptName,
          siteId: siteId,
          siteName: site.siteName
        })
        state.selected = list
        return
      }
      state.selected = list.filter(item => !(item.departmentId === deptId && item.siteId === siteId)) ?? []
    }

    const onSubmit = debounce(async () => {
      if (state.isCheck) {
        cancel()
        return
      }
      // const item = {
      //   departmentId: 'JJC8001',
      //   departmentName: '嘉静门诊护理',
      //   siteId: 'JJC',
      //   siteName: '上海嘉静门诊部'
      // }
      emit('ok', state.selected)
      cancel()
    }, 300)

    const cancel = () => {
      // 重置
      state.selected = []
      emit('cancel')
    }

    return {
      cancel,
      onSubmit,
      hasCheckAll,
      onCheckAll,
      getCheckValues,
      onCheck,
      getSelectLength,
      getIndeterminate,
      ...toRefs(state)
    }
  }
})
</script>

<style lang="scss" scoped>
  .form-view {
    display: flex;
    flex-direction: column;
    padding: 0 16px;
    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      .right-view {
        margin-left: auto;
        padding-right: 8px;
      }
    }
  }
  .tip-view {
    margin-bottom: 16px;
    i {
      padding-right: 7px;
      color: #488aff;
    }
  }
</style>
