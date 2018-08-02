import Vue from 'vue'
import App from './App'
import Vuikit from 'vuikit'
import VuikitIcons from '@vuikit/icons'
import Vuikittheme from '@vuikit/theme'
import VueClipboard from 'vue-clipboard2'

Vue.config.productionTip = false
Vue.use(Vuikit)
Vue.use(Vuikittheme)
Vue.use(VuikitIcons)
Vue.use(VueClipboard)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
