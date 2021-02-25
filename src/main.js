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

import apw from './AppwriteInit.js';
let appwrite = apw.appwrite;

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
    abstractsToScreen: [],
  },
  mutations: {
    setSignedInStatus (state, status) {
      state.signedIn = status;
    },
    setActiveUser (state, user) {
      state.activeUserName = user.name;
      state.activeUserId = user.id;
    },
    setActiveReview (state, review) {
      state.activeReviewId = review.uuid;
      state.activeReviewTitle = review.title;      
    },
    setAbstracts (state, abstractList) {
      state.abstractsToScreen = abstractList;

    },
    setAbstractStatus(state, {pmid, new_status}) {

      const matchesPmid = (element) => element.pmid == pmid;      
      let array_idx = state.abstractsToScreen.findIndex(matchesPmid);
      console.log(pmid)      
      console.log(state.abstractsToScreen)
      console.log(array_idx)
      state.abstractsToScreen[array_idx].included = new_status;
    }
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
    getAbstracts(state) {
      return state.abstractsToScreen;
    }
  },
  actions: {
    updateActiveReview({ commit }, review) {

      commit("setActiveReview", review);

      if (review.uuid==null) {
        commit("setAbstracts", []);  
      } else {

        let filters = [`review_uuid=${review.uuid}`]
        console.log(filters)
        let promise = appwrite.database.listDocuments('6037fcf21a481', filters);

        promise.then(function (response) {
            console.log(response); // Success
            
            commit("setAbstracts", response.documents)
        }, function (error) {
            console.log(error); // Failure
        });
      }


    },
    changeAbstractStatus({ commit, state }, {pmid, new_status}) {
      
      commit('setAbstractStatus', {pmid, new_status}) 
      const matchesPmid = (element) => element.pmid == pmid;      
      let array_idx = state.abstractsToScreen.findIndex(matchesPmid);
      let appwrite_ab_idx = state.abstractsToScreen[array_idx].$id

      let promise = appwrite.database.updateDocument('6037fcf21a481', appwrite_ab_idx, {included: new_status}, [], []);
      promise.then(function (response) {
            console.log('did it!!')
            console.log(response); // Success                  
        }, function (error) {
            console.log(error); // Failure
        });
      



    },


  },
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')


