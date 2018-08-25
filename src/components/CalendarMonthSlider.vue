<template>
  <div class="month-slider" :class="{ previous: direction === 'previous', next: direction === 'next' }">
    <svg v-if="direction === 'previous'" viewBox="0 0 1000 1000" >
      <path d="M336.2 274.5l-210.1 210h805.4c13 0 23 10 23 23s-10 23-23 23H126.1l210.1 210.1c11 11 11 21 0 32-5 5-10 7-16 7s-11-2-16-7l-249.1-249c-11-11-11-21 0-32l249.1-249.1c21-21.1 53 10.9 32 32z"></path>
    </svg>
    <svg v-if="direction === 'next'" viewBox="0 0 1000 1000" class="next">
      <path d="M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z"></path>
    </svg>
  </div>
</template>

<script>

export default {
  name: 'CalendarMonthSlider',
  props: {
    direction: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .month-slider {
    cursor: pointer;
    height: 23px;
    width: 23px;
    fill: #444;
    padding: 6px 10px;
    border-radius: 1px;
    top: 10px;
    z-index: 2;
    position: absolute;
  }

  .month-slider.next {
    right: 1rem;
  }

  .month-slider.previous {
    left: 1rem;
  }
</style>
