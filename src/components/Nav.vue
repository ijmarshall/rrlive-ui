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

        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <em>Select review</em>
          </template>
          <b-dropdown-item href="#" v-for="review in review_meta" :key="review[1].review_uuid">{{ review[1].title }}</b-dropdown-item>
          
        </b-nav-item-dropdown>

<b-nav-item-dropdown right>
          <template #button-content>
            <em>User</em>
          </template>
          <b-dropdown-item href="#">Profile</b-dropdown-item>
          <b-dropdown-item href="#" v-on:click="login">Login (Github)</b-dropdown-item>
          <b-dropdown-item href="#">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  
</template>

<script>
import appwrite from '../AppwriteInit.js'

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
    }

  },
  methods: {
    login: function() {
        appwrite.account.createOAuth2Session('github', 'http://localhost:8080/', 'http://localhost:8080/').then(response => {
          console.log(response);
          this.$store.commit("setSignedInStatus", true);
          

        }).catch(error => {
          console.log(error)
        });
        this.updateReviewMeta();
    },
    updateReviewMeta: function () {
      
        appwrite.database.listDocuments('60341a2457ca1').then(response => {
            console.log(response); // Success
            this.review_meta=Object.entries(response.documents);
        }).catch(error => {
            console.log(error); // Success
        });



    },    
    getSessions() {



        appwrite.account.get().then(response => {
            console.log(response); // Success
            // this.review_meta=response.documents;
        }).catch(error => {
            console.log(error); // error
        });

    }
  },
  mounted() {
      
      this.updateReviewMeta();
      this.getSessions();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
