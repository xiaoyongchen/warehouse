<template>
  <el-dialog
   :title="navTitle"
   :visible.sync="visible"
   width="1000px"
   destroy-on-close
   :close-on-press-escape="false"
   center
   @close="cancel"
   style="height:auto"
 >
   <div class="form-view">
     <el-form
       ref="formRef"
       :model="form"
       :rules="rules"
       size="small"
       label-suffix=":"
       label-width="140px"
       class="form-content"
       inline
     >
      <el-col
        :span="it.span || 24"
        v-for="(it, index) in formKeys"
        :key="it.prop + index"
        v-show="!(typeof it.hidden === 'function' ? it.hidden(form) : it.hidden)"
      >
        <template v-if="it.formType === 'title'">
          <HeaderWithIndecate :title="it.label" :style="{ marginBottom: '16px' }" />
        </template>
        <el-form-item
            class="form-item"
            :class="it.class"
            v-bind="it"
            v-else
          >
          <template v-if="it.formType === 'input'">
            <el-input v-bind="it" v-model="form[it.prop]" class="input-item"></el-input>
          </template>
          <template v-if="it.formType === 'radio'">
            <el-radio-group
              v-bind="it"
              v-model="form[it.prop]"
              :disabled="it.disabled"
              class="radio-item"
            >
              <el-radio
                v-for="radioIt in it.options"
                :key="radioIt.label"
                :label="radioIt.label"
                >
                {{ radioIt.title }}
              </el-radio>
            </el-radio-group>
          </template>
          <template v-if="it.formType === 'checkBox'">
            <el-checkbox-group
              :disabled="it.disabled"
              v-model="form[it.prop]"
              class="checkBox-item"
            >
              <el-checkbox
                v-for="checkIt in it.options"
                :key="checkIt.label"
                :label="checkIt.label"
                >
                {{ checkIt.title }}
              </el-checkbox>
            </el-checkbox-group>
          </template>
          <template v-if="it.formType === 'select'">
            <el-select
              v-bind="it"
              v-model="form[it.prop]"
              class="select-item"
            >
              <el-option
                v-for="(selectIt, selectIndex) in (it.isLink ? it.optionMap[form[it.linkKey]] : it.options)"
                :key="selectIndex"
                :label="selectIt.label"
                :value="selectIt.value"
              >
              </el-option>
            </el-select>
          </template>
          <template v-if="it.formType === 'uploadImage'">
            <z-upload
              :value.sync="form[it.prop]"
              :size="it.size"
              :limitKbSize="it.limitKbSize"
              :removeShow="!it.disabled"
            />
            <div class="upload-marker">
              {{ it.tips }}
            </div>
          </template>
          <template v-if="it.formType === 'datePicker'">
            <el-date-picker
              v-bind="it"
              v-model="form[it.prop]"
              @change="(val) => it.change(val, form)"
              class="date-picker-item"
            >
            </el-date-picker>
          </template>
          <template v-if="it.formType === 'department'">
            <span>
              已设置：{{ `${selectHospital && selectHospital.length ? selectHospital.length : 0 }个院区&nbsp;&nbsp;${selectDepartment && selectDepartment.length ? selectDepartment.length : 0}个科室`}}
              <el-button
                type="text"
                :disabled="it.disabled"
                style="width: 66px; font-size: 13px;"
                @click="showHospitalModal(true)"
              >
                更新
              </el-button>
              (点击可查看并维护院区和科室)
            </span>
            <el-row type="flex" style="flex-direction: row">
              <span>院区：</span>
              <el-col style="flex: 1;">
                <span v-for="val in selectHospital" :key="val.siteId" class="subText">{{val.siteName}}</span>
              </el-col>
            </el-row>
            <el-row type="flex" style="flex-direction: row">
              <span>科室：</span>
              <el-col style="flex: 1;" class="department">
                <span v-for="departmentIt in selectDepartment" :key="departmentIt.departmentId" class="subText">{{ departmentIt.departmentName }}</span>
              </el-col>
            </el-row>
          </template>
        <template v-if="it.formType === 'button'">
          <el-button @click="showProjectModal(true)" :disabled="it.disabled" >选择项目</el-button>
        </template>
        <template v-if="it.formType === 'table'">
          <el-input
            v-bind="it"
            v-model.trim="form[it.prop]"
            class="input-item"
            @focus="showPromotion(true)"
          />
          <el-card size="small" v-show="promotionVisible" style="position: absolute; zIndex: 9999; width: 100%">
            <div slot="header" class="clearfix">
              <el-button style="float: right; padding: 0;" type="text" @click="showPromotion(false)">关闭</el-button>
            </div>
            <PromotionTable :keyword="form[it.prop]" @ok="onChangeWithPromotion"/>
          </el-card>
        </template>
        <template v-if="it.formType === 'text'">
          <span>{{ form[it.prop] }}</span>
        </template>
        </el-form-item>
       </el-col>
     </el-form>
    <el-table
      class="table"
      row-key="projectId"
      :data="projectModalInfo.filterData || []"
      style="width: 100%"
      v-show="form.benefitType !== 3 && form.compoundFlag === 0"
    >
      <el-table-column v-for="(tableIt, index) in column" v-bind="tableIt" :key="tableIt.prop" :index="index">
          <template #default="{ row }" v-if="['actions'].some(it => it === tableIt.prop)">
            <el-button class="action-button" type="text" size="small" :disabled="isCheck" @click="deleteProjectOption(row)">删除</el-button>
          </template>
      </el-table-column>
    </el-table>
    <el-table
      class="equity-option-table"
      row-key="benefitId"
      :data="tableData"
      style="width: 70%"
      default-expand-all
      v-show="form.benefitType !== 3 && form.compoundFlag === 1"
    >
      <el-table-column v-for="(tableIt, index) in tableClumn" v-bind="tableIt" :key="tableIt.prop" :index="index">
        <template #default="{ row }" v-if="['benefitName','sortNum','actions'].some(it => it === tableIt.prop)">
          <template v-if="tableIt.prop === 'benefitName'">
            <el-input
              v-bind="row"
              v-model.trim="row.benefitName"
              placeholder="请选择权益项"
              :disabled="isCheck"
              size="mini"
              @focus="showModal(row.benefitId)"
            />
            <el-card size="small" v-show="row.visible" style="position: absolute; zIndex: 9999">
              <div slot="header" class="clearfix">
                <el-button style="float: right; padding: 0;" type="text" @click="dismissModal(row)">关闭</el-button>
              </div>
              <EquityOptionTable :filterTitle="row.benefitName" :filterData="tableData" :compoundFlag="0" @ok="(selectRow) => onChangeWithEquityOption(selectRow, row)"/>
            </el-card>
          </template>
          <template v-if="tableIt.prop === 'sortNum'">
            <el-input-number
              v-bind="row"
              size="mini"
              v-model.trim="row.sortNum"
              :min="0"
              :disabled="isCheck"
            />
          </template>
          <template v-if="tableIt.prop === 'actions'">
            <el-button class="action-button" type="text" size="small" @click="saveRow(row)" v-show="!isCheck && !row.isSave">保存</el-button>
            <Popconfirm
              title="是否确认删除？"
              @confirm="deleteRow(row)"
            >
              <el-button class="action-button" slot="reference" type="text" size="small" :disabled="isCheck">删除</el-button>
            </Popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" size="small" @click="addEquityOptions" v-show="!isCheck && (form.benefitType !== 3 && form.compoundFlag === 1)" class="addButton">新增</el-button>
   </div>
   <div slot="footer" class="bottom-view">
     <el-button  size="small" @click="cancel" class="button" v-show="!isCheck">{{'取消'}}</el-button>
     <el-button type="primary" size="small" @click="onSubmit" class="button">{{ isCheck ? '返回' : '确认' }}</el-button>
   </div>
   <HospitalModal
      v-bind="hospitalModalInfo"
      @cancel="showHospitalModal(false)"
      @ok="onChangeWithHospital"
    />
    <ProjectModal
      v-bind="projectModalInfo"
      @cancel="showProjectModal(false)"
      @ok="onChangeWithProject"
    />
 </el-dialog>
