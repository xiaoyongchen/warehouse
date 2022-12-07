export const FormKeys = [
  {
    prop: "companyName",
    formType: "input",
    disabled: false,
    label: "企业名称",
    clearable: true,
    placeholder: "请输入企业名称",
  },
  {
    prop: "time",
    type: "daterange",
    formType: "datePicker",
    disabled: false,
    label: "创建日期",
    isRange: true,
    editable: false,
    rangeSeparator: "~",
    startPlaceholder: "开始时间",
    endPlaceholder: "结束时间",
    clearable: false,
    pickerOptions: {
      disabledDate: (time) => {
        return time.getTime() > new Date().getTime();
      },
    },
    // 设置时间范围
    // pickerOptions: {
    //   timeRange: { minDate: null, maxDate: null },
    //   onPick: ({ minDate, maxDate }) => {
    //     const item = FlowFormKeys.find(it => it.prop === 'payTime')?.pickerOptions?.timeRange || {}
    //     item.minDate = minDate
    //     item.maxDate = maxDate
    //   },
    //   disabledDate: (time) => {
    //     const item = FlowFormKeys.find(it => it.prop === 'payTime')?.pickerOptions?.timeRange || {}
    //     if (item.maxDate) {
    //       return false
    //     }
    //     const maxDate = item.minDate && moment(item.minDate).add(30, 'days').endOf().toDate()
    //     if (maxDate && time && time?.getTime() > maxDate?.getTime()) {
    //       return true
    //     }
    //     return false
    //   }
    // }
  },
  {
    prop: "buttons",
    formType: "buttons",
    buttonList: [
      {
        prop: "search",
        size: "small",
        type: "primary",
        title: "查询",
        eventName: "search",
      },
      {
        prop: "reset",
        size: "small",
        type: "plain",
        title: "重置",
        eventName: "reset",
      },
    ],
  },
];

export const Column = [
  { prop: "companyId", label: "企业ID", align: "center", width: 200 },
  { prop: "companyName", label: "企业名称", align: "center" },
  { prop: "companyDesc", label: "描述", showOverflowTooltip: true },
  { prop: "gmtCreated", label: "创建日期", showOverflowTooltip: true },
  { prop: "actions", label: "操作", align: "center" },
];

export default {};
