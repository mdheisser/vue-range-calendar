<template>
  <div id="app">
    <calendar
      start-day="2018-09-01"
      :months-number="3"
      :types="types"
      :options="options"
      :day-labels="dayLabels"
      :is-selection-valid-function="isSelectionValid"
      :is-day-selectable-function="isDaySelectable"
      @selected-range="selectedRange($event)"
    />
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        options: {
          mode: 'half-day', // or 'full-day'
          locale: 'fr',
          colors: {
            invalid: '#999',
            hover: '#8acdf6',
            selected: '#8acdf6'
          }
        },
        types: {
          booked: {
            periods: [
              ['2018-09-03', '2018-09-04', '2018-09-05'],
              ['2018-09-05', '2018-09-06', '2018-09-07'],
              ['2018-09-07', '2018-09-08', '2018-09-09'],
              ['2018-10-10', '2018-10-11'],
              ['2018-09-12', '2018-09-13']
            ],
            color: '#2ceeda'
          },
          blocked: {
            periods: [
              ['2018-09-09', '2018-09-10', '2018-09-11', '2018-09-12'],
              ['2018-09-13', '2018-09-14', '2018-09-15'],
              ['2018-10-20', '2018-10-21']
            ],
            color: '#e6e6e6'
          },
          test: {
            periods: [
              ['2018-10-21', '2018-10-22', '2018-10-23'],
            ],
            color: 'red'
          }
        },
        dayLabels: [
          {
            date: '2018-09-09',
            text: 'test'
          },
          {
            date: '2018-09-10',
            text: 'test'
          },
          {
            date: '2018-09-11',
            text: 'test'
          },
          {
            date: '2018-10-09',
            text: 'test'
          },
        ]


      }
    },
    methods: {
      isDaySelectable: function (day) {
        return !day.typesApplied.booked.night
      },
      isSelectionValid: function (selectedDays, days) {
        if (selectedDays.length > 0 && selectedDays[0] < this.$moment()) {
          return false
        }

        let firstInvalidDay = null
        selectedDays.every((selectedDay, index) => {
          let invalidDays;
          if (index === 0) {
            invalidDays = days.filter((day) => (day.typesApplied.booked.night)).filter((day) => ( day.moment.isSame(selectedDay)))
          } else {
            invalidDays = days.filter((day) => (day.typesApplied.booked.morning)).filter((day) => ( day.moment.isSame(selectedDay)))
          }

          if (invalidDays.length) {
            firstInvalidDay = invalidDays[0]
            return false
          }

          return true
        })

        return (null === firstInvalidDay)
      },
      selectedRange: function(range) {
        alert('Range selected: from ' + range.start + ' to ' + range.end)
      }
    }
  }
</script>

<style>
  html, body {
    background-color: #f4f4f4;
  }
</style>
