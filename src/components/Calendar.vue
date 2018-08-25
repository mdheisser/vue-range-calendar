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
    monthsDisplayed: Number,
    startMonth: String,
    bookedDays: Array,
    blockedDays: Array,
    calendarDays: Array,
  },
  data() {
    return {
      months: [],
      isSelecting: false,
      isInvalid: false,
      startSelectionDate: null,
      endSelectionDate: null,
      selectedDays: [],
    }
  },
  methods: {
    slideMonths: function (direction) {
      if (direction === 'next') {
        this.renderCalendar(this.months[0].start.add(this.monthsDisplayed, 'months').startOf('month').format('YYYY-M'))
      } else if (direction === 'previous') {
        this.renderCalendar(this.months[0].start.subtract(this.monthsDisplayed, 'months').startOf('month').format('YYYY-M'))
      }
    },
    filterDatesInMonth: function (datesArray, startOfMonth) {
      return datesArray ?
        datesArray
          .map((day) => {
            return this.$moment(day, 'YYYY-MM-DD')
          })
          .filter((day) => {
            return day.isBetween(
              this.$moment(startOfMonth).startOf('month').subtract(1, 'days').format('YYYY-M-DD'),
              this.$moment(startOfMonth).endOf('month').add(1, 'days').format('YYYY-M-DD')
            )
          })
        : []
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
            start: this.startSelectionDate.format('YYYY-M-D'),
            end: this.endSelectionDate.format('YYYY-M-D'),
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
    },
    isSelectionValid: function () {
      const invalidDays = this.bookedDays.filter((bookedDay) => {
        return this.selectedDays.map((day) => { return day.format('YYYY-M-D') }).includes(bookedDay)
      })
      return invalidDays.length <= 1
    },
    renderCalendar: function (startMonth) {
      this.months = []
      let startMonthMoment = this.$moment(startMonth, 'YYYY-MM').startOf('month')

      for (let i = 0; i < this.monthsDisplayed; i++) {
        let monthMoment = this.$moment(startMonthMoment).add(i, 'months')
        this.months.push({
          id: i,
          start: monthMoment,
          bookedDays: this.filterDatesInMonth(this.bookedDays, monthMoment),
          blockedDays: this.filterDatesInMonth(this.blockedDays, monthMoment)
        })
      }
    }
  },
  mounted() {
    this.$moment.locale(this.locale)
    this.renderCalendar(this.startMonth)
  },
  components: { CalendarMonth, CalendarMonthSlider }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
