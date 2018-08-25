import Vue from 'vue'

const Moment = require('moment')
const MomentRange = require('moment-range')
const MomentExtended = MomentRange.extendMoment(Moment)

import VueMoment from 'vue-moment'
import 'moment/locale/fr.js'

import App from './App.vue'
import Calendar from './components/Calendar.vue'

Vue.use(VueMoment, { moment: MomentExtended })
Vue.component('calendar', Calendar)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
