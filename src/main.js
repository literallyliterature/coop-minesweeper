import Vue from 'vue';
import Fastclick from 'fastclick';
import { longClickDirective } from 'vue-long-click';

import App from './App.vue';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app');

document.onload = () => Fastclick(document.body);

const longClickInstance = longClickDirective({ delay: 300, interval: 150000 });
Vue.directive('long-click', longClickInstance);
