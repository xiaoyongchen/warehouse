## 日历
```vue
import { getCalendar } from '@/utils/date';
import { computed, defineComponent, reactive, ref, nextTick, watch } from 'vue';
import { Swipe, SwipeItem } from 'vant';
import './Calendar.less';
import dayjs from 'dayjs';
import { onClickOutside } from "@vueuse/core";

const Props = {
  startTime: {
    type: Number,
    default: dayjs().startOf('day').valueOf(),
  },
  endTime: {
    type: Number,
    default: dayjs().add(2, 'month').endOf('day').valueOf(),
  },
  selectDate: {
    type: [Number, String],
    default: dayjs().startOf('day').valueOf(),
  },
  weeks: Array,
  visible: {
    type: Boolean,
    default: false,
  },
  remark: String,
  monudId: String,
}
export default defineComponent({
  name: 'Calendar',
  props: Props,
  emits: ['change'],
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
  },
  setup: (props, { emit }) => {
    const calendarRef = ref();
    const { startTime, endTime } = props || {};
    const state = reactive({
      calendar: computed(() => getCalendar(startTime, endTime)),
      selectIndex: 0,
      subject: computed(() => getSubject()),
    });

    const getSubject = (): string => {
      if (state?.calendar?.length && state?.calendar[state.selectIndex]) {
        return dayjs(state?.calendar[state.selectIndex]?.startNow).format('YYYY.MM')
      }
      return "";
    };

    // TODO【chenxiaoyong】 只能用ref
    onClickOutside(calendarRef, () => {
      console.log('>>>>>:', 111);
      emit("change");
    });

    watch(() => props.selectDate, (val) => {
      nextTick(() => {
        getSelectIndex(val);
        computedMarginTop();
      });
    });
    const computedMarginTop = () => {
      if (!props.monudId) {
        return;
      }
      const dateDom = document.getElementById(props.monudId);
      const thisDom = document.getElementById("calendar-picker");
      if (dateDom && thisDom) {
        const { top = 0, height = 0 } = dateDom.getBoundingClientRect() || {};
        thisDom.style.marginTop = top + height + 12 + "px";
      }
    };

    const pre = () => {
      if (state?.calendar?.length) {
        state.selectIndex = state.selectIndex > 0 ? state.selectIndex - 1 : 0;
      }
    };

    const next = () => {
      if (state?.calendar?.length) {
        state.selectIndex = state.selectIndex === state?.calendar?.length - 1 ? state?.calendar?.length - 1 : state.selectIndex + 1;
      }
    };

    const onSwipeTo = (index: number) => {
      // TODO chenxiaoyong index 滑动过快有可能为null or NaN, 组件的问题
      if (state?.calendar?.length && typeof index === "number" && !isNaN(index)) {
        state.selectIndex = index;
      }
    };

    // 在开始和结束时间外的
    const isOutside = (day: Day) => {
      const { startNow, endNow } = day;
      return startNow < startTime || endNow > endTime;
    };

    // monthItem: { endNow: 单前月的结束时间第二天凌晨; startNow: 单前月开始时间 }
    const isDisable = (day: Day, monthItem: { endNow: number; startNow: number }) => {
      const { startNow, endNow } = monthItem || {};
      // if (day?.startNow < startNow) {
      //   return true;
      // }

      // if (day?.endNow > endNow) {
      //   return true;
      // }

      return false;
    };

    const isActive = (day: Day, monthItem: { endNow: number; startNow: number }) => {
      if (isDisable(day, monthItem)) {
        return false;
      }
      const { startNow, endNow } = day;
      const currentSelectDate = typeof props.selectDate === 'number' ? props.selectDate : dayjs(props.selectDate).valueOf();
      return currentSelectDate >= startNow && currentSelectDate < endNow;
    };

    const onChangeTime = (day: Day) => {
      emit("change", day);
    };

    const getSelectIndex = (selectDate: number | string) => {
      if (state?.calendar?.length) {
        const currentIndex = state.calendar.findIndex((it: any) => {
          const { days } = it || {};
          const daysIndex = days?.findIndex((day: Day) => {
            // date === thatDay 确定是那个月
            const { startNow, endNow, date, thatDay } = day;
            const currentSelectDate = typeof selectDate === 'number' ? selectDate : dayjs(selectDate).valueOf();
            return startNow <= currentSelectDate && endNow > currentSelectDate && date === thatDay;
          });

          return daysIndex >= 0;
        });

        const swiperCurrentIndex = currentIndex >= 0 ? currentIndex : 0;
        state.selectIndex = swiperCurrentIndex;
      }
    };

    const renderWeekItem = () => {
      const { weeks = [] } = props || {};
      if (!weeks.length) {
        return null;
      }
      return (
        <div class="content-thead-box">
          {
            weeks.map((week, weekIndex) => {
              return (
                <div
                  key={weekIndex}
                  class="cell"
                >
                  <span class="title">{week}</span>
                </div>
              )
            })
          }
        </div>
      )
    }

    const renderDayItem = (months: any) => {
      if (!months.weeks.length) {
        return null;
      }
      return (
        <div>
          {
            months.weeks.map((week: any) => {
              if (!week?.length) {
                return null;
              }
              return (
                <div class="content-row-box">
                  {
                    week.map((thatDays: any) => {
                      return (
                        <div
                          key={thatDays.thatDay}
                          class={[
                            'cell',
                            isActive(thatDays, months) && 'active',
                            isOutside(thatDays) && 'outside',
                            isDisable(thatDays, months) && 'disable'
                          ]}
                          onClick={() => onChangeTime(thatDays)}
                        >
                          <span class="day">{thatDays.thatDay}</span>
                        </div>
                      )
                    })
                  }
                </div>
              )
            })
          }
        </div >
      )
    }

    return () => {
      if (!props.visible) {
        return null
      }
      const { subject, selectIndex, calendar } = state || {};

      return (
        <teleport to="body">
          <div class="jh-calendar">
            <div class="calendar-picker" id="calendar-picker">
              <div class="calendar" ref={calendarRef}>
                <div class="calendar-container">
                  <div class="header">
                    <div class="button">
                      <span class="pre" onClick={pre}></span>
                      <span class="title">{subject}</span>
                      <span class="next" onClick={next}></span>
                    </div>
                    <div class="mark">
                      <span class="icon"></span>
                      <span class="title">{props.remark}</span>
                    </div>
                  </div>
                  <van-swipe
                    class="calendar-swiper"
                    autoplay={false}
                    initial-swipe={selectIndex}
                    show-indicators={false}
                    loop={false}
                    onChange={onSwipeTo}
                  >
                    {
                      calendar.map((months, index) => {
                        return (
                          <van-swipe-item
                            class="calendar-swiper-item"
                            key={index}
                          >
                            <div class="content-box">
                              {renderWeekItem()}
                              {renderDayItem(months)}
                            </div>
                          </van-swipe-item >
                        )
                      })
                    }
                  </van-swipe>
                </div>
              </div>
            </div >
          </div >
        </teleport >
      );
    };
  },
});

type STATE = {
  calendar: any;
  selectIndex: number;
  subject: string;
};

type Day = {
  readonly date: number;
  readonly endNow: number;
  readonly startNow: number;
  readonly month: number;
  readonly thatDay: number;
  readonly week: number;
  readonly year: number;
};


```

