const formKeys = [
  {
    formType: 'title',
    prop: 'baseInfo',
    disabled: false,
    label: '基本信息',
    span: 24
  },
  {
    formType: 'select',
    prop: 'benefitType',
    disabled: false,
    label: '权益项分类',
    clearable: true,
    placeholder: '请选择权益项分类',
    options: [
      {
        value: 1,
        label: '图文问诊'
      },
      {
        value: 2,
        label: '视频问诊'
      },
      {
        value: 3,
        label: '体检预约'
      },
      {
        value: 4,
        label: '体检报告解读'
      },
      {
        value: 5,
        label: '线下门诊预约'
      },
      {
        value: 6,
        label: '其他'
      }
    ]
  },
  {
    formType: 'input',
    prop: 'benefitName',
    disabled: false,
    label: '权益项名称',
    maxlength: 50,
    clearable: true,
    placeholder: '请输入权益项名称',
    span: 12
  },
  {
    formType: 'input',
    prop: 'benefitEnglishName',
    disabled: false,
    label: '权益项英文名称',
    maxlength: 200,
    clearable: true,
    placeholder: '请输入权益项英文名称',
    span: 12
  },
  {
    formType: 'input',
    prop: 'benefitTitle',
    disabled: false,
    label: '副标题',
    maxlength: 50,
    clearable: true,
    placeholder: '请输入副标题',
    span: 12
  },
  {
    formType: 'input',
    prop: 'benefitEnglishTitle',
    disabled: false,
    label: '英文副标题',
    maxlength: 200,
    clearable: true,
    placeholder: '请输入英文副标题',
    span: 12
  },
  {
    formType: 'uploadImage',
    prop: 'benefitIcon',
    disabled: false,
    label: '图标',
    size: 'small',
    limitKbSize: 10 * 1024,
    tips: '支持jpg，png等常见格式'
  },
  {
    formType: 'title',
    prop: 'couponInfo',
    disabled: false,
    label: '优惠信息',
    span: 24,
    hidden: (form) => {
      if (form.benefitType !== 3) {
        return false
      }
      return true
    }
  },
  {
    formType: 'checkBox',
    prop: 'benefitAsyncCouponLimit',
    disabled: false,
    label: '不可叠加的优惠券',
    size: 'small',
    class: 'custom',
    options: [
      {
        label: 1,
        title: '折扣券'
      },
      {
        label: 6,
        title: '抵用券'
      },
      {
        label: 7,
        title: '红包'
      },
      {
        label: 4,
        title: '满减劵'
      }
    ],
    hidden: (form) => {
      if (form.benefitType !== 3) {
        return false
      }
      return true
    }
  },
  {
    formType: 'radio',
    prop: 'benefitUsePlatform',
    disabled: false,
    label: '使用方式',
    size: 'small',
    options: [
      {
        label: 1,
        title: '线上'
      },
      {
        label: 2,
        title: '线下'
      }
    ]
  },
  {
    formType: 'radio',
    prop: 'benefitClass',
    disabled: false,
    label: '权益类型',
    size: 'small',
    class: 'custom',
    options: [
      {
        label: 3,
        title: '折扣' // 折扣劵
      }
    ],
    hidden: (form) => {
      if (form.benefitType !== 3) {
        return false
      }
      return true
    }
  },
  {
    formType: 'radio',
    prop: 'compoundFlag',
    disabled: false,
    label: '是否复合权益',
    size: 'small',
    options: [
      {
        label: 0,
        title: '否'
      },
      {
        label: 1,
        title: '是'
      }
    ],
    hidden: (form) => {
      if (form.benefitType !== 3) {
        return false
      }
      return true
    }
  },
  // 为体检的时候必填
  {
    formType: 'input',
    prop: 'benefitSuperClassId',
    disabled: false,
    label: '关联pkg',
    maxlength: 200,
    clearable: true,
    placeholder: '请输入关联的pkg',
    hidden: (form) => {
      if (form.benefitType === 3) {
        return false
      }
      return true
    }
  },
  {
    formType: 'table',
    prop: 'promotionCode',
    disabled: false,
    label: '关联promotion',
    clearable: true,
    class: 'custom',
    placeholder: '输入查询Promotion的名称或选择Code',
    hidden: (form) => {
      if (form.benefitType !== 3 && form.compoundFlag === 0) {
        return false
      }
      return true
    }
  },
  {
    formType: 'text',
    prop: 'promotionName',
    disabled: false,
    label: 'promotion名称',
    placeholder: '请输入关联的pkg',
    options: [],
    hidden: (form) => {
      if (form.benefitType !== 3 && form.compoundFlag === 0) {
        return false
      }
      return true
    }
  },
  {
    formType: 'text',
    prop: 'effectiveTime',
    disabled: false,
    label: 'promotion有效期',
    options: [],
    hidden: (form) => {
      if (form.benefitType !== 3 && form.compoundFlag === 0) {
        return false
      }
      return true
    }
  },
  {
    formType: 'department',
    prop: 'channelIds',
    disabled: false,
    label: '院区&科室范围',
    placeholder: '请选择',
    class: 'custom',
    hidden: (form) => {
      if (form.benefitType !== 3 && form.compoundFlag === 0) {
        return false
      }
      return true
    }
  },
  {
    formType: 'button',
    prop: 'channelIds',
    disabled: false,
    label: '使用项目',
    placeholder: '选择项目',
    hidden: (form) => {
      if (form.benefitType !== 3 && form.compoundFlag === 0) {
        return false
      }
      return true
    }
  }
]

