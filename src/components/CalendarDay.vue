<template>
  <td class="calendar-day" :class="{
    'booked': day.isBooked,
    'first-booked': day.isFirstBooked,
    'last-booked': day.isLastBooked,
    'blocked': day.isBlocked,
    'first-blocked': day.isFirstBlocked,
    'last-blocked': day.isLastBlocked,
    'selectable': isSelectable,
    'first-selected': isFirstSelected,
    'last-selected': isLastSelected,
    'invalid': isInvalid,
    'hidden': isHidden,
    'selecting': isSelecting
  }"
      @click="clicked"
      @mouseover="mouseOver"
  >
    <div class="calendar-day-wrapper">
      <div class="calendar-day-content">
        {{ day.moment | moment('DD') }}
      </div>
    </div>
  </td>
</template>

<script>

export default {
  name: 'CalendarDay',
  props: {
    day: Object,

    isSelecting: Boolean,
    isFirstSelected: Boolean,
    isLastSelected: Boolean,
    isInvalid: Boolean,
    isHidden: Boolean,
  },
  computed: {
    isSelectable: function() {
      return (!this.day.isBooked || (this.day.isBooked && this.day.isLastBooked))
    }
  },
  data() {
    return {
      dayLabels: []
    }
  },
  methods: {
    clicked: function() {
      if (!this.isHidden) {
        this.$emit('clicked', this.day.moment)
      }
    },
    mouseOver: function() {
      if (!this.isHidden) {
        this.$emit('hovered', this.day.moment)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .calendar-day {
    width: 30px;
    text-align: center;
    position: relative;
    vertical-align: middle;
    padding: 0;
    cursor: pointer;
    z-index: 0;
  }

  .calendar-day.booked:not(.lastBooked) {
    cursor: auto;
  }

  .calendar-day.hidden {
    cursor: auto;
  }

  .calendar-day-wrapper {
    display: block;
    bottom: 0;
    left: 0;
    right: 0;
    line-height: 0;
    margin-top: 50%;
  }

  .hidden .calendar-day-wrapper {
    display: none;
  }

  .calendar-day-wrapper::after {
    display: block;
    margin-top: 50%;
    content: '';
  }

  .calendar-day-content {
    font-size: 0.85rem;
  }

  /* Default Behavior */
  .calendar-day.booked:not(.first-booked):not(.last-booked) {
    background: #2ceeda;
  }

  .calendar-day.booked.first-booked {
    background: linear-gradient(to right bottom, transparent calc(50% - 1px), #2ceeda calc(50% + 1px));
  }

  .calendar-day.booked.last-booked {
    background: linear-gradient(to right bottom, #2ceeda calc(50% - 1px), transparent calc(50% + 1px));
  }

  .calendar-day.blocked:not(.first-blocked):not(.last-blocked) {
    background: #e6e6e6;
    color: #bfbfbf;
  }

  .calendar-day.blocked.first-blocked {
    background: linear-gradient(to right bottom, transparent calc(50% - 1px), #fff, #e6e6e6 calc(50% + 1px));
  }

  .calendar-day.blocked.last-blocked {
    background: linear-gradient(to right bottom, #e6e6e6 calc(50% - 1px), #fff, transparent calc(50% + 1px));
  }

  .calendar-day.last-booked.first-blocked {
    background: linear-gradient(to right bottom, #2ceeda calc(50% - 1px), #fff, #e6e6e6 calc(50% + 1px));
  }

  .calendar-day.first-booked.last-blocked {
    background: linear-gradient(to right bottom, #e6e6e6 calc(50% - 1px), #fff, #2ceeda calc(50% + 1px));
  }

  .calendar-day::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    background: none;
  }

  /* Hover Behavior + Selected*/
  .calendar-day.selectable:not(.selecting):not([selected]):not(.hidden):hover::after {
    background: linear-gradient(to right bottom, transparent calc(50% - 1px), #fff, #8acdf6 calc(50% + 1px));
  }

  .calendar-day[selected]::after {
    background: linear-gradient(to right bottom, #8acdf6 calc(50%), #8acdf6 calc(50%));
  }

  .calendar-day[selected].first-selected::after {
    background: linear-gradient(to right bottom, transparent calc(50%), #8acdf6 calc(50%));
  }

  .calendar-day[selected].first-selected.last-selected:hover::after {
    background: linear-gradient(to right bottom, transparent calc(50%), #8acdf6 calc(50%));
  }

  .calendar-day[selected].last-selected::after {
    background: linear-gradient(to right bottom, #8acdf6 calc(50%), transparent calc(50%));
  }

  .calendar-day[selected].last-selected:hover::after {
    background: linear-gradient(to right bottom, #8acdf6 calc(50%), transparent calc(50%));
  }


  /* Invalid */
  .calendar-day[selected].invalid::after {
    background: linear-gradient(to right bottom, #999999 calc(50%), #999999 calc(50%));
  }

  .calendar-day[selected].invalid.first-selected::after {
    background: linear-gradient(to right bottom, transparent calc(50%), #999999 calc(50%));
  }

  .calendar-day[selected].invalid.last-selected::after {
    background: linear-gradient(to right bottom, #999999 calc(50%), transparent calc(50%));
  }

  .calendar-day[selected].invalid.last-selected:hover::after {
    background: linear-gradient(to right bottom, #999999 calc(50%), transparent calc(50%));
  }

</style>