</template>

<script>
import zUpload from '../../../../components/z-upload'
import { computed, defineComponent, onBeforeMount, reactive, toRefs, watch } from '@vue/composition-api'
import { cloneDeep, debounce, isEmpty, pick } from 'lodash'
import { EquityManageApi } from '../../../../api/equityPlatform'
import { initialForm, formKeys, initialRules, tableColumn } from '../config/equityOptionModal'
import { Notification, Message } from 'element-ui'
import HospitalModal from './HospitalModal.vue'
import ProjectModal from './ProjectModal.vue'
import PromotionTable from './PromotionTable.vue'
import HeaderWithIndecate from '../../components/HeaderWithIndecate.vue'
import EquityOptionTable from '../../components/EquityOptionTable.vue'
import Popconfirm from '../../../../components/Popconfirm.vue'
import jsCookie from 'js-cookie'

const Props = {
  visible: Boolean,
  modalType: String,
  data: [Object, String, Number]
}

export const Column = [
  { prop: 'benefitName', width: 300, label: '权益项名称', align: 'center' },
  { prop: 'sortNum', label: '核销顺序', align: 'center' },
  { prop: 'actions', label: '操作', width: 120, align: 'center' }
]
export default defineComponent({
  name: 'EquityOptionModal',
  props: Props,
  components: {
    zUpload,
    Popconfirm,
    HospitalModal,
    ProjectModal,
    PromotionTable,
    HeaderWithIndecate,
    EquityOptionTable
  },
  setup (props, { emit }) {
    const state = reactive({
      formRef: null,
      column: tableColumn,
      isCreate: computed(() => props.modalType === '0'),
      isEdit: computed(() => props.modalType === '1'),
      isCopy: computed(() => props.modalType === '2'),
      isCheck: computed(() => props.modalType === '3'),
      form: cloneDeep(initialForm),
      rules: cloneDeep(initialRules),
      formKeys: formKeys,
      navTitle: computed(() => getNavTitle()),
      hospitalModalInfo: { modalType: null, visible: false, data: null, filterSites: [] },
      projectModalInfo: { modalType: null, visible: false, data: null, promotion: null, filterData: [] },
      promotionVisible: false,
      sites: [], // 总数据源
      effects: [], // promotion关联项目总数据源
      selectHospital: computed(() => {
        if (state.hospitalModalInfo?.filterSites?.length) {
          const map = new Map()
          state.hospitalModalInfo.filterSites.forEach(it => {
            map.set(it.siteId, pick(it, ['siteId', 'siteName']))
          })
          return Array.from(map).map(it => {
            const [, second] = it || []
            return second
          })
        }
        return []
      }),
      selectDepartment: computed(() => {
        if (state.hospitalModalInfo?.filterSites?.length) {
          const map = new Map()
          state.hospitalModalInfo.filterSites.forEach(it => {
            map.set(it.departmentId, pick(it, ['departmentId', 'departmentName']))
          })
          return Array.from(map).map(it => {
            const [, second] = it || []
            return second
          })
        }
        return []
      }),
      // 权益项相关
      tableData: [],
      tableClumn: Column,
      userInfo: computed(() => ({ operatorId: jsCookie.get('USER_ID'), operatorName: jsCookie.get('USER_NAME') }))
    })

    watch(() => state.isCheck, (val) => {
      if (val) {
        const list = state.formKeys.map(it => ({ ...it, disabled: true }))
        state.formKeys = list
      }
    })

    watch(() => props.data, (benefitId) => {
      if (benefitId) {
        requestDetail({ benefitId })
      }
    })

    const requestDetail = async (params = {}) => {
      try {
        const res = await EquityManageApi.detail(params)
        if (res.code === 0 && !isEmpty(res?.data)) {
          // 这里一定要设置benefitAsyncCouponLimit 为数组
          state.form = { ...state.form, ...res.data, benefitAsyncCouponLimit: [], ...(state.isCopy && { benefitName: '', benefitEnglishName: '' }) }
          if (res.data?.benefitAsyncCouponLimit) {
            state.form = { ...state.form, benefitAsyncCouponLimit: res.data?.benefitAsyncCouponLimit?.split(',')?.map(it => Number(it)) || [] }
          }
          // 设置table
          if (res.data?.compoundBenefits?.length) {
            const list = res.data.compoundBenefits.map(it => {
              it.visible = false
              it.isSave = false
              return it
            }) || [{ benefitId: '0', visible: false, isEmpty: true, isSave: false }]
            state.tableData = list
          }
          // promotionCode 有值
          if (res?.data.promotionCode) {
            requestPromotionInfo(res?.data.promotionCode)
          }
          // 设置院区科室
          if (res.data?.departments?.length) {
            state.hospitalModalInfo = { ...state.hospitalModalInfo, filterSites: res.data.departments }
          }
          // 设置项目
          if (res.data?.effects?.length) {
            state.projectModalInfo = { ...state.projectModalInfo, filterData: res.data.effects }
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    const requestPromotionInfo = async (promotionCode = '') => {
      try {
        const res = await EquityManageApi.promotion()
        if (res.code === 0 && res.data?.length) {
          const list = res.data?.map(it => {
            return { ...it, effectiveTime: it.promotionEffectiveBeginTime && it.promotionEffectiveEndTime ? `${it.promotionEffectiveBeginTime}~${it.promotionEffectiveEndTime}` : '' }
          })
          const row = list.find(it => it.promotionCode === promotionCode)
          !isEmpty(row) && onChangeWithPromotion(row, false)
        }
      } catch (error) {
        console.log(error)
      }
    }

    // 设置rulus
    watch(() => state.form, (newForm) => {
      const rules = cloneDeep(state.rules)
      // 设置大类
      rules.benefitSuperClassId = rules.benefitSuperClassId.map(it => ({ ...it, required: newForm.benefitType && newForm.benefitType === 3 }))
      rules.benefitAsyncCouponLimit = rules.benefitAsyncCouponLimit.map(it => ({ ...it, required: newForm.benefitType && newForm.benefitType !== 3 }))
      rules.compoundFlag = rules.compoundFlag.map(it => ({ ...it, required: newForm.benefitType && newForm.benefitType !== 3 }))
      rules.promotionCode = rules.promotionCode.map(it => ({ ...it, required: newForm.benefitType && newForm.benefitType !== 3 && newForm.compoundFlag !== 1 }))
      state.rules = rules
    }, { deep: true })

    const getNavTitle = () => {
      if (state.isCreate || state.isCopy) {
        return '新增权益项'
      }
      if (state.isEdit) {
        return '编辑权益项'
      }
      if (state.isCheck) {
        return '查看权益项'
      }
      return ''
    }

    // 编辑promotionCode，正确的值为table表中的
    const showPromotion = (promotionVisible = false) => {
      state.promotionVisible = promotionVisible
    }

    const onChangeWithPromotion = async (row = {}, reload = true) => {
      try {
        if (!isEmpty(row)) {
          state.projectModalInfo = { ...state.projectModalInfo, promotion: row }
          state.form = { ...state.form, ...pick(row, ['promotionCode', 'promotionName', 'effectiveTime']) }
          await requestPromotionDetail(row, reload)
          showPromotion(false)
        }
      } catch (error) {
        console.log(error)
      }
    }

    // 通过promotion设置关联的科室和项目
    const requestPromotionDetail = async (params = {}, reload = true) => {
      try {
        const res = await EquityManageApi.promotionDetail(params)
        if (res.code === 0) {
          state.sites = res.data.sites
          state.effects = res.data.effects
          // 编辑的时候，刚开始设置数据的时候不要删掉，之后选择回调的时候设置科室和项目
          if (reload) {
            state.hospitalModalInfo = { ...state.hospitalModalInfo, filterSites: [] }
            state.projectModalInfo = { ...state.projectModalInfo, filterData: [] }
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    /**
     * 院区和科室modal回调
     * @param {*} filterSites
     const item = {
      departmentId: 'JJC8001',
      departmentName: '嘉静门诊护理',
      siteId: 'JJC',
      siteName: '上海嘉静门诊部'
      }
     */
    const onChangeWithHospital = (filterSites = []) => {
      state.hospitalModalInfo = { ...state.hospitalModalInfo, filterSites }
    }

    /**
     * 选择项目回调
     * @param {*} selectProject
     */
    const onChangeWithProject = (filterData = []) => {
      state.projectModalInfo = { ...state.projectModalInfo, filterData: filterData }
    }

    // 展示promotion关联的院区
    const showHospitalModal = (visible = true) => {
      if (!state.form.promotionCode) {
        Message('输入查询Promotion的名称或选择Code')
        return
      }
      state.hospitalModalInfo = { ...state.hospitalModalInfo, visible, data: state.sites }
    }
    // 展示promotion关联的项目
    const showProjectModal = (visible = true) => {
      if (!state.form.promotionCode) {
        Message('输入查询Promotion的名称或选择Code')
        return
      }
      state.projectModalInfo = { ...state.projectModalInfo, visible, data: state.effects }
    }

    const deleteProjectOption = (row) => {
      if (row) {
        const filterData = state.projectModalInfo.filterData?.filter(it => it.projectId !== row.projectId)
        state.projectModalInfo = { ...state.projectModalInfo, filterData }
      }
    }

    /**
     * 新增table空数据
     */
    const addEquityOptions = () => {
      // 新增数组空对象
      if (!state.tableData?.length) {
        state.tableData = [{ benefitId: '0', benefitName: '', sortNum: null, isSave: false, visible: false }]
        return
      }
      const pass = state.tableData.every(it => it.isSave)
      if (!pass) {
        Message.error('权益项数据未保存')
        return
      }
      // 存在，push
      state.tableData = [...state.tableData, ...[{ benefitId: '0', benefitName: '', sortNum: null, isSave: false, visible: false }]]
    }

    /**
     * 设置row里面的编辑状态
     * 设置tableRow数据源
     * todo 判断是否是子表
     */
    const saveRow = (row) => {
      // 判断数据源，判断是否是子表
      let warningTitle = '请填写核销顺序'
      if (row.benefitId === '0' || !row.sortNum) {
        row.benefitId === '0' && (warningTitle = '请选择权益项')
        Message.error(warningTitle)
        return
      }
      const list = state.tableData.map(it => {
        if (it.benefitId === row.benefitId) {
          it.isSave = true
        }
        return it
      })

      state.tableData = list
    }

    /**
     * 删除tableRow数据源
     */
    const deleteRow = (row) => {
      if (!isEmpty(row)) {
        const list = state.tableData.filter(it => it.benefitId !== row.benefitId) || []
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
    // 设置当前选项
    const onChangeWithEquityOption = (selectRow = {}, row = {}) => {
      if (!isEmpty(selectRow)) {
        // 重置单前项目， 这里有compoundFlag字段
        const tableData = cloneDeep(state.tableData) || []
        const list = tableData.map(it => {
          if (it.benefitId === row.benefitId) {
            it = { ...it, ...selectRow, visible: false, sortNum: null, isSave: false }
          }
          return it
        })
        state.tableData = list
      }
    }

    const onSubmit = debounce(async () => {
      if (state.isCheck) {
        cancel()
        return
      }
      try {
        await checkForm()
        // 体检大类需要设置benefitSuperClass, 新建和拷贝设置空
        const params = {
          ...state.form,
          ...state.userInfo,
          benefitAsyncCouponLimit: state.form?.benefitAsyncCouponLimit?.toString() || '',
          benefitSuperClass: state.form.benefitType === 3 ? 2 : state.form.compoundFlag === 1 ? null : 1,
          ...(state.form.benefitType === 3 && { compoundFlag: 0, benefitClass: 3 })
        }

        // 规则写死，为了兼容劵平台
        const couponRule = {
          couponRuleId: null,
          medicalInstitutionId: null,
          couponDefinitionId: null,
          receiveRestricted: 1,
          useRestricted: null,
          useWay: null,
          usePrice: null,
          overlying: null,
          isOverlay: 1,
          verifiCheck: 1,
          splitCouponSet: null,
          useLimit: 1,
          limitAchieveAmount: null,
          limitReduceAmount: null,
          createStaffId: null,
          createTime: null,
          lastUpdateTime: null,
          valid: null,
          restrictedMedicalInstitutionIds: null,
          couponRmiList: null,
          whetherRestrict: 1,
          restrictTotal: null
        }
        let pass = true
        let warningTitle = '请填写核销顺序'
        // 添加规则
        if (state.form.benefitType !== 3) {
          params.couponRule = couponRule
          if (state.form.compoundFlag === 0) {
            // 添加规则
            params.couponRule = couponRule
            // 添加院区 & 科室
            params.departments = state.hospitalModalInfo.filterSites
            // 添加项目
            params.effects = state.projectModalInfo.filterData
          }
          // 添加关联项
          if (state.form.compoundFlag === 1) {
            const compoundBenefitRelations = state.tableData.map(it => {
              if (!it.sortNum || it.benefitId === '0') {
                warningTitle = it.benefitId === '0' ? '请选择权益项' : warningTitle
                pass = false
                return it
              }
              return it
            }) || []
            params.compoundBenefitRelations = compoundBenefitRelations
          }
        }

        if (!pass) {
          Message.error(warningTitle)
          return
        }

        const relationFlag = state.form?.compoundFlag === 1 && state.form?.benefitType !== 3
        // 是复合权益并且权益大类不是体检预约
        if (relationFlag && state.isEdit) {
          await EquityManageApi.update(params, true, true)
        }
        // 调用基础信息的
        const res = await EquityManageApi.update(params, state.isEdit, false)

        // 是复合权益并且权益大类不是体检预约
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
        if (state.form.benefitType !== 3) {
          // 复合权益
          // 请设置设置科室
          if (state.form?.compoundFlag === 0 && !state.hospitalModalInfo.filterSites?.length) {
            Message.error('请选择院区和科室')
            return Promise.reject()
          }
          // 复合权益
          // 请设置设置项目
          if (state.form?.compoundFlag === 0 && !state.projectModalInfo.filterData?.length) {
            Message.error('请选择项目')
            return Promise.reject()
          }
          const inCludeTableData = state.tableData.filter(it => it.benefitId !== '0' && it.benefitName && it.sortNum)
          if (state.form?.compoundFlag === 1 && !inCludeTableData?.length) {
            Message.error('请设置权益项')
            return Promise.reject()
          }
        }

        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    }

    const cancel = () => {
      emit('cancel')
      state.tableData = []
      // 这里要清除，要不然会复用数据。
      state.hospitalModalInfo = { ...state.hospitalModalInfo, filterSites: [] }
      state.projectModalInfo = { ...state.projectModalInfo, filterData: [] }
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
      showHospitalModal,
      showProjectModal,
      ...toRefs(state),
      showPromotion,
      onChangeWithPromotion,
      onChangeWithHospital,
      onChangeWithProject,
      deleteProjectOption,
      dismissModal,
      showModal,
      addEquityOptions,
      saveRow,
      deleteRow,
      onChangeWithEquityOption
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

       &.custom {
        /deep/ .el-form-item__content {
          width: 460px !important;
        }
       }
       .input-item,.select-item,.checkBox,.date-picker-item, .radio-item, .checkBox-item {
         width: 100%;
       }
       .input-item {
         // 设置权益项不给设置内容，否则会撑开
         position: relative;
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
       .subText {
         margin-right: 16px;
       }
       .department {
        overflow: hidden;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
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
 .addButton {
  width: 80px;
  margin-top: 16px;
 }
 .equity-option-table {
    overflow: visible;
    /deep/ .el-table__body-wrapper {
      overflow: visible !important;
    }
 }
</style>
