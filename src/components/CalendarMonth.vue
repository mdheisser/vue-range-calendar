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
              v-for="day in week.days"
              :key="day.id"
              :date="day.moment"
              :isHidden="!isDayInMonth(day.moment)"
              :types-applied="day.typesApplied"
              :selection="{
                isSelected: isDaySelected(day.moment),
                isSelecting: isSelecting,
                isFirstSelected: isFirstDaySelected(day.moment),
                isLastSelected: isLastDaySelected(day.moment),
                isInvalid: isInvalid
              }"
              :is-day-selectable-function="isDaySelectableFunction"
              @clicked="dayClicked($event)"
              @hovered="dayHovered($event)"
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
    isDaySelectableFunction: Function,
  },
  data() {
    return {
      dayLabels: [],
      weeks: []
    }
  },
  watch: {
    'month': {
      handler: function () {
        this.renderMonth()
      },
      deep: true
    }
  },
  mounted() {
    this.renderMonth()
  },
  methods: {
    renderMonth: function() {
      this.weeks = []
      this.dayLabels = this.$moment.weekdays(true).map((dayLabel) => (dayLabel.substring(0, 2)))

      for (let weekIndex = 0; weekIndex < 5; weekIndex++) {
        let weekDays = []
        let firstDayOWeek = this.$moment(this.month.start).startOf('week').add(weekIndex, 'weeks')

        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
          let day = this.$moment(firstDayOWeek).add(dayIndex, 'days')
          const dayIndex = this.month.days.findIndex(x => x.moment.isSame(day))

          weekDays.push({
            id: dayIndex,
            moment: day,
            typesApplied: this.month.days[dayIndex].typesApplied
          })
        }
        this.weeks.push({
          id: weekIndex,
          days: weekDays
        })
      }
    },

    // Helpers
    isDayInMonth: function (day) {
      return day.month() === this.month.start.month()
    },
    isDaySelected: function (day) {
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
        return selectedDay.format('YYYY-MM-DD')
      }).indexOf(day.format('YYYY-MM-DD'))
    },

    // Events
    dayClicked: function (date) {
      this.$emit('daySelected', date)
    },
    dayHovered: function (date) {
      this.$emit('dayHovered', date)
    },
  },
  components: { CalendarDay }
}
</script>

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
