<template>
  <b-container fluid="xs"  class="shadow-sm p-4 bg-white rounded">
    <h1>RobotReviewer Live Summary</h1>
    <p>RobotReviewer LIVE is an interface to produce semi-automatic, living, systematic reviews</p>
    
    <b-card title="Live-updating abstract">
    

    <strong>BACKGROUND</strong>
    <p></p>
    <strong>METHODS</strong>
    <p></p>

    <strong>RESULTS</strong>
    <p></p>
    <strong>AUTOMATIC UPDATES</strong>
    <p>{{ summary }}</p>
    
    <p>INSERT NARRATIVE SUMMARY HERE</p>

    <strong>CONCLUSIONS</strong>
    <p></p>
  </b-card>


  </b-container>

</template>


<script>
import axios from 'axios';
import settings from '../settings.js'


export default {
  name: "Summary",
  components: {},
  data() {
    return {
      summary: ''
    }
  },
  // computed: {
  //   summary() {

  //     return this.$store.getters.getSummary;
  //   },
  methods: {
    updateSummary() {

      // var summary;

          axios
          .get(`${settings.url}/api/get_review_update/${this.$route.params.revid}`)
          .then(response => {
            this.summary = response.data;              
          }).catch(error => {
              console.log(error); // error
          });
      // this.summary = summary;
    
  },
  },
  mounted() {
    this.updateSummary()
  }
};

</script>


<style scoped>
</style>
