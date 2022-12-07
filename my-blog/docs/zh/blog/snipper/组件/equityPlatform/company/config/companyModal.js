const formKeys = [
  {
    formType: 'input',
    prop: 'companyName',
    disabled: false,
    label: '企业名称',
    maxlength: 50,
    clearable: true,
    placeholder: '请输入企业名称'
  },
  {
    formType: 'input',
    prop: 'companyShowName',
    disabled: false,
    label: '展示名称',
    maxlength: 50,
    clearable: true,
    placeholder: '请输入企业展示名称'
  },
  {
    formType: 'input',
    prop: 'companyShowNameEnglish',
    disabled: false,
    label: '展示英文名称',
    maxlength: 200,
    clearable: true,
    placeholder: '请输入企业展示英文名称'
  },
  {
    formType: 'input',
    type: 'textarea',
    rows: 4,
    prop: 'companyDesc',
    disabled: false,
    label: '描述',
    maxlength: 500,
    clearable: true,
    showWordLimit: true,
    placeholder: '请输入企业描述'
  },
  {
    formType: 'uploadImage',
    prop: 'companyLogo',
    disabled: false,
    label: '企业logo',
    size: 'small',
    limitKbSize: 10 * 1024,
    tips: '支持jpg，png等常见格式'
  }
]

const initialForm = {
  companyName: null,
  companyShowName: null,
  companyShowNameEnglish: null,
  companyDesc: null,
  companyLogo: ''
}

const initialRules = {
  companyName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
  companyShowName: [{ required: true, message: '请输入企业展示名称', trigger: 'blur' }],
  companyShowNameEnglish: [{ required: true, message: '请输入企业展示英文名称', trigger: 'blur' }],
  companyDesc: [{ required: false, message: '请输入企业描述', trigger: 'blur' }],
  companyLogo: [{ required: true, message: '请上传企业logo', trigger: ['blur', 'change'] }]
}

export {
  initialRules,
  initialForm,
  formKeys
}

export default {}
