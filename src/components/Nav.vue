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

        <b-button href="#" v-if="!signedInStatus" variant="light" v-on:click="signIn">Sign in! (Github)</b-button>

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
          <b-dropdown-item href="#" v-for="review in review_meta" :key="review[1].review_uuid" v-on:click="setActiveReview(review[1].review_uuid, review[1].title)">{{ review[1].title }}</b-dropdown-item>
          
        </b-nav-item-dropdown>

<b-nav-item-dropdown v-if="signedInStatus" right>

          <template #button-content>
            <em>{{ activeUser.name }} logged in</em>
          </template>
          <!-- <b-dropdown-item href="#">Profile</b-dropdown-item> -->
          
          <b-dropdown-item href="#" v-on:click="signOut">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  
</template>

<script>
import apw from '../AppwriteInit.js';
let appwrite = apw.appwrite;
let meta = apw.meta;

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
    activeUser() {
      return this.$store.getters.getActiveUser;
    },
    activeReview() {
      return this.$store.getters.getActiveReview;
    },

  },
  methods: {
    signIn() {

        var promise;

        if (meta.autologin) {
          promise = appwrite.account.createSession(meta.email, meta.password);
        } else {
          promise = appwrite.account.createOAuth2Session('github', meta.url, meta.url);
        }

          promise.then(response => {
            console.log(response);          
            this.getSession()
            this.updateReviewMeta();
          }).catch(error => {
            console.log(error)
          });
        
    },
    setActiveReview(uuid, title) {

      this.$store.dispatch("updateActiveReview", {uuid: uuid,
                                             title: title})
    },
    updateReviewMeta() {
      
        appwrite.database.listDocuments('60341a2457ca1').then(response => {
            console.log(response); // Success
            this.review_meta=Object.entries(response.documents);
        }).catch(error => {
            console.log(error); // Success
        });



    },    
    getSession() {

        appwrite.account.get().then(response => {
            console.log(response); // Success
            this.$store.commit("setActiveUser", {id: response.$id,
                                               name: response.name});          
            this.$store.commit("setSignedInStatus", true);
            // this.review_meta=response.documents;
        }).catch(error => {
            console.log(error); // error
            this.$store.commit("setSignedInStatus", false);
        });

    },
    signOut() {
        appwrite.account.deleteSession('current').then(response => {
            console.log(response); // Success
            this.$store.commit("setActiveUser", {id: null,
                                               name: null});          
            this.$store.commit("setSignedInStatus", false);          
            // this.review_meta=response.documents;
        }).catch(error => {
            console.log(error); // error
        });


      

    }
  },

  mounted() {
      console.log(appwrite.endpoint);
      this.updateReviewMeta();
      this.getSession();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
