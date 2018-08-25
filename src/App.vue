<template>
  <div id="app">
    <calendar
      :monthsDisplayed="3"
      locale="fr"
      startMonth="2018-9"
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
        bookedDays: ['2018-9-3', '2018-9-4', '2018-9-5', '2018-9-6', '2018-9-7', '2018-9-8', '2018-9-9', '2018-10-10', '2018-10-11', '2018-9-12', '2018-9-13'],
        blockedDays: ['2018-9-5', '2018-9-6', '2018-9-9', '2018-9-10', '2018-9-11', '2018-9-12', '2018-10-20', '2018-10-21', '2018-9-13', '2018-9-14', '2018-9-15']
      }
    },
    methods: {
      selectedRange: function(range) {
        console.log(range)
      }
    }
  }
</script>

<style>
  html, body {
    background-color: #f4f4f4;
  }
</style>
