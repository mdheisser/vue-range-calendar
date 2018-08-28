<template>
  <td class="calendar-day"
    :class="{
      'hidden': isHidden,

      'morning-booked': typesApplied.booked.morning,
      'night-booked': typesApplied.booked.night,
      'morning-blocked': typesApplied.blocked.morning,
      'night-blocked': typesApplied.blocked.night,

      'selectable': isDaySelectable,

      'first-selected': selection.isFirstSelected,
      'last-selected': selection.isLastSelected,
      'selected': selection.isSelected,
      'invalid': selection.isInvalid,
      'selecting': selection.isSelecting
    }"
    :style="dayBackground"
    @click="clicked"
    @mouseover="mouseOver"
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave"
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

    isDaySelectableFunction: Function,
    options: Object
  },
  data() {
    return {
      isHovered: false,
    }
  },
  computed: {
    isDaySelectable: function() {
      return this.isDaySelectableFunction(this) && !this.isHidden
    },
    dayBackground: function() {
      if (this.isHidden) {
        return;
      }

      const morningTypeApplied = Object.keys(this.typesApplied).find((type) => (this.typesApplied[type].morning === true))
      const nightTypeApplied = Object.keys(this.typesApplied).find((type) => (this.typesApplied[type].night === true))
      const separationTypeApplied = Object.keys(this.typesApplied).find((type) => (this.typesApplied[type].separation === true))

      let morningColor = morningTypeApplied ? this.typesApplied[morningTypeApplied].color : 'transparent';
      let nightColor = nightTypeApplied ? this.typesApplied[nightTypeApplied].color : 'transparent';

      if (this.selection.isSelected) {
        if (!this.selection.isFirstSelected) {
          morningColor = !this.selection.isInvalid ? this.options.colors.selected : this.options.colors.invalid
          nightColor = this.options.mode === 'full-day' ? morningColor : nightColor
        }

        if (!this.selection.isLastSelected) {
          nightColor = !this.selection.isInvalid ? this.options.colors.selected : this.options.colors.invalid
          morningColor = this.options.mode === 'full-day' ? nightColor : morningColor
        }
      }

      if (this.isHovered) {
        if (this.isDaySelectable) {
          if (!this.selection.isSelected && !this.selection.isSelecting) {
            nightColor = this.options.colors.hover
            morningColor = this.options.mode === 'full-day' ? nightColor : morningColor
          }

          if (this.selection.isSelecting && this.selection.isFirstSelected) {
            nightColor = !this.selection.isInvalid ? this.options.colors.selected : this.options.colors.invalid
            morningColor = this.options.mode === 'full-day' ? nightColor : morningColor
          }

          if (this.selection.isSelecting && this.selection.isLastSelected && !this.selection.isFirstSelected) {
            morningColor = !this.selection.isInvalid ? this.options.colors.selected : this.options.colors.invalid
            nightColor = this.options.mode === 'full-day' ? morningColor : nightColor
          }
        }
      }

      if (morningColor === nightColor && !separationTypeApplied) {
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
    },
    mouseEnter: function() {
      this.isHovered = true
    },
    mouseLeave: function() {
      this.isHovered = false
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
    border-bottom: 2px solid white;
  }

  .calendar-day.selectable {
    cursor: pointer;
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

  .hidden .calendar-day-wrapper {
    display: none;
  }

  .calendar-day-content {
    font-size: 0.85rem;
  }
</style>
