<template>
  <td class="calendar-day"
    :class="{
      'hidden-day': isHidden,

      'selectable': isDaySelectable,

      'first-selected': selection.isFirstSelected,
      'last-selected': selection.isLastSelected,
      'selected': selection.isSelected,
      'invalid': selection.isInvalid,
      'selecting': selection.isSelecting
    }"
    :style="dayBackground"
    :id="dayId"
    @click="clicked"
    @mouseover="mouseOver"
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave"
  >
    <div class="calendar-day-wrapper" :style="dayWidthStyle">
      <div class="calendar-day-date-content calendar-day-content">
        <div>{{ date | moment('DD') }}</div>
        <div v-if="label && label.crossed"
          :class="{
            'cross-out': true,
            'morning': label.morning,
            'full': label.full,
            'night': label.night,
            'separation': label.separation
          }"
        ></div>
      </div>
      <div class="calendar-day-label-content calendar-day-content">
        <div v-if="label">{{ label.text }}</div>
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
    label: Object,
    size: Number,

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
    dayId: function () {
      return this.isHidden ? null : this.date.format('YYYY-MM-DD')
    },
    isDaySelectable: function() {
      return this.isDaySelectableFunction(this) && !this.isHidden
    },
    dayWidthStyle: function () {
      return {
        height: this.size + 'px',
        width: this.size + 'px'
      }
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
          background: `linear-gradient(to right bottom, ${morningColor} 0, ${morningColor} calc(50% - 1px),` + `
          #fff calc(50% - 1px), #fff calc(50% + 1px),` + `
          ${nightColor} calc(50% + 1px), ${nightColor})`
        }
      }
    },
  },
  methods: {
    clicked: function() {
      this.$emit('clicked', this.date)
    },
    mouseOver: function() {
      this.$emit('hovered', this.date)
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
  .cross-out {
    width: 100%;
    height: 10px;
  }
  .cross-out.full {
    background: darkblue;
  }
  .cross-out.night {
    background: linear-gradient(135deg, transparent 50%, darkblue 50%);
  }
  .cross-out.morning {
    background: linear-gradient(135deg, darkblue 51%, transparent 51%);
  }
  .cross-out.separation {
    background: linear-gradient(135deg, darkblue 48%, transparent 49% 52%, darkblue 53%);
  }
  .calendar-day {
    width: 30px;
    text-align: center;
    position: relative;
    vertical-align: middle;
    padding: 0;
    z-index: 0;
  }

  .calendar-day.selectable {
    cursor: pointer;
  }

  .hidden-day .calendar-day-wrapper {
    display: none;
  }

  .calendar-day-content {
    position: absolute;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .calendar-day-date-content {
    font-size: 0.85rem;
  }
  .calendar-day-label-content {
    margin-top: 10px;
    color: #888;
    font-size: 0.75rem;
  }
</style>
