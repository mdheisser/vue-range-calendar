<template>
  <div class="calendar-container" ref="calendarContainer">
    <calendar-month-slider direction="previous" @click.native="slideMonths('previous')"/>
    <calendar-month-slider direction="next" @click.native="slideMonths('next')" />
    <div class="calendar-month-container" v-for="month in months" :key="month.id">
      <calendar-month
        @daySelected="daySelected($event)"
        @dayHovered="dayHovered($event)"
        :month="month"
        :selectedDays="selectedDays"
        :is-selecting="isSelecting"
        :is-invalid="isInvalid"
        :is-day-selectable-function="isDaySelectableFunction"
        :options="{ colors: options.colors, mode: options.mode }"
        :daySize="daySize"
      />
    </div>
  </div>
</template>

<script>
import CalendarMonth from './CalendarMonth.vue'
import CalendarMonthSlider from './CalendarMonthSlider.vue'

export default {
  name: 'Calendar',
  props: {
    options: Object,
    monthsNumber: Number,
    startDay: String,
    types: Object,
    dayLabels: Array,
    isSelectionValidFunction: Function,
    isDaySelectableFunction: Function,
  },
  data() {
    return {
      months: [],
      selectedDays: [],
      days: [],
      daySize: 30,

      isSelecting: false,
      isInvalid: false,
      startSelectionDate: null,
      endSelectionDate: null,
    }
  },
  mounted() {
    this.$moment.locale(this.options.locale)
    this.renderCalendar(this.$moment(this.startDay))
    window.addEventListener('resize', this.computeDaySize)
    this.computeDaySize()
  },
  methods: {
    renderCalendar: function (start) {
      this.days = this.computeDayRange(start)
      this.months = this.computeMonthObjects(start)
    },
    computeDayRange: function (start) {
      let rangeStartDay = this.$moment(start).startOf('week')
      let rangeEndDay = this.$moment(start).add(this.monthsNumber - 1, 'months').endOf('month').endOf('week')

      if (this.selectedDays.length > 0) {
        rangeStartDay = (rangeStartDay > this.selectedDays[0]) ? this.selectedDays[0] : rangeStartDay
        rangeEndDay = (rangeEndDay < this.selectedDays[-1]) ? this.selectedDays[-1] : rangeEndDay
      }

      const range = this.$moment.range(rangeStartDay.subtract(2, 'days'), rangeEndDay.add(7, 'days'))
      return Array.from(range.by('days')).map((day) => {
        return {
          moment: day,
          typesApplied: this.computeDayTypes(day),
          label: this.fetchDayLabel(day)
        }
      })
    },
    fetchDayLabel: function (day) {
      const matchingDayLabel = this.dayLabels.find((dayLabel) => {
        return dayLabel.date === day.format('YYYY-MM-DD')
      })
      return matchingDayLabel ? matchingDayLabel.text : null
    },
    computeDayTypes: function (day) {
      let typesApplied = {}
      const dayAsString = day.format('YYYY-MM-DD')

      Object.entries(this.types).forEach(([type, typeContent]) => {
        const periodsContainingDay = typeContent.periods.filter((period) => ( period.includes(dayAsString)))

        let typeApplied = {
          morning: false,
          night: false,
          color: typeContent.color
        }

        if (periodsContainingDay.length) {
          if (this.options.mode === 'half-day') {

            if (periodsContainingDay.length === 2) {
              typeApplied.night = true
              typeApplied.morning = true
              typeApplied.separation = true
            } else {
              const indexOfDayInPeriod = periodsContainingDay[0].indexOf(dayAsString)
              if (indexOfDayInPeriod === 0) {
                typeApplied.night = true
                typeApplied.morning = false
                typeApplied.separation = false
              } else if (indexOfDayInPeriod === periodsContainingDay[0].length - 1) {
                typeApplied.morning = true
                typeApplied.night = false
                typeApplied.separation = false
              } else {
                typeApplied.morning = true
                typeApplied.night = true
                typeApplied.separation = false
              }
            }
          } else if (this.options.mode === 'full-day') {
            typeApplied.night = true
            typeApplied.morning = true
            typeApplied.separation = false
          } else {
            console.log('options.mode not recognized')
          }
        }

        typesApplied[type] = typeApplied
      })

      return typesApplied
    },
    computeMonthObjects: function (start) {
      let months = []
      for (let i = 0; i < this.monthsNumber; i++) {
        let monthStart = this.$moment(start).add(i, 'months')
        months.push({
          id: i,
          start: monthStart,
          days: this.filterDatesInMonth(this.days, monthStart),
        })
      }
      return months
    },
    filterDatesInMonth: function (datesArray, startOfMonth) {
      return datesArray ?
        datesArray
          .filter((day) => {
            return day.moment.isBetween(
              this.$moment(startOfMonth).startOf('month').startOf('week').subtract(3, 'days'),
              this.$moment(startOfMonth).endOf('month').endOf('week').add(7, 'days')
            )
          })
        : []
    },
    isSelectionValid: function () {
      return this.isSelectionValidFunction(this.selectedDays, this.days)
    },
    computeDaySize: function () {
      let windowWidth = window.innerWidth || document.documentElement.clientWidth
      this.daySize = (windowWidth > 700) ?
        this.$refs.calendarContainer.offsetWidth / 25 :
        this.$refs.calendarContainer.offsetWidth / 9
    },

    slideMonths: function (direction) {
      if (direction === 'next') {
        this.renderCalendar(this.months[0].start.add(this.monthsNumber, 'months').startOf('month'))
      } else if (direction === 'previous') {
        this.renderCalendar(this.months[0].start.subtract(this.monthsNumber, 'months').startOf('month'))
      }
      this.$emit('slide', direction)
    },
    daySelected: function(dateSelected) {
      if (!this.isSelecting) {
        this.startSelectionDate = dateSelected
        this.endSelectionDate = dateSelected
        this.isSelecting = true
        this.selectedDays = Array.from(this.$moment.range(this.startSelectionDate, this.endSelectionDate).by('days'))
      } else {
        this.isSelecting = false
        if (!this.isInvalid && (this.startSelectionDate < this.endSelectionDate)) {
          this.$emit('selected-range', {
            start: this.startSelectionDate.format('YYYY-MM-DD'),
            end: this.endSelectionDate.format('YYYY-MM-DD'),
          })
        } else {
          this.clearSelection()
        }
      }
    },
    dayHovered: function(dateHovered) {
      if (this.isSelecting) {
        this.endSelectionDate = dateHovered
        if (this.startSelectionDate > this.endSelectionDate) {
          this.clearSelection()
        } else {
          this.selectedDays = Array.from(this.$moment.range(this.startSelectionDate, this.endSelectionDate).by('days'))
          this.isInvalid = !this.isSelectionValid()
        }
      }
    },
    clearSelection: function () {
      this.selectedDays = []
    }
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.computeDaySize)
  },
  components: { CalendarMonth, CalendarMonthSlider }
}
</script>

<style scoped>
  .calendar-container {
    width: 100%;
    display: table;
    background-color: white;
    padding-top: 10px;
    padding-bottom: 10px;
    position: relative;

    font-family: 'Arial';
  }

  .calendar-month-container {
    margin-top: 10px;
    display: table-cell;
  }

  @media screen and (max-width: 700px) {
    .calendar-month-container {
      display: block;
    }
  }
</style>
