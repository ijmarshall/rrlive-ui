import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueRouter)
Vue.config.productionTip = false


import About from "./pages/About.vue";
import ScreenAbstracts from "./pages/ScreenAbstracts.vue";


const routes = [
  { path: '/about', component: About, name: 'about' },
  { path: '/screenabstracts/:reviewid', component: ScreenAbstracts, name: 'screenabstracts'}
]

const router = new VueRouter({
  mode: 'history',
  routes 
})


new Vue({
  render: h => h(App),
  router
}).$mount('#app')


