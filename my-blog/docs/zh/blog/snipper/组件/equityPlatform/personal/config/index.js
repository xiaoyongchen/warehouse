export const FormKeys = [
  {
    prop: 'comboName',
    formType: 'input',
    disabled: false,
    label: '套餐名称',
    clearable: true,
    placeholder: '请输入套餐名称'
  },
  {
    prop: 'time',
    type: 'daterange',
    formType: 'datePicker',
    disabled: false,
    label: '创建日期',
    isRange: true,
    editable: false,
    rangeSeparator: '~',
    startPlaceholder: '开始时间',
    endPlaceholder: '结束时间',
    pickerOptions: {
      disabledDate: (time) => {
        return time.getTime() > new Date().getTime()
      }
    }
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
  { prop: 'comboId', label: '套餐ID', align: 'center', showOverflowTooltip: true },
  { prop: 'comboName', label: '套餐名称', showOverflowTooltip: true },
  { prop: 'gmtCreated', label: '创建日期', align: 'center', showOverflowTooltip: true },
  { prop: 'actions', label: '操作', width: 300, align: 'center' }
]

export default {}
