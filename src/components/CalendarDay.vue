<template>
  <td class="calendar-day"
    :class="{
      'hidden': isHidden,

      'morning-booked': typesApplied.booked.morning,
      'night-booked': typesApplied.booked.night,
      'morning-blocked': typesApplied.blocked.morning,
      'night-blocked': typesApplied.blocked.night,

      'selectable': isDaySelectable && !isHidden,

      'first-selected': selection.isFirstSelected,
      'last-selected': selection.isLastSelected,
      'selected': selection.isSelected,
      'invalid': selection.isInvalid,
      'selecting': selection.isSelecting
    }"
    :style="dayBackground"
    @click="clicked"
    @mouseover="mouseOver"
  >
    <div class="calendar-day-wrapper">
      <div class="calendar-day-content">
        {{ date | moment('DD') }}
      </div>
    </div>
  </td>
</template>

<script>

export default {
  name: 'CalendarDay',
  props: {
    date: Object,
    isHidden: Boolean,

    typesApplied: Object,
    selection: Object,

    isDaySelectableFunction: Function
  },
  data() {
    return {
      dayLabels: []
    }
  },
  computed: {
    isDaySelectable: function() {
      return this.isDaySelectableFunction(this)
    },
    dayBackground: function() {
      const morningTypeApplied = Object.keys(this.typesApplied).find((type) => (this.typesApplied[type].morning === true))
      const nightTypeApplied = Object.keys(this.typesApplied).find((type) => (this.typesApplied[type].night === true))

      const morningColor = morningTypeApplied ? this.typesApplied[morningTypeApplied].color : 'transparent';
      const nightColor = nightTypeApplied ? this.typesApplied[nightTypeApplied].color : 'transparent';

      if (morningColor === nightColor) {
        return {
          background: morningColor
        }
      } else {
        return {
          background: `linear-gradient(to right bottom, ${morningColor} 0, ${morningColor} calc(50% - 2px), #fff 50%,` + `
          ${nightColor} calc(50% + 2px), ${nightColor})`
        }
      }
    }
  },
  methods: {
    clicked: function() {
      if (!this.isHidden) {
        this.$emit('clicked', this.date)
      }
    },
    mouseOver: function() {
      if (!this.isHidden) {
        this.$emit('hovered', this.date)
      }
    }
  }
}
</script>

<style scoped>
  .calendar-day {
    width: 30px;
    text-align: center;
    position: relative;
    vertical-align: middle;
    padding: 0;
    z-index: 0;
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

  .calendar-day-wrapper {
    display: block;
    bottom: 0;
    left: 0;
    right: 0;
    line-height: 0;
    margin-top: 50%;
  }

  .calendar-day-wrapper::after {
    display: block;
    margin-top: 50%;
    content: '';
  }

  .calendar-day-content {
    font-size: 0.85rem;
  }

  .hidden .calendar-day-wrapper {
    display: none;
  }

  /* Hover Behavior + Selected */
  .calendar-day.selectable:not(.selecting):not(.selected):not(.hidden):hover::after {
    background: linear-gradient(to right bottom, transparent 0, transparent calc(50% - 2px), #fff 50%, #8acdf6 calc(50% + 2px), #8acdf6);
  }

  .calendar-day.selectable {
    cursor: pointer;
  }

  .calendar-day.selected::after {
    background: linear-gradient(to right bottom, #8acdf6 0, #8acdf6 calc(50% - 2px), #fff 50%, #8acdf6 calc(50% + 2px), #8acdf6);
  }

  .calendar-day.selected.first-selected::after {
    background: linear-gradient(to right bottom, transparent 0, transparent calc(50% - 2px), #fff 50%, #8acdf6 calc(50% + 2px), #8acdf6);
  }

  .calendar-day.selected.last-selected::after {
    background: linear-gradient(to right bottom, #8acdf6 0, #8acdf6 calc(50% - 2px), #fff 50%, transparent calc(50% + 2px), transparent);
  }

  .calendar-day.selected.last-selected:hover::after {
    background: linear-gradient(to right bottom, #8acdf6 0, #8acdf6 calc(50% - 2px), #fff 50%, transparent calc(50% + 2px), transparent);
  }

  .calendar-day.selected.first-selected.last-selected:hover::after {
    background: linear-gradient(to right bottom, transparent 0, transparent calc(50% - 2px), #fff 50%, #8acdf6 calc(50% + 2px), #8acdf6);
  }


  /* Invalid */
  .calendar-day.selected.invalid::after {
    background: linear-gradient(to right bottom, #999999 0, #999999 calc(50% - 2px), #fff 50%, #999999 calc(50% + 2px), #999999);
  }

  .calendar-day.selected.invalid.first-selected::after {
    background: linear-gradient(to right bottom, transparent 0, transparent calc(50% - 2px), #fff 50%, #999999 calc(50% + 2px), #999999);
  }

  .calendar-day.selected.invalid.last-selected::after {
    background: linear-gradient(to right bottom, #999999 0, #999999 calc(50% - 2px), #fff 50%, transparent calc(50% + 2px), transparent);
  }

  .calendar-day.selected.invalid.last-selected:hover::after {
    background: linear-gradient(to right bottom, #999999 0, #999999 calc(50% - 2px), #fff 50%, transparent calc(50% + 2px), transparent);
  }

  .calendar-day.selected.invalid.first-selected.last-selected:hover::after {
    background: linear-gradient(to right bottom, transparent 0, transparent calc(50% - 2px), #fff 50%, #999999 calc(50% + 2px), #999999);
  }
</style>
