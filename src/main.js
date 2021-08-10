import Vue from 'vue';
import Fastclick from 'fastclick';

import App from './App.vue';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app');

document.onload = () => Fastclick(document.body);
