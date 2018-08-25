<template>
  <div id="app">
    <calendar
      :monthsDisplayed="3"
      locale="fr"
      startMonth="2018-9"
    />
  </div>
</template>

<script>
  export default {
    name: 'app',
  }
</script>
