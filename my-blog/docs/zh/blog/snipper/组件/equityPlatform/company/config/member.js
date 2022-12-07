export const FormKeys = [
  {
    prop: 'mobile',
    formType: 'input',
    disabled: false,
    label: '手机号',
    clearable: true,
    placeholder: '请输入手机号'
  },
  {
    prop: 'userName',
    formType: 'input',
    disabled: false,
    label: '用户姓名',
    clearable: true,
    placeholder: '请输入用户姓名'
  },
  {
    prop: 'mrnNo',
    formType: 'input',
    disabled: false,
    label: 'MRN',
    clearable: true,
    placeholder: '请输入MRN'
  },
  {
    prop: 'buttons',
    formType: 'buttons',
    buttonList: [
      {
        prop: 'search',
        size: 'small',
        type: 'primary',
        title: '查询',
        eventName: 'search'
      },
      {
        prop: 'reset',
        size: 'small',
        type: 'plain',
        title: '重置',
        eventName: 'reset'
      }
    ]
  }
]

export const Column = [
  { prop: 'userName', label: '姓名', align: 'center', showOverflowTooltip: true },
  { prop: 'mobile', label: '手机号', align: 'center', showOverflowTooltip: true },
  { prop: 'mrnNo', label: 'MRN', align: 'center', showOverflowTooltip: true },
  { prop: 'actions', label: '操作', align: 'center' }
]

export default {}