const initialForm = {
  benefitType: null,
  benefitSuperClass: null,
  benefitName: null,
  benefitEnglishName: null,
  benefitTitle: null,
  benefitEnglishTitle: null,
  benefitIcon: null,
  benefitUsePlatform: null,
  // 这个必须设置空数组，要不然报错
  benefitAsyncCouponLimit: [],
  compoundFlag: null,
  benefitSuperClassId: null,
  // 默认权益项目
  benefitClass: 3
}

// 体检必须的
const initialRules = {
  benefitType: [{ required: true, message: '请选择权益项类型', trigger: ['blur', 'change'] }],
  benefitName: [{ required: true, message: '请输入权益项名称', trigger: 'blur' }],
  benefitEnglishName: [{ required: true, message: '请输入权益项英文名称', trigger: 'blur' }],
  benefitTitle: [{ required: true, message: '请输入副标题', trigger: 'blur' }],
  benefitEnglishTitle: [{ required: true, message: '请输入英文副标题', trigger: 'blur' }],
  benefitIcon: [{ required: true, message: '请上传图标', trigger: ['blur', 'change'] }],
  benefitUsePlatform: [{ required: true, message: '请选择使用方式', trigger: ['blur', 'change'] }],
  benefitClass: [{ required: true, message: '请选择权益类型', trigger: ['blur', 'change'] }],
  // 体检类有默认值
  compoundFlag: [{ required: false, message: '请选择是否复合权益', trigger: ['blur', 'change'] }],
  // 体检预约是必须的
  benefitSuperClassId: [{ required: false, message: '请输入pkg', trigger: 'blur' }],
  // 不是体检必须
  benefitAsyncCouponLimit: [{ required: false, message: '请选择不可叠加的优惠券', trigger: ['blur', 'change'] }],
  promotionCode: [{ required: false, message: '请选择关联的Promotion', trigger: ['blur', 'change'] }]
  // 院区，科室，使用项目
  // 否，选择项目，是关联权益。
}

const tableColumn = [
  {
    label: '项目编码',
    prop: 'projectId',
    showOverflowTooltip: true
  },
  {
    label: '项目/费用名称',
    prop: 'projectName',
    width: 120,
    showOverflowTooltip: true
  },
  {
    label: '英文名称',
    prop: 'projectEngName',
    width: 120,
    showOverflowTooltip: true
  },
  {
    label: '类型',
    prop: 'projectTypeName',
    showOverflowTooltip: true
  },
  {
    label: '规格',
    prop: 'standard',
    showOverflowTooltip: true
  },
  {
    label: '单价',
    prop: 'projectPrice',
    showOverflowTooltip: true
  },
  {
    label: '折扣比例',
    prop: 'discountPercent',
    scopedSlots: { customRender: 'discountPercent' },
    showOverflowTooltip: true
  },
  {
    label: '折扣金额',
    prop: 'discountPrice',
    showOverflowTooltip: true
  },
  {
    label: '折后金额',
    prop: 'amountAfterPrice',
    showOverflowTooltip: true
  },
  {
    label: '更新时间',
    prop: 'updateTime',
    showOverflowTooltip: true
  },
  { prop: 'actions', label: '操作', width: 120, align: 'center', fixed: 'right' }
]

export {
  initialRules,
  initialForm,
  formKeys,
  tableColumn
}

export default {}
