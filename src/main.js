import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'

import VueRouter from 'vue-router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'

import VueFormulate from '@braid/vue-formulate'
import SearchBox from './components/SearchBox.vue'

// register your component with Vue
Vue.component('Searchbox', SearchBox)

Vue.use(Vuex)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueRouter)
Vue.config.productionTip = false
Vue.use(VueFormulate, {
    library: {
        searchbox: {
            classification: 'select',
            component: 'Searchbox',
        },
    }
})

import Landing from "./pages/Landing.vue";
import About from "./pages/About.vue";
import ScreenAbstracts from "./pages/ScreenAbstracts.vue";
import GithubCallback from "./pages/GithubCallback.vue";
import Summary from "./pages/Summary.vue";
import CreateSummary from "./pages/CreateSummary.vue";


import axios from 'axios';

import settings from './settings.js'

const routes = [
    { path: '/', component: Landing, name: 'landing' },
    { path: '/about', component: About, name: 'about' },
    { path: '/screenabstracts', component: ScreenAbstracts, name: 'screenabstracts' },
    { path: "/auth/github", name: "GithubCallback", component: GithubCallback },
    { path: "/summary/:revid", component: Summary, name: "summary" },
    { path: "/createsummary", component: CreateSummary, name: "createsummary" }
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
        summary: null,
        token: null,
        categoryTags: [],
        isLoading: false,
    },
    mutations: {
        setSignedInStatus(state, status) {
            state.signedIn = status;
        },
        setActiveUser(state, user) {
            state.activeUserName = user.name;
            state.activeUserId = user.id;
        },
        setToken(state, token) {
            state.token = token;
        },
        setReviewMeta(state, reviewMeta) {
            state.reviewMeta = reviewMeta;
        },
        setActiveReview(state, review) {
            console.log(review)
            state.activeReviewId = review.revid;
            state.activeReviewTitle = review.title;
        },
        setAbstracts(state, abstractList) {
            state.abstractsToScreen = abstractList;

        },
        setAbstractStatus(state, { pmid, new_status }) {

            const matchesPmid = (element) => element.pmid == pmid;
            let array_idx = state.abstractsToScreen.findIndex(matchesPmid);
            console.log(pmid)
            console.log(state.abstractsToScreen)
            console.log(array_idx)
            state.abstractsToScreen[array_idx].included = new_status;
        },
        setCategoryTags(state, tags) {
            state.categoryTags = tags;
        },
        setIsLoading(state, isLoading) {
            state.isLoading = isLoading;
        }
    },
    getters: {
        getSignedInStatus(state) {
            return state.signedIn;
        },
        getActiveUser(state) {
            return {
                id: state.activeUserId,
                name: state.activeUserName
            };
        },
        getToken(state) {
            return state.token;
        },
        getReviewMeta(state) {
            return state.reviewMeta;
        },
        getActiveReview(state) {
            return {
                revid: state.activeReviewId,
                title: state.activeReviewTitle
            }
        },
        getAbstracts(state) {
            return state.abstractsToScreen;
        },
        getCategoryTags(state) {
            return state.categoryTags;
        },
        getIsLoading(state) {
            return state.isLoading;
        }
    },
    actions: {
        signOut({ commit }) {
            commit("setActiveUser", {
                id: null,
                name: null
            });
            commit("setSignedInStatus", false);
            commit("setToken", null);
        },
        signIn({ state, commit, dispatch }, ) {
            const headers = { Authorization: `Bearer ${state.token}` };
            axios
                .get(`${settings.url}/api/get_session`, { headers: headers })
                .then(response => {

                    commit("setActiveUser", {
                        id: response.data.login,
                        name: response.data.name
                    });
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
            commit('setIsLoading', true);
            const headers = { Authorization: `Bearer ${state.token}` };
            axios
                .get(`${settings.url}/api/get_reviewlist`, { headers: headers })
                .then(response => {
                    commit('setReviewMeta', response.data.reviews);
                }).catch(error => {
                    console.log(error); // error
                }).then(() => {
                    commit('setIsLoading', false);
                });


        },
        updateActiveReview({ state, commit }, review) {

            commit("setActiveReview", review);
            commit('setIsLoading', true);

            if (review.revid == null) {
                commit("setAbstracts", []);
            } else {

                const headers = { Authorization: `Bearer ${state.token}` };
                axios
                    .get(`${settings.url}/api/get_screenlist/${review.revid}`, { headers: headers })
                    .then(response => {
                        commit('setAbstracts', response.data.articles);
                    }).catch(error => {
                        console.log(error); // error
                    }).then(() => {
                        commit('setIsLoading', false);
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
        updateCategoryTags({ commit }, tags) {
            console.log('updating category tags');
            commit('setCategoryTags', tags);
        },
        // updateSummary({ commit }, review) {

        //   // commit("setReviewSummary", review);

        //   //if (review.revid==null) {
        //   //  commit("setAbstracts", []);
        //   //} else {







        // },
        changeAbstractStatus({ commit, state }, { pmid, decision }) {

            commit('setAbstractStatus', { pmid, decision })

            const headers = { Authorization: `Bearer ${state.token}` };
            axios
                .post(`${settings.url}/api/update_abstract/`, {
                    revid: state.activeReviewId,
                    pmid: pmid,
                    decision: decision
                }, { headers: headers })
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