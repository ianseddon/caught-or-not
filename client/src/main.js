import Vue from 'vue'
import App from './App.vue'
import { createProvider } from './vue-apollo'

Vue.config.productionTip = false

const apolloProvider = createProvider();

new Vue({
  apolloProvider,
  render: h => h(App)
}).$mount('#app');

apolloProvider.defaultClient.cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem('apollo-token'),
  },
});