## styles

```style
@preImage: url(../../../assets/images/consultList/week_left.png);
@nextImage: url(../../../assets/images/consultList/week_right.png);

.jh-calendar {
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  z-index: 9999;
  .calendar-picker {
    display: flex;
    margin-top: 364px;
    display: flex;
    width: 100%;
    flex-direction: column;
    border-radius: 40px 40px 0 0;
    background-color: rgba(29, 39, 45, 0.5);
    box-shadow: 0px 20px 40px 0px rgba(29, 39, 45, 0.2);
  }
  .calendar {
    width: 100%;
    height: 553px;
    border-radius: 40px;
    background-color: #ffffff;
    .calendar-container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;

      .header {
        height: 112px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
       .button {
          display: flex;
          flex-direction: row;
          align-items: center;
          .pre {
            width: 98px;
            height: 32px;
            background-image: @preImage;
            background-repeat: no-repeat;
            background-position: 44px center;
            background-size: auto 24px;
          }
          .title {
            font-size: 32px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #36444E;
          }
          .next {
            .pre;
            background-image: @nextImage;
            background-position: 40px center;
          }
        }
        .mark {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding-right: 44px;
          .icon {
            width: 10px;
            height: 10px;
            background: #48C9EF;
            border-radius: 100%;
          }
          .title {
            margin-left: 8px;
            font-size: 24px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #48C9EF;
          }
        }
      }

      .calendar-swiper {
        flex: 1;
        overflow: hidden;
        .calendar-swiper-item {
          .content-box {
            padding: 0 16px;
            .content-thead-box {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr; 
              gap: 0px 0px; 
              grid-template-areas: 
                ". . . . . . ."; 
              justify-items: center;
              margin-bottom: 32px;
              .cell {
                width: 70px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;

                .title {
                  font-size: 24px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #36444e;
                }
              }
            }
            .content-row-box {
              display: grid; 
              grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr; 
              gap: 0px 0px; 
              grid-template-areas: 
                ". . . . . . ."; 
              justify-items: center;
              .cell {
                width: 70px;
                height: 70px;
                border-radius: 70px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                .day,
                .explan {
                  height: 28px;
                  font-size: 28px;
                  line-height: 28px;
                  font-family: PingFangSC-Medium, PingFang SC;
                  font-weight: 500;
                  color: #36444e;
                }

                .explan {
                  font-size: 20px;
                  font-weight: 400;
                  font-family: PingFangSC-Regular, PingFang SC;
                }
                // 目前结果超出和不是当前月的处理一样的
                &.outside,
                &.disable {
                  .day,
                  .explan {
                    font-weight: 400;
                    color: #86949e;
                    font-family: PingFangSC-Regular, PingFang SC;
                  }
                }
                &.outside {
                  pointer-events: none;
                }
                &.active {
                  background-color: #45d4a8;
                  .day,
                  .explan {
                    color: #ffffff;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

```