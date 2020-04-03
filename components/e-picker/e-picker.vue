<!-- 
	time:2020-02-23
 -->
<template>
  <view>
    <picker
      mode="multiSelector"
      :range="dateTimeArr"
      @change="pickerChange"
      :value="value"
      @columnchange="columnchange"
    >
      <view class="select-time"><slot></slot></view>
    </picker>
  </view>
</template>

<script>
export default {
  data() {
    return {
      dateTimeArr: [],
      value: [],
      pageYears: [],
      pageMonths: [],
      scrollYear: parseInt(this.defaultValue.substring(0, 4)),
      scrollMonth: parseInt(this.defaultValue.substring(5, 7)),
    };
  },
  props: {
    mode: {
      type: String,
      default: 'dateTime',
    },
    startYear: {
      type: String,
      default: '2015',
    },
    endYear: {
      type: String,
      default: '2040',
    },
    defaultValue: {
      type: String,
    },
  },
  watch: {
    scrollYear(y) {
      this.setDays(y, this.scrollMonth);
    },
    scrollMonth(m) {
      this.setDays(this.scrollYear, m);
    },
  },
  mounted() {
    this.initDateTime();
  },
  methods: {
    setDays(y, m) {
      let days = [];
      if (y % 4 == 0 && y % 100 != 0) {
        //闰年
        if (m == 2) {
          for (let i = 1; i <= 29; i++) {
            days.push(this.format(i) + '日');
          }
        } else if (m == 4 || m == 6 || m == 9 || m == 11) {
          for (let i = 1; i <= 30; i++) {
            days.push(this.format(i) + '日');
          }
        } else {
          for (let i = 1; i <= 31; i++) {
            days.push(this.format(i) + '日');
          }
        }
      } else {
        if (m == 2) {
          for (let i = 1; i <= 28; i++) {
            days.push(this.format(i) + '日');
          }
        } else if (m == 4 || m == 6 || m == 9 || m == 11) {
          for (let i = 1; i <= 30; i++) {
            days.push(this.format(i) + '日');
          }
        } else {
          for (let i = 1; i <= 31; i++) {
            days.push(this.format(i) + '日');
          }
        }
      }
      this.dateTimeArr.splice(2, 1, days);
      return days;
    },
    setTime() {
      let hours = [],
        minutes = [],
        seconds = [],
        hour = this.defaultValue.substring(11, 13),
        minute = this.defaultValue.substring(14, 16),
        second = this.defaultValue.substring(17, 19);
      for (let i = 0; i < 24; i++) {
        hours.push(this.format(i) + '时');
      }
      for (let i = 0; i < 60; i++) {
        minutes.push(this.format(i) + '分');
        seconds.push(this.format(i) + '秒');
      }
      this.dateTimeArr.push(hours);
      this.dateTimeArr.push(minutes);
      this.dateTimeArr.push(seconds);
      let hourIndex = hours.indexOf(hour + '时');
      let minuteIndex = minutes.indexOf(minute + '分');
      let secondIndex = seconds.indexOf(second + '秒');
      this.value.splice(3, 1, hourIndex);
      this.value.splice(4, 1, minuteIndex);
      this.value.splice(5, 1, secondIndex);
    },
    initDateTime() {
      let years = [],
        months = [],
        days = [],
        year = this.defaultValue.substring(0, 4),
        month = this.defaultValue.substring(5, 7),
        day = this.defaultValue.substring(8, 10);

      /* year ============================*/
      const startYear = parseInt(this.startYear);
      const endYear = parseInt(this.endYear);
      for (let i = startYear; i <= endYear; i++) {
        years.push(i + '年');
      }
      this.pageYears = years;
      this.dateTimeArr.push(years);
      let yearIndex = years.indexOf(year + '年');
      this.value.splice(0, 1, yearIndex);

      /* month ============================*/
      for (let i = 1; i <= 12; i++) {
        months.push(this.format(i) + '月');
      }
      this.pageMonths = months;
      this.dateTimeArr.push(months);
      let monthIndex = months.indexOf(month + '月');
      this.value.splice(1, 1, monthIndex);

      /* day ============================*/
      const y = parseInt(this.defaultValue.substring(0, 4));
      const m = parseInt(this.defaultValue.substring(5, 7));

      days = this.setDays(y, m);

      let dayIndex = days.indexOf(day + '日');
      this.value.splice(2, 1, dayIndex);

      /* 时分秒========================== */
      if (this.mode == 'dateTime') {
        this.setTime();
      }
    },
    getDateTimeValue(arr) {
      let y = parseInt(arr[0]),
        M = parseInt(arr[1]),
        d = parseInt(arr[2]),
        h = parseInt(arr[3]),
        m = parseInt(arr[4]),
        s = parseInt(arr[5]);
      if (this.mode == 'date') {
        return `${y}-${this.format(M)}-${this.format(d)}`;
      }
      return `${y}-${this.format(M)}-${this.format(d)} ${this.format(
        h
      )}:${this.format(m)}:${this.format(s)}`;
    },
    format(i) {
      return i >= 10 ? i : '0' + i;
    },
    pickerChange(e) {
      const value = e.detail.value;
      let timeArr = value.map((v, i) => {
        return this.dateTimeArr[i][v] || 0;
      });

      const selectTime = this.getDateTimeValue(timeArr);
      this.$emit('btnConfirm', {
        timeArr,
        selectTime,
      });
    },
    //用户滑动时触发
    columnchange(e) {
      const column = e.detail.column;
      const index = e.detail.value;
      if (column == 0) {
        let y = this.pageYears[index];
        this.scrollYear = parseInt(y);
      }
      if (column == 1) {
        let m = this.pageMonths[index];
        this.scrollMonth = parseInt(m);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.select-time {
  padding: 0 10rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
}
</style>
