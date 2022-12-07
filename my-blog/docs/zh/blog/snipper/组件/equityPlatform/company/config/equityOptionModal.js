const formKeys = [
  {
    formType: 'input',
    prop: 'comboName',
    disabled: false,
    label: '套餐名称',
    maxlength: 100,
    clearable: true,
    placeholder: '请输入套餐名称'
  },
  {
    formType: 'input',
    prop: 'comboEnglishName',
    disabled: false,
    label: '套餐英文名称',
    maxlength: 300,
    clearable: true,
    placeholder: '请输入套餐英文名称'
  },
  {
    prop: 'time',
    type: 'daterange',
    formType: 'datePicker',
    disabled: false,
    label: '有效期',
    isRange: true,
    editable: false,
    rangeSeparator: '~',
    startPlaceholder: '开始时间',
    endPlaceholder: '结束时间'
  },
  {
    formType: 'radio',
    prop: 'comboActivationMode',
    disabled: false,
    label: '激活方式',
    size: 'small',
    class: 'custom',
    options: [
      {
        label: 2,
        title: '企业邮箱激活'
      },
      {
        label: 3,
        title: '权益邀请码激活'
      },
      {
        label: 1,
        title: '领取即激活'
      }
    ],
    span: 24
  },
  {
    formType: 'text',
    prop: 'companyReferralCode',
    disabled: false,
    maxlength: 6,
    label: '套餐邀请码',
    span: 24,
    hidden: form => {
      if (form.comboActivationMode === 3) {
        return false
      }
      return true
    }
  },
  {
    formType: 'input',
    prop: 'companyMailSuffix',
    disabled: false,
    label: '邮箱后缀',
    maxlength: 200,
    clearable: true,
    placeholder: '请输入邮箱后缀(如：qq.com)',
    span: 24,
    hidden: form => {
      if (form.comboActivationMode === 2) {
        return false
      }
      return true
    }
  },
  {
    formType: 'input',
    prop: 'remarks',
    disabled: false,
    label: '套餐备注',
    maxlength: 500,
    clearable: true,
    placeholder: '请输入套餐备注'
  },
  {
    formType: 'input',
    type: 'textarea',
    rows: 4,
    prop: 'comboRegulation',
    disabled: false,
    label: '规则说明',
    maxlength: 1000,
    showWordLimit: true,
    placeholder: '请输入规则说明'
  },
  {
    formType: 'input',
    prop: 'remarksEnglish',
    disabled: false,
    label: '套餐英文备注',
    maxlength: 500,
    clearable: true,
    placeholder: '请输入套餐英文备注'
  },
  {
    formType: 'input',
    type: 'textarea',
    rows: 4,
    prop: 'comboRegulationEnglish',
    disabled: false,
    label: '英文规则说明',
    maxlength: 1000,
    showWordLimit: true,
    placeholder: '请输入英文规则说明'
  }
]

const initialForm = {
  comboName: null,
  comboEnglishName: null,
  // 初始值需要设置为空，
  time: ['', ''],
  remarks: null,
  comboRegulation: null,
  remarksEnglish: null,
  comboRegulationEnglish: null,
  comboActivationMode: null,
  companyMailSuffix: null
}

// 是否要判断权益项
const initialRules = {
  comboName: [{ required: true, message: '请输入套餐名称', trigger: 'blur' }],
  comboEnglishName: [
    { required: true, message: '请输入套餐英文名称', trigger: 'blur' }
  ],
  time: [
    {
      required: true,
      message: '请选择有效期',
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (!value?.length) {
          return callback(new Error('请选择有效期'))
        }
        const [first, second] = value || []
        const flag = first && second
        if (!flag) {
          return callback(new Error('请选择有效期'))
        }
        callback()
      }
    }
  ],
  remarks: [{ required: true, message: '请输入套餐备注', trigger: 'blur' }],
  comboRegulation: [
    { required: true, message: '请输入规则说明', trigger: 'blur' }
  ],
  remarksEnglish: [
    { required: true, message: '请输入套餐英文备注', trigger: 'blur' }
  ],
  comboRegulationEnglish: [
    { required: true, message: '请输入英文规则说明', trigger: 'blur' }
  ],
  comboActivationMode: [
    { required: true, message: '请选择激活方式', trigger: 'change' }
  ],
  companyMailSuffix: [
    { required: false, message: '请输入邮箱后缀', trigger: 'blur' }
  ]
}

export { initialRules, initialForm, formKeys }

export default {}
