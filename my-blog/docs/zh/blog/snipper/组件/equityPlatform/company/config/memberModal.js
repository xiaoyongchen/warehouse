const formKeys = [
  {
    formType: 'input',
    prop: 'nickName',
    disabled: false,
    label: '姓名',
    clearable: true,
    placeholder: '请输入姓名'
  },
  {
    formType: 'input',
    prop: 'mobileNo',
    disabled: false,
    label: '手机号',
    maxlength: 20,
    clearable: true,
    placeholder: '请输入手机号'
  }
]

const initialForm = {
  nickName: null,
  mobileNo: null
}

const initialRules = {
  mobileNo: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
}

export {
  initialRules,
  initialForm,
  formKeys
}

export default {}
