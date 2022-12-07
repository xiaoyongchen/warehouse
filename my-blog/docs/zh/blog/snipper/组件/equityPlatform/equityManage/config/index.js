export const FormKeys = [
  {
    prop: 'benefitName',
    formType: 'input',
    disabled: false,
    label: '权益项名称',
    clearable: true,
    placeholder: '请输入权益项名称'
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
  { prop: 'benefitId', label: '权益项ID' },
  { prop: 'benefitName', label: '权益名称', align: 'center', showOverflowTooltip: true },
  { prop: 'benefitType', label: '权益分类', align: 'center', showOverflowTooltip: true },
  { prop: 'gmtCreated', label: '创建日期', showOverflowTooltip: true },
  { prop: 'operatorName', label: '创建人', align: 'center', showOverflowTooltip: true },
  { prop: 'actions', label: '操作', width: 200, align: 'center' }
]
export default {}
