import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'

import VueRouter from 'vue-router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(Vuex)
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

const store = new Vuex.Store({
  state: {
    signedIn: false,
    activeUserName: null,
    activeUserId: null,
    activeReviewId: null,
    activeReviewTitle: null,    
  },
  mutations: {
    setSignedInStatus (state, status) {
      state.signedIn = status;
    },
    setActiveUser (state, user) {
      state.activeUserName = user.name;
      state.activeUserId = user.id;
    },
    setReview (state, review) {
      state.activeReviewId = review.uuid;
      state.activeReviewTitle = review.title;      
    },
  },
  getters: {
    getSignedInStatus(state) {
      return state.signedIn;
    },
    getActiveUser(state) {
      return {id: state.activeUserId,
              name: state.activeUserName};
    },
    getActiveReview(state) {
      return {uuid: state.activeReviewId,
              title: state.activeReviewTitle}
    },
  },
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')


