<template>
  <div class="calendar-container">
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
      />
    </div>
  </div>
</template>

<script>

import 'moment/locale/en-gb'
import 'moment/locale/fr'

import CalendarMonth from './CalendarMonth.vue'
import CalendarMonthSlider from './CalendarMonthSlider.vue'

export default {
  name: 'Calendar',
  props: {
    locale: String,
    monthsNumber: Number,
    startMonth: String,
    bookedDays: Array,
    blockedDays: Array,
  },
  data() {
    return {
      months: [],
      selectedDays: [],
      days: [],

      isSelecting: false,
      isInvalid: false,
      startSelectionDate: null,
      endSelectionDate: null,
    }
  },
  mounted() {
    this.$moment.locale(this.locale)
    this.renderCalendar(this.$moment(this.startMonth))
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

      const range = this.$moment.range(rangeStartDay.subtract(2, 'days'), rangeEndDay.add(2, 'days'))
      return Array.from(range.by('days')).map((day) => {
        return {
          moment: day,
          isBooked: (this.bookedDays.length > 0 ? this.bookedDays.includes(day.format('YYYY-MM-DD')) : false),
          isBlocked: (this.blockedDays.length > 0 ? this.blockedDays.includes(day.format('YYYY-MM-DD')) : false),
        }
      })
    },
    computeMonthObjects: function (start) {
      let months = []
      for (let i = 0; i < this.monthsNumber; i++) {
        let monthStart = this.$moment(start).add(i, 'months')
        months.push({
          id: i,
          start: monthStart,
          days: this.filterDatesInMonth(this.days, monthStart)
        })
      }
      return months;
    },
    filterDatesInMonth: function (datesArray, startOfMonth) {
      return datesArray ?
        datesArray
          .filter((day) => {
            return day.moment.isBetween(
              this.$moment(startOfMonth).startOf('month').startOf('week').subtract(3, 'days'),
              this.$moment(startOfMonth).endOf('month').endOf('week').add(3, 'days')
            )
          })
        : []
    },
    isSelectionValid: function () {
      if (this.selectedDays.length > 0 && this.selectedDays[0] < this.$moment()) {
        return false
      }

      let firstInvalidDay = null
      this.selectedDays.every((selectedDay, index) => {
        const indexOfSelectedDay =
          this.days
            .map(function (day) { return day.moment.format('YYYY-MM-DD') })
            .indexOf(selectedDay.format('YYYY-MM-DD'))

        if (this.days[indexOfSelectedDay].isBooked) {
          if (index === 0 && !this.days[indexOfSelectedDay + 1].isBooked) {
            return true
          }

          if (index === (this.selectedDays.length - 1) && !this.days[indexOfSelectedDay - 1].isBooked) {
            return true
          }

          if (this.days[indexOfSelectedDay].isBlocked && (!this.days[indexOfSelectedDay + 1].isBlocked || !this.days[indexOfSelectedDay -1].isBlocked)) {
            return true
          }

          firstInvalidDay = selectedDay
          return false
        }

        return true
      })

      return (null === firstInvalidDay)
    },

    slideMonths: function (direction) {
      if (direction === 'next') {
        this.renderCalendar(this.months[0].start.add(this.monthsNumber, 'months').startOf('month'))
      } else if (direction === 'previous') {
        this.renderCalendar(this.months[0].start.subtract(this.monthsNumber, 'months').startOf('month'))
      }
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
        }
      }
    },
    dayHovered: function(dateHovered) {
      if (this.isSelecting) {
        this.endSelectionDate = dateHovered
        if (this.startSelectionDate > this.endSelectionDate) {
          this.selectedDays = []
        } else {
          this.selectedDays = Array.from(this.$moment.range(this.startSelectionDate, this.endSelectionDate).by('days'))
          this.isInvalid = !this.isSelectionValid()
        }
      }
    }
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
