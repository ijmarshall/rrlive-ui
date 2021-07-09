<template>
  

    <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand href="#">RobotReviewer LIVE</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <!-- <b-navbar-nav> -->
        <!-- <b-nav-item href="#">Link</b-nav-item> -->
        <!-- <b-nav-item href="#" disabled>Disabled</b-nav-item> -->
      <!-- </b-navbar-nav> -->

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">

        <b-button href="#" v-if="!signedInStatus" variant="light" v-on:click="signIn()">Sign in! (Github)</b-button>

        <!-- <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-nav-form> -->

<!--         <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item href="#">EN</b-dropdown-item>
          <b-dropdown-item href="#">ES</b-dropdown-item>
          <b-dropdown-item href="#">RU</b-dropdown-item>
          <b-dropdown-item href="#">FA</b-dropdown-item>
        </b-nav-item-dropdown> -->

        <b-nav-item-dropdown v-if="signedInStatus" right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <em>Select review</em>
          </template>
          <b-dropdown-item href="#" v-for="review in this.$store.getters.getReviewMeta" :key="review.revid" v-on:click="updateActiveReview(review)">{{ review.title }}</b-dropdown-item>
          
        </b-nav-item-dropdown>

<b-nav-item-dropdown v-if="signedInStatus" right>

          <template #button-content>
            <em>{{ activeUser.name }} logged in</em>
          </template>
          <!-- <b-dropdown-item href="#">Profile</b-dropdown-item> -->
          
          <b-dropdown-item href="#" v-on:click="signOut()">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  
</template>

<script>
import axios from 'axios';
import settings from '../settings.js';

export default {
  name: 'Nav',
  data() {
    return {
      review_meta: [],
      session_data: [],
    }
    
  },
  computed: {
    signedInStatus() {
      return this.$store.getters.getSignedInStatus;
    },
    reviewMeta() {
      return this.$store.getters.getReviewMeta;
    },
    activeUser() {
      return this.$store.getters.getActiveUser;
    },
    activeReview() {
      return this.$store.getters.getActiveReview;
    },
    token() {
      return this.$store.getters.getToken;
    }

  },
  methods: {
    signIn() {
        // do stage one of the oauth, and move to the github signin page
        axios.get(settings.url + '/api/login')
          .then(function (response) {
            console.log(response)
            location.href=response.data.url;
        });        
    },
    signOut(){
      this.$store.dispatch('signOut');
    },
    updateActiveReview(review) {

      this.$store.dispatch("updateActiveReview", review)
    },

  //   getSession() {
  //     console.log(this.token);
      
  //     const headers = { Authorization: `Bearer ${this.token}` };
  //     axios
  //       .get("http://127.0.0.1:8000/auth/get_session", { headers: headers })
  //       .then(response => {

  //         this.$store.commit("setActiveUser", {id: response.data.login,
  //                                              name: response.data.name});  
  //         this.$store.commit("setSignedInStatus", true);


  //       }).catch(error => {
  //           console.log(error); // error
  //           this.$store.commit("setSignedInStatus", false);
  //       });
  //   },
  //   signOut() {
  //           this.$store.commit("setActiveUser", {id: null,
  //                                              name: null});          
  //           this.$store.commit("setSignedInStatus", false);  
  //           this.$store.commit("setToken", null);                      
  //   }
  // },

  mounted() {      
      this.getSession();    
      this.updateReviewMeta();
      
    }
}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
