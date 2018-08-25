<template>
  <div class="calendar-container">
    <div class="calendar-month" v-for="month in months" :key="month.id">
      {{ month.start | moment('MMM YYYY') }}
    </div>
  </div>
</template>

<script>

import 'moment/locale/en-gb'
import 'moment/locale/fr'

export default {
  name: 'Calendar',
  props: {
    locale: String,
    monthsDisplayed: Number,
    startMonth: String
  },
  data() {
    return {
      months: []
    }
  },
  mounted() {
    this.$moment.locale(this.locale)
    let startMonthMoment = this.$moment(this.startMonth, 'YYYY-MM')

    for (let i = 0; i < this.monthsDisplayed; i++) {
      let monthMoment = this.$moment(startMonthMoment).add(i, 'months')
      this.months.push({
        id: i,
        start: monthMoment,
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .calendar-container {
    width: 100%;
    display: table;
  }

  .calendar-month {
    display: table-cell;
    height: 200px;
  }

  @media screen and (max-width: 700px) {
    .calendar-month {
      display: block;
    }
  }
</style>
