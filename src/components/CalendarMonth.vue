<template>
  <div class="calendar-month">
    <div class="month-name">
      {{ month.start | moment('MMM YYYY') }}
    </div>
    <div class="month-table-container">
      <table class="month-table">
        <thead class="month-table-header">
        <tr>
          <th class="month-table-header-day" v-for="dayLabel in dayLabels" :key="dayLabel">{{ dayLabel }}</th>
        </tr>
        </thead>
        <tbody class="month-table-body">
          <tr v-for="week in weeks" :key="week.id">
            <calendar-day
              @clicked="dayClicked($event)"
              @hovered="dayHovered($event)"
              v-for="day in week.days"
              :key="day.id"
              :day="day"
              :selected="isDaySelected(day.moment)"
              :is-selecting="isSelecting"
              :is-first-selected="isFirstDaySelected(day.moment)"
              :is-last-selected="isLastDaySelected(day.moment)"
              :is-invalid="isInvalid"
            />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>


import CalendarDay from './CalendarDay.vue'

export default {
  name: 'CalendarMonth',
  props: {
    month: Object,
    selectedDays: Array,
    isSelecting: Boolean,
    isInvalid: Boolean,
  },
  data() {
    return {
      dayLabels: [],
      weeks: [],
      dayRange: []
    }
  },
  methods: {
    isDaySelected: function(day) {
      return this.dayIndexInSelection(day) >= 0
    },
    isFirstDaySelected: function (day) {
      return this.dayIndexInSelection(day) === 0
    },
    isLastDaySelected: function (day) {
      return this.dayIndexInSelection(day) === this.selectedDays.length - 1
    },
    dayIndexInSelection: function (day) {
      return this.selectedDays.map((selectedDay) => {
        return selectedDay.format('YYYY-M-D')
      }).indexOf(day.format('YYYY-M-D'))
    },
    computeDayLabels: function () {
      const dayLabels = this.$moment.weekdays(true)
      return dayLabels.map(function (dayLabel){
        return dayLabel.substring(0, 2)
      })
    },
    computeDayRange: function () {
      const startOfMonthMoment = this.$moment(this.month.start).startOf('week').subtract(1, 'days')
      const endOfMonthMoment = this.$moment(this.month.start).endOf('month').endOf('week').add(1, 'days')
      const bookedDaysAsStrings = this.month.bookedDays.map((day) => {
        return day.format('YYYY-M-D')
      })
      const blockedDaysAsStrings = this.month.blockedDays.map((day) => {
        return day.format('YYYY-M-D')
      })

      const range = this.$moment.range(startOfMonthMoment, endOfMonthMoment)
      return Array.from(range.by('days')).map((day) => {
        return {
          name: day.format('YYYY-M-D'),
          moment: day,
          isBooked: (bookedDaysAsStrings.length > 0 ? bookedDaysAsStrings.includes(day.format('YYYY-M-D')) : false),
          isBlocked: (blockedDaysAsStrings.length > 0 ? blockedDaysAsStrings.includes(day.format('YYYY-M-D')) : false),
        }
      })
    },
    computeDayStatuses: function (day) {
      const dayIndex = this.dayRange.findIndex(x => x.name == day.format('YYYY-M-D'))

      const isDayFirstBooked = this.dayRange[dayIndex].isBooked
        && (!this.dayRange[dayIndex - 1].isBooked || this.dayRange[dayIndex - 1].isBlocked);
      const isPreviousDayFirstBooked = this.dayRange[dayIndex - 1].isBooked
        && (!this.dayRange[dayIndex - 2].isBooked || this.dayRange[dayIndex - 2].isBlocked);

      const isDayLastBooked = this.dayRange[dayIndex].isBooked
        && (!this.dayRange[dayIndex + 1].isBooked || this.dayRange[dayIndex + 1].isBlocked);
      const isNextDayLastBooked = this.dayRange[dayIndex + 1].isBooked
        && (!this.dayRange[dayIndex + 2].isBooked || this.dayRange[dayIndex + 2].isBlocked);

      const isDayFirstBlocked = this.dayRange[dayIndex].isBlocked
        && (!this.dayRange[dayIndex - 1].isBlocked || this.dayRange[dayIndex - 1].isBooked);
      const isPreviousDayFirstBlocked = this.dayRange[dayIndex - 1].isBlocked
        && (!this.dayRange[dayIndex - 2].isBlocked || this.dayRange[dayIndex - 2].isBooked);

      const isDayLastBlocked = this.dayRange[dayIndex].isBlocked
        && (!this.dayRange[dayIndex + 1].isBlocked || this.dayRange[dayIndex + 1].isBooked);
      const isNextDayLastBlocked = this.dayRange[dayIndex + 1].isBlocked
        && (!this.dayRange[dayIndex + 2].isBlocked || this.dayRange[dayIndex + 2].isBooked);

      return {
        booked: this.dayRange[dayIndex].isBooked,
        isFirstBooked:  isDayFirstBooked && !isPreviousDayFirstBooked,
        isLastBooked: isDayLastBooked && !isNextDayLastBooked,
        blocked: this.dayRange[dayIndex].isBlocked,
        isFirstBlocked:  isDayFirstBlocked && !isPreviousDayFirstBlocked,
        isLastBlocked: isDayLastBlocked && !isNextDayLastBlocked,
      }
    },
    dayClicked: function(date) {
      this.$emit('daySelected', date)
    },
    dayHovered: function(date) {
      this.$emit('dayHovered', date)
    },
    renderMonth: function() {
      this.dayRange = this.computeDayRange()
      this.dayLabels = this.computeDayLabels()

      for (let weekIndex = 0; weekIndex < 5; weekIndex++) {
        let weekDays = []
        let firstDayOWeek = this.$moment(this.month.start).startOf('week').add(weekIndex, 'weeks')
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
          let day = this.$moment(firstDayOWeek).add(dayIndex, 'days')
          let dayStatuses = this.computeDayStatuses(day)

          weekDays.push({
            id: dayIndex,
            moment: day,
            isBooked: dayStatuses.booked,
            isFirstBooked: dayStatuses.isFirstBooked,
            isLastBooked: dayStatuses.isLastBooked,
            isBlocked: dayStatuses.blocked,
            isFirstBlocked: dayStatuses.isFirstBlocked,
            isLastBlocked: dayStatuses.isLastBlocked,
          })
        }
        this.weeks.push({
          id: weekIndex,
          days: weekDays
        })
      }
    }
  },
  mounted() {
    this.renderMonth()
  },
  components: { CalendarDay }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .month-name {
    font-weight: 700;
    text-transform: capitalize;
    height: 30px;
    line-height: 30px;
    text-align: center;
  }

  .month-table-container {
    width: 80%;
    margin-top: 10px;
    margin-left: 10%;
  }

  .month-table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
  }

  .month-table-header {
    display: table-header-group;
  }

  .month-table-header-day {
    font-size: 0.85rem;
    font-weight: 100;
    color: #999;
    text-transform: capitalize;
    border-bottom: 1px solid #bbb;
    padding-bottom: 8px;
  }
</style>
