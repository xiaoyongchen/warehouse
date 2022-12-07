export const FormKeys = [
  {
    prop: 'keyword',
    formType: 'input',
    disabled: false,
    label: '',
    clearable: true,
    placeholder: '请输入项目编码或名称'
  },
  {
    prop: 'projectType',
    formType: 'select',
    disabled: false,
    clearable: true,
    label: '',
    placeholder: '请选择',
    style: { width: '120px' },
    options: [
      {
        label: '全部',
        value: null
      },
      {
        label: '项目',
        value: 2
      },
      {
        label: '费用',
        value: 1
      }
    ]
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
  { type: 'selection', width: 50 },
  {
    label: '项目编码',
    prop: 'projectId',
    showOverflowTooltip: true
  },
  {
    label: '名称',
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
  }
]

export default {}
