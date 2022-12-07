const formKeys = [
  {
    formType: 'input',
    prop: 'comboName',
    disabled: false,
    label: '套餐名称',
    maxlength: 50,
    clearable: true,
    placeholder: '请输入套餐名称'
  },
  {
    formType: 'input',
    prop: 'comboEnglishName',
    disabled: false,
    label: '套餐英文名称',
    maxlength: 250,
    clearable: true,
    placeholder: '请输入套餐英文名称'
  },
  {
    formType: 'input',
    prop: 'remarks',
    disabled: false,
    label: '套餐备注',
    maxlength: 1000,
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
    clearable: true,
    showWordLimit: true,
    placeholder: '请输入规则说明'
  },
  {
    formType: 'input',
    prop: 'remarksEnglish',
    disabled: false,
    label: '套餐英文备注',
    maxlength: 2500,
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
    maxlength: 2500,
    clearable: true,
    showWordLimit: true,
    placeholder: '请输入英文规则说明'
  },
  // effectBeginTime effectEndTime 一天的结尾
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
  }
]

const initialForm = {
  comboName: null,
  comboEnglishName: null,
  // 初始值需要这样设置
  time: ['', ''],
  remarks: null,
  comboRegulation: null,
  remarksEnglish: null,
  comboRegulationEnglish: null
}

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
  ]
}

export { initialRules, initialForm, formKeys }

export default {}
