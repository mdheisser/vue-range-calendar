<template>
  <div id="app">
    <calendar
      locale="fr"
      start-month="2018-09-01"
      :months-number="3"
      :bookedDays="bookedDays"
      :blockedDays="blockedDays"
      @selected-range="selectedRange($event)"
    />
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        bookedDays: ['2018-09-03', '2018-09-04', '2018-09-05', '2018-09-06', '2018-09-07', '2018-09-08', '2018-09-09', '2018-10-10', '2018-10-11', '2018-09-12', '2018-09-13'],
        blockedDays: ['2018-09-05', '2018-09-06', '2018-09-09', '2018-09-10', '2018-09-11', '2018-09-12', '2018-10-20', '2018-10-21', '2018-09-13', '2018-09-14', '2018-09-15']
      }
    },
    methods: {
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
