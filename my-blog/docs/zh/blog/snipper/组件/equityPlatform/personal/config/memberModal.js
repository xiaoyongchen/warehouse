const formKeys = [
  {
    formType: 'input',
    prop: 'mrnNo',
    disabled: false,
    label: 'MRN',
    maxlength: 30,
    clearable: true,
    placeholder: '请输入MRN'
  }
]

const initialForm = {
  mrnNo: null
}

const initialRules = {
  mrnNo: [{ required: true, message: '请输入MRN', trigger: 'blur' }]
}

export {
  initialRules,
  initialForm,
  formKeys
}

export default {}
