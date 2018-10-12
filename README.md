# vue-range-calendar

## Another Calendar for VueJS !

Displays many months. Display range dates with different colors. Enables date range selection. Two modes (half-day or full-day)

### Demo

![Demo Half-day mode](https://raw.githubusercontent.com/LuckeyHomes/vue-range-calendar/master/docs/demo-calendar.png)

### Compatibility

Tested on Chrome 68+, IE11/Edge, Safari 5

## Installation

### Get Package

```
yarn add moment moment-range vue-moment vue-range-calendar
// or npm install moment moment-range vue-moment vue-range-calendar
```

### Vue Setup:
```
import Vue from 'vue'

const Moment = require('moment')
const MomentRange = require('moment-range')
const MomentExtended = MomentRange.extendMoment(Moment)

import VueMoment from 'vue-moment'
import 'moment/locale/fr.js'

import Calendar from 'vue-range-calendar'

Vue.use(VueMoment, { moment: MomentExtended })

new Vue({
  render: h => h(Calendar)
}).$mount('#calendar-container')

```

### Vue Setup using browser scripts:
```
<script src="vue.min.js"></script>
<script src="moment"></script>
<script src="moment-range"></script>
<script src="vue-moment.min.js"></script>
<script src="vue-range-calendar.min.js"></script>

<script type="text/javascript">
    Vue.use(vueMoment, { moment: window['moment-range'].extendMoment(moment) })
    new Vue({
        data() {
            return {
                ...
            }
        },
        methods:
            ...
        },
    }).$mount('#calendar-container')
</script>

```

## Usage

In your vue template:
```
<calendar
  start-day="2018-09-01"
  :months-number="3"
  :types="types"
  :options="options"
  :day-labels="[]"
  :is-selection-valid-function="isSelectionValid"
  :is-day-selectable-function="isDaySelectable"
  @selected-range="selectedRange($event)"
/>
```

In your vue script:
```
<script>
  export default {
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
              ['2018-09-06', '2018-09-07', '2018-09-08', '2018-09-09'],
            ],
            color: '#2ceeda'
          },
          blocked: {
            periods: [
              ['2018-09-05', '2018-09-06'],
              ['2018-09-09', '2018-09-10', '2018-09-11', '2018-09-12'],
            ],
            color: '#e6e6e6'
          }
        }
      }
    },
    methods: {
      isDaySelectable: function (day) {
        // Implement me
        return true
      },
      isSelectionValid: function (selectedDays, days) {
        // Implement me
        return true
      },
      selectedRange: function(range) {
        // Implement me
        alert('Range selected: from ' + range.start + ' to ' + range.end)
      }
    }
  }
</script>
```

## Project setup (in case you want to edit it)
```
git clone && cd
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```
