import Vue from 'vue';
import './plugins/vuetify';
import Vuetify from 'vuetify';
import App from './App.vue';
import router from './router';
import { store } from './store/store';
import i18n from './assets/i18n/i18n';
import Vuelidate from 'vuelidate';
import ECharts from 'vue-echarts';
import 'font-awesome/css/font-awesome.css';
import './theme/default.styl';
import Snotify from 'vue-snotify';
// You also need to import the styles. If you're using webpack's css-loader, you can do so here:
import 'vue-snotify/styles/material.css'; // or dark.css or simple.css
import filters from './utils/Filters.js';
import utils from './utils/Utils.js';

import NavigationDrawer from '@/components/navigation/NavigationDrawer.vue';
import TopToolbar from '@/components/navigation/TopToolbar.vue';

const fb = require('./firebaseConfig.js');

Vue.use(Vuetify, {
  theme: {
    primary: '#5071b6',
    secondary: '#00ACC1',
    accent: '#0097A7'
  }
});
Vue.use(Snotify);

Vue.use(Vuelidate);

Vue.component('NavigationDrawer', NavigationDrawer);
Vue.component('TopToolbar', TopToolbar);
Vue.component('v-chart', ECharts);

Vue.config.productionTip = false;

let app;
fb.auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      i18n,
      filters,
      utils,
      render: h => h(App)
    });
  }
});
