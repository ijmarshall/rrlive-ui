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
import GithubCallback from "./pages/GithubCallback.vue";


import axios from 'axios';



const routes = [
  { path: '/about', component: About, name: 'about' },
  { path: '/', component: ScreenAbstracts, name: 'screenabstracts'},
  { path: "/auth/github", name: "GithubCallback", component: GithubCallback}
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
    reviewMeta: null,
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
    setToken (state, token) {
      state.token = token;
    },
    setReviewMeta (state, reviewMeta) {
      state.reviewMeta = reviewMeta;
    },
    setActiveReview (state, review) {
      console.log(review)
      state.activeReviewId = review.revid;
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
    getToken(state) {
      return state.token;
    },
    getReviewMeta(state) {
      return state.reviewMeta;
    },    
    getActiveReview(state) {
      return {revid: state.activeReviewId,
              title: state.activeReviewTitle}
    },
    getAbstracts(state) {
      return state.abstractsToScreen;
    }
  },
  actions: {
    signOut({ commit }) {
        commit("setActiveUser", {id: null,
                                               name: null});          
        commit("setSignedInStatus", false);  
        commit("setToken", null);                      
    },
    signIn({state, commit, dispatch}, ) {

      
      const headers = { Authorization: `Bearer ${state.token}` };
      axios
        .get("http://127.0.0.1:8000/auth/get_session", { headers: headers })
        .then(response => {

          commit("setActiveUser", {id: response.data.login,
                                               name: response.data.name});  
          commit("setSignedInStatus", true);


        }).catch(error => {
            console.log(error); // error
            commit("setSignedInStatus", false);
        });
      console.log('signed in, now updating review')
      dispatch('updateReviewMeta')
    },

    updateReviewMeta({ commit, state }) {
        
      console.log('updating review list')
      console.log(state.token);

      const headers = { Authorization: `Bearer ${state.token}` };
      axios
        .get("http://127.0.0.1:8000/auth/get_reviewlist", { headers: headers })
        .then(response => {
            commit('setReviewMeta', response.data.reviews);
        }).catch(error => {
            console.log(error); // error
          
        });


    },
    updateActiveReview({ state, commit }, review) {

      commit("setActiveReview", review);

      if (review.revid==null) {
        commit("setAbstracts", []);  
      } else {

        const headers = { Authorization: `Bearer ${state.token}` };
        axios
          .get(`http://127.0.0.1:8000/auth/get_screenlist/${review.revid}`, { headers: headers })
          .then(response => {
              commit('setAbstracts', response.data.articles);
          }).catch(error => {
              console.log(error); // error
            
          });


        

        // let filters = [`revid=${review.revid}`]
        // console.log(filters)

        // let promise = appwrite.database.listDocuments('6037fcf21a481', filters);

        // promise.then(function (response) {
        //     console.log(response); // Success
            
        //     commit("setAbstracts", response.documents)
        // }, function (error) {
        //     console.log(error); // Failure
        // });
      }


    },    
    changeAbstractStatus({ commit, state }, {pmid, decision}) {
      
      commit('setAbstractStatus', {pmid, decision})

      const headers = { Authorization: `Bearer ${state.token}` };
      axios
        .post('http://127.0.0.1:8000/auth/update_abstract/',
          {revid: state.activeReviewId,
           pmid: pmid,
           decision: decision},
          {headers: headers})
        .then(response => {
            console.log("did it updated!");
            console.log(response);
        }).catch(error => {
            console.log(error); // error
          
      });





      // const matchesPmid = (element) => element.pmid == pmid;      
      // let array_idx = state.abstractsToScreen.findIndex(matchesPmid);
      // let appwrite_ab_idx = state.abstractsToScreen[array_idx].$id

      // let promise = appwrite.database.updateDocument('6037fcf21a481', appwrite_ab_idx, {included: new_status}, [], []);
      // promise.then(function (response) {
      //       console.log('did it!!')
      //       console.log(response); // Success                  
      //   }, function (error) {
      //       console.log(error); // Failure
      //   });
      



    },


  },
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')


